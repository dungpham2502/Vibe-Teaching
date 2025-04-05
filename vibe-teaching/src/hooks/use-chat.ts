import { useState } from "react";
import { useScenesStore } from "@/store/useScenesStore";
import { convertJsonToRemotionTypes } from "@/lib/json-parser";

export type MessageType = "user" | "system";

export interface Message {
	id: string;
	content: string;
	type: MessageType;
}

interface UseChatProps {
	onSendMessage?: (message: string) => void;
	onReceiveMessage?: (message: string) => void;
	initialMessages?: Message[];
}


export function useChat({
	onSendMessage,
	onReceiveMessage,
	initialMessages = [],
}: UseChatProps) {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [isStreaming, setIsStreaming] = useState(false);

	const { setScenes } = useScenesStore();

	const getAIResponse = async (userMessage: string) => {
		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: userMessage }),
			});

			if (!response.ok) {
				throw new Error("Failed to get AI response");
			}

			const data = await response.json();
			console.log(data.xmlContent);
			
			// Using hardcoded test data instead of parsing the API response
			const testScenes = [
				{
					"type": "scene",
					"class": "w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900",
					"durationInFrames": 150,
					"desc": "Introduction",
					"children": [
						{
							"type": "title",
							"class": "max-w-[1536px] text-8xl md:text-9xl font-bold text-center text-blue-600 dark:text-blue-400 animate-fade-in",
							"durationInFrames": 150,
							"text": "Learning About Shapes"
						}
					]
				},
				{
					"type": "scene",
					"class": "w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900",
					"durationInFrames": 300,
					"desc": "Definition",
					"children": [
						{
							"type": "heading",
							"class": "max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6",
							"durationInFrames": 150,
							"text": "What is a Shape?"
						},
						{
							"type": "paragraph",
							"class": "max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed",
							"durationInFrames": 150,
							"text": "A shape is an area with a specific boundary. It can be found in everyday objects like circles, squares, and triangles."
						}
					]
				},
				{
					"type": "scene",
					"class": "w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900",
					"durationInFrames": 450,
					"desc": "Examples",
					"children": [
						{
							"type": "heading",
							"class": "max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6",
							"durationInFrames": 150,
							"text": "Examples of Shapes"
						},
						{
							"type": "image",
							"class": "max-w-[1536px] h-[864px] object-contain rounded-lg shadow-lg mx-auto my-4",
							"durationInFrames": 300,
							"src": "[insert image URL]"
						},
						{
							"type": "paragraph",
							"class": "max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed mx-4",
							"durationInFrames": 150,
							"text": "These are just a few examples of the many shapes you can find in the world around you."
						}
					]
				},
				{
					"type": "scene",
					"class": "w-[1920px] h-[1080px] flex flex-col items-center justify-center px-[1920px/12.2] py-[1080px/12] bg-gray-50 dark:bg-gray-900",
					"durationInFrames": 600,
					"desc": "Conclusion",
					"children": [
						{
							"type": "heading",
							"class": "max-w-[1536px] text-6xl md:text-7xl font-bold text-center text-gray-700 dark:text-gray-300 my-6",
							"durationInFrames": 150,
							"text": "Conclusion"
						},
						{
							"type": "paragraph",
							"class": "max-w-[1344px] text-3xl md:text-4xl text-center text-gray-700 dark:text-gray-300 leading-relaxed",
							"durationInFrames": 150,
							"text": "Learning about shapes is an important part of math and art. Remember to observe the world around you and find examples of different shapes."
						}
					]
				}
			];
			
			// Set the test scenes data directly
			setScenes(testScenes);

			return (
				data.content ||
				"I'm sorry, I couldn't process your request at the moment."
			);
		} catch (error) {
			console.error("Error getting AI response:", error);
			return "I'm sorry, I couldn't process your request at the moment.";
		}
	};

	const streamResponse = async (text: string) => {
		setIsStreaming(true);
		
		// Split text into words
		const words = text.split(" ");
		let currentContent = "";
		
		// Determine appropriate chunk size and delay based on content length
		// For XML content, use larger chunks but keep streaming visible
		const isLongContent = text.length > 1000;
		const chunkSize = isLongContent ? 10 : 2;
		const delay = isLongContent ? 20 : 40;
		
		try {
			// Stream the content in chunks
			for (let i = 0; i < words.length; i += chunkSize) {
				const chunk = words.slice(i, i + chunkSize).join(" ");
				currentContent += chunk + " ";
				
				setMessages((prev) =>
					prev.map((msg, idx) =>
						idx === prev.length - 1
							? { ...msg, content: currentContent.trim() }
							: msg
					)
				);
				
				// Use a proper delay to ensure UI updates
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		} catch (error) {
			console.error("Error streaming response:", error);
		} finally {
			// Ensure final content is set and streaming state is properly turned off
			setMessages((prev) =>
				prev.map((msg, idx) =>
					idx === prev.length - 1
						? { ...msg, content: text.trim() }
						: msg
				)
			);
			setIsStreaming(false);
		}
	};

	const sendMessage = async (message: string) => {
		if (message.trim() && !isStreaming) {
			// Call onSendMessage if provided
			onSendMessage?.(message);

			// Add user message
			setMessages((prev) => [
				...prev,
				{
					id: `user-${Date.now()}`,
					content: message,
					type: "user",
				},
			]);

			// Add empty system message that will be streamed
			setMessages((prev) => [
				...prev,
				{
					id: `system-${Date.now()}`,
					content: "",
					type: "system",
				},
			]);

			// Get and stream AI response
			const response = await getAIResponse(message);
			onReceiveMessage?.(response);
			await streamResponse(response);
		}
	};

	return {
		messages,
		isStreaming,
		sendMessage,
	};
}
