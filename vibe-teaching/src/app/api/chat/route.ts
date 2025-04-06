import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { systemPrompt, userPrompt } from "@/utils/groq/prompts";
import { Scene } from "@/types/remotion-types";
import { convertJsonToRemotionTypes } from "@/lib/json-parser";
import { v4 as uuidv4 } from "uuid";
import xml2js from "xml2js";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY!,
});

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

function convertXML(inp: any) {
	const parser = new xml2js.Parser({ explicitArray: false });

	// Example usage:
	let res = {};
	parser.parseString(inp, (err, result) => {
		if (err) {
			console.log(err.message);
			console.log("ERRROR!!!!!!");
			res = {};
		} else {
			console.log("RESULT: ", JSON.stringify(result, null, 4));
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
function convertXmlToJson(xmlContent: string | null): Scene[] | null {
	if (!xmlContent) return null;

	try {
		// Convert XML to intermediate JSON format
		const intermediateJson = convertXML(xmlContent);

		// Convert intermediate JSON to Remotion types
		const remotionJson = convertJsonToRemotionTypes(intermediateJson);

		// Add unique keys to each scene and its children
		return remotionJson.map((scene, sceneIndex) => {
			// Add unique key to scene
			const sceneWithKey = {
				...scene,
				// id: `scene-${sceneIndex}`,
				id: uuidv4(),
			};

			// Add unique keys to children
			if (sceneWithKey.children && sceneWithKey.children.length > 0) {
				sceneWithKey.children = sceneWithKey.children.map(
					(child, childIndex) => ({
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

		// Generate content from Groq
		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt + userInput },
			],
			model: "llama3-8b-8192",
		});

		// Extract the response content
		const responseContent = chatCompletion.choices[0]?.message?.content || "";

		// Extract XML content if present
		const xmlContent = extractXmlContent(responseContent);

		console.log("XML: ", xmlContent);

		// Convert XML to JSON if XML content is found
		const jsonContent = convertXmlToJson(xmlContent);

		console.log("JSON: ", jsonContent);
		// Return the full response, extracted XML, and the converted JSON
		return NextResponse.json(
			{
				content: responseContent,
				xmlContent,
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
