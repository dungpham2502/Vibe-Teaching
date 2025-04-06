"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useChat, type Message } from "@/hooks/use-chat"

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void
  onReceiveMessage?: (message: string) => void
  initialMessages?: Message[]
  onMessagesChange?: (messages: Message[]) => void
  isFullWidth?: boolean
}

// Component to format message content, replacing XML with video icon
const FormattedMessage = ({ content }: { content: string }) => {
  // Detect if content contains XML content patterns
  
  const hasXmlContent = content.includes("<content>") && content.includes("</content>");
  
  // Sanitize content by removing triple backticks and XML code blocks
  const sanitizeContent = (text: string) => {
    // Remove ```xml blocks and their content
    let sanitized = text.replace(/```(?:xml)?\s*(?:<content>[\s\S]*?<\/content>)\s*```/g, "");
    
    // Remove direct XML tags and their content
    sanitized = sanitized.replace(/<content>[\s\S]*?<\/content>/g, "");
    
    // Remove other code blocks with triple backticks
    sanitized = sanitized.replace(/```[\s\S]*?```/g, "");
    
    // Remove phrases like "Here is the converted XML code:" or similar
    sanitized = sanitized.replace(/Here is (?:the |a )(?:converted |)XML(?:| code| script)(?::|\.)\s*/gi, "");
    
    // Remove explanations about the XML
    sanitized = sanitized.replace(/I applied the provided guidelines(?:.|\n)*$/m, "");
    
    // Clean up extra whitespace
    sanitized = sanitized.replace(/\n{3,}/g, "\n\n").trim();
    
    return sanitized;
  };
  
  // Sanitize the content
  const sanitizedContent = sanitizeContent(content);
  
  return (
    <>
      {sanitizedContent}
      {hasXmlContent && (
        <div className="flex items-center justify-center my-3 bg-blue-50 p-4 rounded-lg">
          <Video className="w-8 h-8 text-blue-500 mr-3" />
          <span className="text-sm text-blue-700 font-medium">Video lesson created</span>
        </div>
      )}
    </>
  );
}

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
  })

  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Notify parent component of message changes
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages)
    }
  }, [messages, onMessagesChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isStreaming) {
      setInputValue(e.target.value)
      // Auto-resize textarea
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const message = inputValue.trim()
    
    if (message && !isStreaming) {
      setInputValue("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
      await sendMessage(message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className={cn(
        "flex-grow overflow-y-auto",
        isFullWidth ? "px-2 py-4" : "p-4"
      )}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col",
                message.type === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2 rounded-2xl overflow-auto max-h-[70vh]",
                  message.type === "user"
                    ? "bg-white border border-gray-200 rounded-br-none text-black"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <FormattedMessage content={message.content} />
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={cn(
        "bg-gray-50",
        isFullWidth ? "px-2 py-4" : "p-4"
      )}>
        <form onSubmit={handleSubmit} className={cn(
          "mx-auto",
          isFullWidth ? "max-w-3xl" : "max-w-2xl"
        )}>
          <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-3">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              className="min-h-[24px] max-h-[160px] w-full resize-none border-0 bg-transparent p-0 pl-3 focus-visible:ring-0 text-base text-black placeholder:text-gray-500 outline-none"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              size="icon"
              className={cn(
                "absolute bottom-3 right-3 h-8 w-8 rounded-full transition-all",
                inputValue.trim() ? "bg-black text-white" : "bg-gray-200 text-gray-500"
              )}
              disabled={!inputValue.trim() || isStreaming}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}