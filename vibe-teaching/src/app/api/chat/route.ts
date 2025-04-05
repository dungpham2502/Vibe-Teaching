import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { systemPrompt, userPrompt } from "@/utils/groq/prompts";

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY!,
});

/**
 * Extracts XML content from a string
 * @param text The text containing XML
 * @returns The extracted XML content or null if not found
 */
function extractXmlContent(text: string): string | null {
	// Look for content between XML/code tags
	const xmlRegex = /```(?:xml)?\s*(<content>[\s\S]*?<\/content>)\s*```/;
	const match = text.match(xmlRegex);

	if (match && match[1]) {
		return match[1];
	}

	return null;
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

		// Return both the full response and the extracted XML
		return NextResponse.json(
			{
				content: responseContent,
				xmlContent,
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
