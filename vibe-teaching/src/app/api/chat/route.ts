import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { systemPrompt, userPrompt } from "@/utils/groq/prompts";
import { Scene, RemotionObject } from "@/types/remotion-types";
import { convertJsonToRemotionTypes } from "@/lib/json-parser";
import { v4 as uuidv4 } from "uuid";
import xml2js from "xml2js";
import { Message } from "@/hooks/use-chat";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY!,
});

/**
 * Sanitizes XML content by escaping ampersands in URL attributes
 * @param xmlContent The raw XML content
 * @returns Sanitized XML with escaped ampersands in URLs
 */
function sanitizeXml(xmlContent: string): string {
	if (!xmlContent) return "";
	
	
	// Process each image tag separately to correctly handle multiple ampersands
	const sanitized = xmlContent.replace(
		/<image[^>]*src=["'](https?:\/\/[^"']+)["'][^>]*>/g,
		(fullTag, url) => {
			// Replace all unescaped ampersands in the URL with &amp;
			// But don't double-escape if some are already escaped
			const sanitizedUrl = url.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;");
			// Replace the original URL with the sanitized one
			const result = fullTag.replace(url, sanitizedUrl);

			return result;
		}
	);
	

	return sanitized;
}

/**
 * Extracts XML content from a string
 * @param text The text containing XML
 * @returns The extracted XML content or null if not found
 */
function extractXmlContent(text: string): string | null {
	// Look for content between triple backticks with or without 'xml' marker
	const xmlRegex = /```(?:xml)?\s*(<content>[\s\S]*?<\/content>)\s*```/;
	const match = text.match(xmlRegex);

	if (match && match[1]) {
		// Return only the XML content without the backticks and language marker
		return match[1];
	}

	// If not found with backticks, try direct XML detection
	const directXmlRegex = /(<content>[\s\S]*?<\/content>)/;
	const directMatch = text.match(directXmlRegex);

	if (directMatch && directMatch[1]) {
		return directMatch[1];
	}

	return null;
}

function convertXML(inp: string): Record<string, any> { // eslint-disable-line @typescript-eslint/no-explicit-any
	const parser = new xml2js.Parser({ explicitArray: false });

	console.log("INPUT: ", inp);
	// Example usage:
	let res: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
	parser.parseString(inp, (err, result) => {
		if (err) {
			console.error("Error parsing XML:", err);
			res = {};
		} else {
			res = result;
		}
	});
	return res;
}

/**
 * Converts XML content to a Remotion-compatible JSON structure
 * with unique keys for each element
 * @param xmlContent The XML content to convert
 * @returns The converted JSON or null if conversion failed
 */
async function convertXmlToJson(xmlContent: string | null): Promise<Scene[] | null> {
	if (!xmlContent) return null;
	try {
		// Convert XML to intermediate JSON format
		const intermediateJson = convertXML(xmlContent);

		// Ensure scene is an array before converting to Remotion types
		if (intermediateJson?.content?.scene && !Array.isArray(intermediateJson.content.scene)) {
			// If scene is not an array, wrap it in an array
			intermediateJson.content.scene = [intermediateJson.content.scene];
		}

		// Convert intermediate JSON to Remotion types
		const remotionJson = await convertJsonToRemotionTypes(intermediateJson);

		// Add unique keys to each scene and its children
		return remotionJson.map((scene: Scene) => {
			// Add unique key to scene
			const sceneWithKey = {
				...scene,
				// id: `scene-${sceneIndex}`,
				id: uuidv4(),
			};

			// Add unique keys to children
			if (sceneWithKey.children && sceneWithKey.children.length > 0) {
				sceneWithKey.children = sceneWithKey.children.map(
					(child: RemotionObject) => ({
						...child,
						id: uuidv4(),
					})
				);
			}

			return sceneWithKey;
		});
	} catch (error) {
		console.error("Error converting XML to JSON:", error);
		return null;
	}
}

export async function POST(request: Request) {
	try {
		// Parse the request body to get the user's input
		const body = await request.json();
		const userInput = body.prompt || "";
		const messagesHistory: Message[] = body.messages || [];

		// Build the messages array for Groq from the message history
		const groqMessages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [
			{ role: "system", content: systemPrompt }
		];

		// Add only the most recent messages
		if (messagesHistory.length > 0) {
			// Find latest user message (which should be the last non-empty one)
			const latestUserMessage = messagesHistory
				.filter(msg => msg.type === "user" && msg.content.trim())
				.pop();
			
			// Find latest assistant message if it exists (coming before the latest user message)
			let latestAssistantMessage = null;
			if (latestUserMessage) {
				const userMessageIndex = messagesHistory.findIndex(msg => msg.id === latestUserMessage.id);
				// Look for the most recent assistant message before this user message
				for (let i = userMessageIndex - 1; i >= 0; i--) {
					if (messagesHistory[i].type === "system" && messagesHistory[i].content.trim()) {
						latestAssistantMessage = messagesHistory[i];
						break;
					}
				}
			}
			
			// Add the assistant message first if it exists
			if (latestAssistantMessage) {
				groqMessages.push({
					role: "assistant",
					content: latestAssistantMessage.content
				});
			}
			
			// Then add the user message
			if (latestUserMessage) {
				groqMessages.push({
					role: "user",
					content: userPrompt + latestUserMessage.content
				});
			}
		} else {
			// Fallback to just the current prompt if no history
			groqMessages.push({ role: "user", content: userPrompt + userInput });
		}

		// Generate content from Groq
		console.log("INPUT: ", groqMessages.slice(1));
		const chatCompletion = await groq.chat.completions.create({
			messages: groqMessages,
			// model: "llama-3.3-70b-versatile",
			model: "deepseek-r1-distill-llama-70b",
		});
		

		// Extract the response content
		const responseContent = chatCompletion.choices[0]?.message?.content || "";

        console.log(responseContent)

		// Extract XML content if present
		const xmlContent = extractXmlContent(responseContent);

		// Sanitize XML content to escape ampersands in URLs
		const sanitizedXmlContent = xmlContent ? sanitizeXml(xmlContent) : xmlContent;
		
		// Convert XML to JSON if XML content is found
		// Image processing now happens in the convertJsonToRemotionTypes function
		const jsonContent = await convertXmlToJson(sanitizedXmlContent);

				// Return the full response, extracted XML, and the converted JSON

		return NextResponse.json(
			{
				content: responseContent,
				xmlContent: sanitizedXmlContent, // Use sanitized XML
				jsonContent,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error processing Groq request:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
