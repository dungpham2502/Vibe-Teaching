"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Video, Loader2, Lightbulb, Stars, Sparkles, BookOpen, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useChat, type Message } from "@/hooks/use-chat"
import Confetti from "react-confetti"
import { motion, AnimatePresence } from "framer-motion"

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------ */
interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void
  onReceiveMessage?: (message: string) => void
  initialMessages?: Message[]
  onMessagesChange?: (messages: Message[]) => void
  isFullWidth?: boolean
}

/* ------------------------------------------------------------------
   FormattedMessage Component
------------------------------------------------------------------ */
const FormattedMessage = ({ content }: { content: string }) => {
  // Detect if content contains XML content patterns
  const hasXmlContent = content.includes("<content>") && content.includes("</content>");

  // Sanitize content (example approach)
  const sanitizeContent = (text: string) => {
    let sanitized = text.replace(/```(?:xml)?\s*(?:<content>[\s\S]*?<\/content>)\s*```/g, "");
    sanitized = sanitized.replace(/<content>[\s\S]*?<\/content>/g, "");
    sanitized = sanitized.replace(/```[\s\S]*?```/g, "");
    sanitized = sanitized.replace(/Here is (?:the |a )(?:converted |)XML(?:| code| script)(?::|\.)\s*/gi, "");
    sanitized = sanitized.replace(/\n{3,}/g, "\n\n").trim();
    return sanitized;
  };

  // Highlight educational terms
  const highlightTerms = (text: string) => {
    return text.replace(
      /\b(learn|education|student|teacher|school|math|science|history|art|reading|writing)\b/gi,
      (match) => `<span class="text-purple-600 font-medium">${match}</span>`
    );
  };

  const sanitizedContent = sanitizeContent(content);
  const highlightedContent = highlightTerms(sanitizedContent);

  return (
    <>
      <div
        className="prose-sm"
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
      {hasXmlContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center my-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
        >
          <div className="relative">
            <Video className="w-8 h-8 text-blue-500 mr-3" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
            />
          </div>
          <div>
            <span className="text-sm text-blue-700 font-medium">Video lesson created!</span>
            <p className="text-xs text-blue-500 mt-1">Use the preview panel to watch it</p>
          </div>
        </motion.div>
      )}
    </>
  );
};

/* ------------------------------------------------------------------
   ChatBubble Component
------------------------------------------------------------------ */
const ChatBubble = ({
  type,
  children,
}: {
  type: "user" | "system";
  children: React.ReactNode;
}) => {
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={cn("flex flex-col", type === "user" ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl overflow-auto max-h-[70vh] shadow-sm",
          type === "user"
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 rounded-br-none text-white"
            : "bg-gradient-to-r from-white to-blue-50 border border-blue-100 text-gray-900"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------
   Main ChatInterface Component
------------------------------------------------------------------ */
export default function ChatInterface({
  onSendMessage,
  onReceiveMessage,
  initialMessages = [],
  onMessagesChange,
  isFullWidth = false,
}: ChatInterfaceProps) {
  const { messages, isStreaming, sendMessage } = useChat({
    onSendMessage,
    onReceiveMessage,
    initialMessages,
  });

  const [inputValue, setInputValue] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true); // Control suggestion visibility

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for populateChatInput event from suggestion buttons
  useEffect(() => {
    const handlePopulateInput = (event: any) => {
      // Set the input value to the suggested text
      setInputValue(event.detail.text);
      
      // Focus the textarea and resize it
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
      }
    };
    
    // Add event listener
    window.addEventListener('populateChatInput', handlePopulateInput);
    
    // Clean up
    return () => {
      window.removeEventListener('populateChatInput', handlePopulateInput);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Notify parent component of message changes
  useEffect(() => {
    onMessagesChange?.(messages);
    
    // Hide suggestions when we have messages
    if (messages.length > 0) {
      setShowSuggestions(false);
    }
  }, [messages, onMessagesChange]);

  // Show confetti when a <content>...</content> block is in the last message
  useEffect(() => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage.type === "system" &&
        lastMessage.content.includes("<content>") &&
        lastMessage.content.includes("</content>")
      ) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isStreaming) {
      setInputValue(e.target.value);

      // Auto-resize textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (message && !isStreaming) {
      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      console.log("Sending message:", message);
      await sendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
      textareaRef.current.focus();
    }
  };

  // Enhanced suggestion button component (moved from wrapper)
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
    <div
      className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-purple-50 relative"
      ref={containerRef}
    >
      {/* Confetti effect when a video gets generated */}
      {showConfetti && (
        <Confetti
          width={containerRef.current?.offsetWidth || 300}
          height={containerRef.current?.offsetHeight || 300}
          recycle={false}
        />
      )}

      {/* Messages scroll area */}
      <div
        className={cn(
          "flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent",
          isFullWidth ? "px-3 py-6" : "p-6"
        )}
      >
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length > 0 ? (
            <AnimatePresence>
              {messages.map((message) => (
                <ChatBubble key={message.id} type={message.type}>
                  <FormattedMessage content={message.content} />
                </ChatBubble>
              ))}
              
              {/* Add thinking indicator when streaming */}
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-start"
                >
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-none bg-gradient-to-r from-white to-blue-50 border border-blue-100 text-gray-900">
                    <div className="flex space-x-2">
                      <motion.div 
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-indigo-400" 
                      />
                      <motion.div 
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-indigo-500" 
                      />
                      <motion.div 
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-indigo-600" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : isFullWidth && showSuggestions ? (
            // Show suggestions in the chat area when in full width mode and no messages yet
            <div className="mt-8">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-indigo-700 font-semibold mb-3 flex items-center justify-center"
              >
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                <span>Let's Start Learning</span>
              </motion.h3>
              
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
                    onClick={() => handleSuggestionClick("Explain how the solar system works for a 5th grade science class. Make it fun and engaging!")}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <SuggestionButton 
                    icon={Sparkles} 
                    title="Create a math lesson about fractions" 
                    onClick={() => handleSuggestionClick("Create a video lesson about adding fractions with different denominators for 4th graders.")}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <SuggestionButton 
                    icon={BookOpen} 
                    title="Teach about photosynthesis" 
                    onClick={() => handleSuggestionClick("Create a video explaining photosynthesis with simple visuals for middle school students.")}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <SuggestionButton 
                    icon={Rocket} 
                    title="History of space exploration" 
                    onClick={() => handleSuggestionClick("Make a video about the history of space exploration highlighting key missions and discoveries.")}
                  />
                </motion.div>
              </motion.div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "bg-white/70 backdrop-blur-sm border-t border-purple-100",
          isFullWidth ? "px-3 py-6" : "p-6"
        )}
      >
        <form
          onSubmit={handleSubmit}
          className={cn(isFullWidth ? "max-w-3xl" : "max-w-2xl", "mx-auto")}
        >
          <div className="relative w-full rounded-2xl border border-purple-200 bg-white shadow-sm p-3">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              className="min-h-[24px] max-h-[160px] w-full resize-none border-0 bg-transparent p-0 pl-3 focus-visible:ring-0 text-base text-black placeholder:text-purple-300 outline-none"
              placeholder="Ask me to create an educational video..."
            />

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "absolute bottom-3 right-3 h-10 w-10 rounded-full transition-all shadow-md flex items-center justify-center",
                inputValue.trim() && !isStreaming
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              <Button
                type="submit"
                size="icon"
                className="p-0"
                disabled={!inputValue.trim() || isStreaming}
              >
                <span className="sr-only">Send message</span>
                <ArrowUp className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
