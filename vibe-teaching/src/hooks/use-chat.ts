import { useState } from "react";
import { useScenesStore } from "@/store/useScenesStore";
import { v4 } from "uuid";

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

	const { setScenes, logState } = useScenesStore();

	const getAIResponse = async (messagesHistory: Message[]) => {
		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 
					messages: messagesHistory,
					prompt: messagesHistory[messagesHistory.length - 1].content
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get AI response");
			}

			const data = await response.json();
			console.log(data.jsonContent);
			setScenes(data.jsonContent || []);
			logState();
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
		
		try {
			// Immediately set the full message content without streaming
			setMessages((prev) =>
				prev.map((msg, idx) =>
					idx === prev.length - 1 ? { ...msg, content: text.trim() } : msg
				)
			);
		} catch (error) {
			console.error("Error setting response:", error);
		} finally {
			setIsStreaming(false);
		}
	};

	const sendMessage = async (message: string) => {
		if (message.trim() && !isStreaming) {
			// Call onSendMessage if provided
			onSendMessage?.(message);

			// Add user message to messages state
			const updatedMessages: Message[] = [
				...messages,
				{
					id: v4(),
					content: message,
					type: "user" as MessageType,
				},
			];
			
			setMessages(updatedMessages);

			// Add empty system message that will be streamed
			const withEmptySystemMessage: Message[] = [
				...updatedMessages,
				{
					id: v4(),
					content: "",
					type: "system" as MessageType,
				},
			];
			
			setMessages(withEmptySystemMessage);

			// Get and stream AI response with complete message history
			const response = await getAIResponse(withEmptySystemMessage);
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
