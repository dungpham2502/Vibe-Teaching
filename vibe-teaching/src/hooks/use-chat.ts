import { useEffect } from "react";
import { useScenesStore } from "@/store/useScenesStore";
import { useMessageStore } from "@/store/useMessageStore";

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
    // Get everything we need from the message store
    const { 
        messages, 
        isStreaming, 
        setMessages, 
        addMessage, 
        updateLastMessage, 
        setIsStreaming 
    } = useMessageStore();

    // Get scene-related actions from the scenes store
    const { setScenes, logState } = useScenesStore();

    // Initialize with initial messages if provided and store is empty
    useEffect(() => {
        if (initialMessages.length > 0 && messages.length === 0) {
            setMessages(initialMessages);
        }
    }, [initialMessages, messages.length, setMessages]);

    // Log when messages are updated (keeping existing logging)
    useEffect(() => {
        console.log("Messages updated:", messages);
    }, [messages]);

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
            // Use store action instead of direct state manipulation
            updateLastMessage(text.trim());
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

            // Add user message using store action
            addMessage(message, "user");

            // Add empty system message that will be streamed
            addMessage("", "system");

            // Get and stream AI response with complete message history
            // We need to pass the updated messages array for correct API call
            const currentMessages = [...messages, 
                { id: "", content: message, type: "user" },
                { id: "", content: "", type: "system" }
            ];
            const response = await getAIResponse(currentMessages);
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
