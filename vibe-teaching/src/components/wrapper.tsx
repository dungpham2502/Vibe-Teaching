"use client"

import { useState } from "react"
import ChatInterface from "./chat/chat-interface"
import Timeline from "./timeline/timeline"
import Preview from "./preview/preview"

// Define TimelineItem interface for type safety
interface TimelineItem {
  id: string
  title: string
  videoUrl: string
  thumbnail?: string
}

export default function Wrapper() {
  // State to track if we have content to display
  const [hasContent, setHasContent] = useState(false)
  // State to track if we're generating a video (loading state)
  const [isGenerating, setIsGenerating] = useState(false)
  // Currently selected timeline item
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<TimelineItem | undefined>(undefined)

  const handleSendMessage = (message: string) => {
    console.log("Sent message:", message)
    
    // When a message is sent, start the generation process
    setIsGenerating(true)
    
    // Simulate video generation with a timeout
    setTimeout(() => {
      setIsGenerating(false)
      setHasContent(true)
    }, 3000) // Simulate 3 second delay for video generation
  }

  const handleReceiveMessage = (message: string) => {
    console.log("Received message:", message)
  }
  
  const handleTimelineItemSelect = (item: TimelineItem) => {
    setSelectedTimelineItem(item)
  }

  return (
    <div className="flex w-full h-screen transition-all duration-500">
      {hasContent ? (
        // Three-panel layout when content exists
        <>
          <div className="w-[20%] transition-all duration-500">
            <Timeline onSelectItem={handleTimelineItemSelect} />
          </div>
          <div className="w-[40%] transition-all duration-500">
            <Preview selectedItem={selectedTimelineItem} isLoading={isGenerating} />
          </div>
          <div className="w-[40%] transition-all duration-500">
            <ChatInterface 
              onSendMessage={handleSendMessage}
              onReceiveMessage={handleReceiveMessage}
            />
          </div>
        </>
      ) : (
        // Full-width chat interface when no content
        <div className="w-full transition-all duration-500">
          <ChatInterface 
            onSendMessage={handleSendMessage}
            onReceiveMessage={handleReceiveMessage}
          />
        </div>
      )}
    </div>
  )
}