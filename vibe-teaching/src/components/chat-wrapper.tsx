"use client"

import ChatInterface from "./chat-interface"

export default function ChatWrapper() {
  const handleSendMessage = (message: string) => {
    console.log("Sent message:", message)
  }

  const handleReceiveMessage = (message: string) => {
    console.log("Received message:", message)
  }

  return (
    <ChatInterface 
      onSendMessage={handleSendMessage}
      onReceiveMessage={handleReceiveMessage}
    />
  )
} 