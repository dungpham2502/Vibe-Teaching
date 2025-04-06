"use client";

import { useState, useCallback } from "react";
import { Eye, Lightbulb, Stars, Sparkles, BookOpen, Rocket, ArrowUp } from "lucide-react";
import ChatInterface from "./chat/chat-interface";
import Timeline from "./timeline/timeline";
import Preview from "./preview/preview";
import { Button } from "@/components/ui/button";
import { Message } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

// Define TimelineItem interface for type safety
interface TimelineItem {
	id: string;
	title: string;
	videoUrl?: string;
	thumbnail?: string;
}

// Enhanced suggestion button component for welcome screen
const SuggestionButton = ({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center gap-2 bg-white rounded-xl px-4 py-3 text-indigo-700 border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all w-full text-left"
    onClick={onClick}
  >
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-indigo-600" />
    </div>
    <span className="font-medium">{title}</span>
  </motion.button>
);

// Welcome screen component for empty state - simplified now that suggestions are in ChatInterface
const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center px-6 py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 relative h-80 w-full"
        >
          <Image 
            src="/welcome-illustration.svg" 
            alt="Welcome to Vibe Teaching"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl font-bold mb-4 text-indigo-700 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
        >
          Welcome to Vibe Teaching
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-600 mb-6 text-lg max-w-lg mx-auto"
        >
          Start by describing the lesson you want to create. Our AI will generate
          video lessons based on your conversation.
        </motion.p>
      </div>
    </div>
  );
};

export default function Wrapper() {
  // State to track if we have content to display
  const [hasContent, setHasContent] = useState(false);
  // State to track if we're generating a video (loading state)
  const [isGenerating, setIsGenerating] = useState(false);
  // Currently selected timeline item
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<
    TimelineItem | undefined
  >(undefined);
  // Shared messages state to preserve across layout changes
  const [sharedMessages, setSharedMessages] = useState<Message[]>([]);
  // View mode state (normal or focus/blur background)
  const [isViewMode, setIsViewMode] = useState(false);

  // Function to handle new messages - will be passed to both chat interfaces
  const handleMessageUpdate = useCallback((messages: Message[]) => {
    setSharedMessages(messages);
  }, []);

  const handleSendMessage = (message: string) => {
    // When a message is sent, start the generation process
    setIsGenerating(true);

    // Simulate video generation with a timeout
    setTimeout(() => {
      setIsGenerating(false);
      setHasContent(true);
    }, 100); // Simulate quick delay for video generation
  };

  const handleReceiveMessage = (message: string) => {
    console.log("Received message:", message);
  };

  const handleTimelineItemSelect = (item: TimelineItem) => {
    setSelectedTimelineItem(item);
  };

  // Function to toggle view mode (with blurred background)
  const toggleViewMode = () => {
    setIsViewMode(!isViewMode);
  };

  return (
    <div
      className={cn(
        "flex w-full h-screen transition-all duration-500",
        isViewMode && hasContent ? "bg-gray-900/80" : "bg-gradient-to-br from-indigo-50 to-purple-50"
      )}
    >
      {hasContent ? (
        // Three-panel layout when content exists
        <>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-[20%] transition-all duration-500 relative",
              isViewMode ? "opacity-30" : ""
            )}
          >
            <Timeline onSelectItem={handleTimelineItemSelect} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "w-[40%] transition-all duration-500 relative",
              isViewMode ? "z-10" : ""
            )}
          >
            <Preview
              selectedItem={selectedTimelineItem}
              isLoading={isGenerating}
            />

            {/* Control buttons - positioned in the top right of the preview panel */}
            <div className="absolute top-4 right-4 flex gap-2">
              {/* Toggle view mode button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={toggleViewMode}
                  className={cn(
                    "rounded-full w-8 h-8 p-0 shadow-md transition-colors",
                    isViewMode
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-white hover:bg-gray-100"
                  )}
                  title={isViewMode ? "Exit view mode" : "Enter view mode"}
                >
                  <Eye
                    className={cn(
                      "h-4 w-4",
                      isViewMode ? "text-white" : "text-gray-600"
                    )}
                  />
                  <span className="sr-only">
                    {isViewMode ? "Exit view mode" : "Enter view mode"}
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              "w-[40%] transition-all duration-500",
              isViewMode ? "opacity-30" : ""
            )}
          >
            <ChatInterface
              onSendMessage={handleSendMessage}
              onReceiveMessage={handleReceiveMessage}
              initialMessages={sharedMessages}
              onMessagesChange={handleMessageUpdate}
            />
          </motion.div>
        </>
      ) : (
        // Welcome screen with integrated ChatInterface
        <div className="w-full flex flex-col h-full transition-all duration-500">
          <div className="flex-1 min-h-0 relative">
            {/* Welcome illustration and header that remains visible */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center w-full py-8 px-6 bg-gradient-to-br from-indigo-50 to-purple-50"
            >
              <div className="max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 relative h-60 w-full"
                >
                  <Image 
                    src="/welcome-illustration.svg" 
                    alt="Welcome to Vibe Teaching"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl font-bold mb-4 text-center text-indigo-700 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  Welcome to Vibe Teaching
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-gray-600 mb-6 text-lg max-w-lg mx-auto text-center"
                >
                  Start by describing the lesson you want to create. Our AI will generate
                  video lessons based on your conversation.
                </motion.p>
              </div>
            </motion.div>
            
            {/* Position the ChatInterface at the bottom of the welcome screen */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="px-4 pb-8 pt-0"
            >
              <div className="max-w-2xl mx-auto">
                <ChatInterface
                  onSendMessage={(message) => {
                    handleSendMessage(message);
                    // Don't add message to shared messages, that will be handled by the component
                  }}
                  onReceiveMessage={handleReceiveMessage}
                  initialMessages={[]}
                  onMessagesChange={(messages) => {
                    handleMessageUpdate(messages);
                    // If we get messages, also trigger content generation
                    if (messages.length > 0) {
                      setHasContent(true);
                    }
                  }}
                  isFullWidth={true}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
