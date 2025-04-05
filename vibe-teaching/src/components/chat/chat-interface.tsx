"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useChat, type Message } from "@/hooks/use-chat"

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void
  onReceiveMessage?: (message: string) => void
  initialMessages?: Message[]
}

export default function ChatInterface({
  onSendMessage,
  onReceiveMessage,
  initialMessages = [],
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
      <div className="flex-grow overflow-y-auto p-4">
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
                  "max-w-[80%] px-4 py-2 rounded-2xl",
                  message.type === "user"
                    ? "bg-white border border-gray-200 rounded-br-none text-black"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-3">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? "Waiting for response..." : "Type a message"}
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