import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Message, MessageType } from "@/hooks/use-chat";

interface MessageState {
  messages: Message[];
  isStreaming: boolean;
  
  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (content: string, type: MessageType) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setIsStreaming: (streaming: boolean) => void;
}

export const useMessageStore = create<MessageState>()((set, get) => ({
  messages: [],
  isStreaming: false,
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (content, type) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      type,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    return newMessage;
  },
  
  updateLastMessage: (content) => set((state) => {
    if (state.messages.length === 0) return state;
    
    const updatedMessages = [...state.messages];
    updatedMessages[updatedMessages.length - 1] = {
      ...updatedMessages[updatedMessages.length - 1],
      content,
    };
    
    return { messages: updatedMessages };
  }),
  
  clearMessages: () => set({ messages: [] }),
  
  setIsStreaming: (isStreaming) => set({ isStreaming }),
}));
