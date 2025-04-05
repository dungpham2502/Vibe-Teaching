import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { systemPrompt, userPrompt } from "@/utils/groq/prompts";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
});
console.log(process.env.NEXT_PUBLIC_GROQ_API_KEY);

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

    return NextResponse.json({ content: responseContent }, { status: 200 });
  } catch (error) {
    console.error("Error processing Groq request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 