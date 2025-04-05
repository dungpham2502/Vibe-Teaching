"use client"

import { useState, useCallback } from "react"
import { X } from "lucide-react"
import ChatInterface from "./chat/chat-interface"
import Timeline from "./timeline/timeline"
import Preview from "./preview/preview"
import { Button } from "@/components/ui/button"
import { Message } from "@/hooks/use-chat"

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
  // Shared messages state to preserve across layout changes
  const [sharedMessages, setSharedMessages] = useState<Message[]>([])

  // Function to handle new messages - will be passed to both chat interfaces
  const handleMessageUpdate = useCallback((messages: Message[]) => {
    setSharedMessages(messages);
  }, []);

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

  // Function to switch back to chat-only layout
  const handleSwitchToChatOnly = () => {
    setHasContent(false)
  }

  return (
    <div className="flex w-full h-screen transition-all duration-500">
      {hasContent ? (
        // Three-panel layout when content exists
        <>
          <div className="w-[20%] transition-all duration-500 relative">
            <Timeline onSelectItem={handleTimelineItemSelect} />
          </div>
          <div className="w-[40%] transition-all duration-500 relative">
            <Preview selectedItem={selectedTimelineItem} isLoading={isGenerating} />
            
            {/* Layout switch button - positioned in the top right of the preview panel */}
            <Button 
              onClick={handleSwitchToChatOnly}
              className="absolute top-4 right-4 rounded-full w-8 h-8 p-0 bg-white shadow-md hover:bg-gray-100"
              title="Switch to chat-only view"
            >
              <X className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Switch to chat-only view</span>
            </Button>
          </div>
          <div className="w-[40%] transition-all duration-500">
            <ChatInterface 
              onSendMessage={handleSendMessage}
              onReceiveMessage={handleReceiveMessage}
              initialMessages={sharedMessages}
              onMessagesChange={handleMessageUpdate}
            />
          </div>
        </>
      ) : (
        // Full-width chat interface when no content
        <div className="w-full transition-all duration-500">
          <ChatInterface 
            onSendMessage={handleSendMessage}
            onReceiveMessage={handleReceiveMessage}
            initialMessages={sharedMessages}
            onMessagesChange={handleMessageUpdate}
          />
        </div>
      )}
    </div>
  )
}