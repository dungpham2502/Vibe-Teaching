import { useState } from "react";
import { useScenesStore } from "@/store/useScenesStore";

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
			console.log(data.jsonContent);
			setScenes(data.jsonContent || []);
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
					idx === prev.length - 1 ? { ...msg, content: text.trim() } : msg
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
