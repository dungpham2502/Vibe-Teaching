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

// Welcome screen component for empty state - enhanced with suggestions
const WelcomeScreen = ({ onSuggestionClick }) => {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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
        
        {/* Learning suggestion section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-indigo-700 font-semibold mb-3 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            <span>Let's Start Learning</span>
          </h3>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <SuggestionButton 
                icon={Stars} 
                title="Explain how the solar system works" 
                onClick={() => onSuggestionClick("Explain how the solar system works for a 5th grade science class. Make it fun and engaging!")}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <SuggestionButton 
                icon={Sparkles} 
                title="Create a math lesson about fractions" 
                onClick={() => onSuggestionClick("Create a video lesson about adding fractions with different denominators for 4th graders.")}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <SuggestionButton 
                icon={BookOpen} 
                title="Teach about photosynthesis" 
                onClick={() => onSuggestionClick("Create a video explaining photosynthesis with simple visuals for middle school students.")}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <SuggestionButton 
                icon={Rocket} 
                title="History of space exploration" 
                onClick={() => onSuggestionClick("Make a video about the history of space exploration highlighting key missions and discoveries.")}
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm text-gray-500"
        >
          Or type your own message below to begin
        </motion.div>
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

  // Function to handle clicks on learning suggestions
  const handleSuggestionClick = (suggestion: string) => {
    // Directly set the welcome input value
    const welcomeInput = document.getElementById('welcomeInput') as HTMLTextAreaElement;
    if (welcomeInput) {
      welcomeInput.value = suggestion;
      welcomeInput.focus();
      
      // Simulate input event to trigger resize
      const inputEvent = new Event('input', { bubbles: true });
      welcomeInput.dispatchEvent(inputEvent);
    }
    
    // Log for debugging
    console.log("Suggestion clicked, populating welcome input:", suggestion);
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
        // Welcome screen with just search input
        <div className="w-full flex flex-col h-full transition-all duration-500">
          <div className="flex-1 min-h-0">
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="px-4 pb-8 pt-2"
          >
            {/* Input bar only */}
            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).elements.namedItem('promptInput') as HTMLTextAreaElement;
                  if (input.value.trim()) {
                    // Create a user message
                    const newMessage: Message = {
                      id: `user-${Date.now()}`,
                      type: "user",
                      content: input.value.trim(),
                    };
                    
                    // Update shared messages
                    setSharedMessages([newMessage]);
                    
                    // Trigger content generation
                    handleSendMessage(input.value.trim());
                    
                    // Clear input
                    input.value = '';
                  }
                }}
                className="relative w-full rounded-2xl border border-purple-200 bg-white shadow-md p-3"
              >
                <textarea
                  id="welcomeInput"
                  name="promptInput"
                  className="min-h-[24px] max-h-[160px] w-full resize-none border-0 bg-transparent p-0 pl-3 focus-visible:ring-0 text-base text-black placeholder:text-purple-300 outline-none"
                  placeholder="Ask me to create an educational video..."
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      (e.target as HTMLTextAreaElement).form?.requestSubmit();
                    }
                  }}
                ></textarea>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white transition-all shadow-md flex items-center justify-center"
                >
                  <Button
                    type="submit"
                    size="icon"
                    className="p-0"
                  >
                    <span className="sr-only">Send message</span>
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
