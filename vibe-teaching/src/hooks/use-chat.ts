import { useState } from "react"

export type MessageType = "user" | "system"

export interface Message {
  id: string
  content: string
  type: MessageType
}

interface UseChatProps {
  onSendMessage?: (message: string) => void
  onReceiveMessage?: (message: string) => void
  initialMessages?: Message[]
}

export function useChat({
  onSendMessage,
  onReceiveMessage,
  initialMessages = [],
}: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)

  const getAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response was not JSON")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error fetching AI response:", error)
      return "I'm sorry, I couldn't process your request at the moment."
    }
  }

  const streamResponse = async (text: string) => {
    const words = text.split(" ")
    let currentContent = ""
    setIsStreaming(true)

    for (let i = 0; i < words.length; i += 2) {
      const chunk = words.slice(i, i + 2).join(" ")
      currentContent += chunk + " "
      
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 ? { ...msg, content: currentContent.trim() } : msg
        )
      )
      
      await new Promise(resolve => setTimeout(resolve, 40))
    }

    setIsStreaming(false)
  }

  const sendMessage = async (message: string) => {
    if (message.trim() && !isStreaming) {
      // Call onSendMessage if provided
      onSendMessage?.(message)

      // Add user message
      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        content: message,
        type: "user"
      }])

      // Add empty system message that will be streamed
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        content: "",
        type: "system"
      }])

      // Get and stream AI response
      const response = await getAIResponse(message)
      onReceiveMessage?.(response)
      await streamResponse(response)
    }
  }

  return {
    messages,
    isStreaming,
    sendMessage
  }
} 