"use client"

import ChatInterface from "./chat/chat-interface"
import Timeline from "./timeline/timeline"
import Preview from "./preview/preview"

export default function Wrapper() {
  const handleSendMessage = (message: string) => {
    console.log("Sent message:", message)
  }

  const handleReceiveMessage = (message: string) => {
    console.log("Received message:", message)
  }

  return (
    <div className="flex w-full">
      <div className="w-[20%]">
        <Timeline />
      </div>
      <div className="w-[40%]">
        <Preview />
      </div>
      <div className="w-[40%]">
        <ChatInterface 
          onSendMessage={handleSendMessage}
          onReceiveMessage={handleReceiveMessage}
        />
      </div>
    </div>
  )
} 