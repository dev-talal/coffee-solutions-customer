"use client";

import React, { createContext, useContext, useState } from "react";
import { ChatMessage, ChatMessagePayload } from "@/types/chat";
import apiService from "@/lib/axios";

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handleSend: (message: ChatMessagePayload) => void;
  isSending: boolean;
  fetchMessages: (
    page?: number,
    append?: boolean,
    count?: number
  ) => Promise<{
    hasMore: boolean;
    currentPage: number;
    unread_count: number;
  }>;

  uploadFile: (
    uploadFile: File,
    onProgress?: (progress: number) => void
  ) => Promise<string>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  setMessages: () => {},
  handleSend: () => {},
  isSending: false,
  fetchMessages: async () =>
    Promise.resolve({ hasMore: false, currentPage: 1, unread_count: 0 }),
  uploadFile: async () => Promise.resolve(""),
  unreadCount: 0,
  setUnreadCount: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const handleSend = async (message: ChatMessagePayload) => {
    setIsSending(true);
    try {
      const res = await apiService.post(`chat`, message);
      setMessages((prev) => [...prev, res.data.data]);
    } catch (error) {
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const fetchMessages = async (page = 1, append = false, count = 0) => {
    try {
      const res = await apiService.get(
        `chat/customer/messages?page=${page}&count=${count}`
      );
      const data = res.data.data.reverse();
      setMessages((prev) => (append ? [...data, ...prev] : data));
      setUnreadCount(res.data.unread_count);
      return {
        hasMore: res.data.has_more,
        currentPage: res.data.current_page,
        unread_count: res.data.unread_count,
      };
    } catch (error) {
      return { hasMore: false, currentPage: page, unread_count: 0 };
    }
  };

  const uploadFile = async (
    uploadFile: File,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("media", uploadFile);
    formData.append("type", uploadFile.type);

    try {
      const res = await apiService.post(`/chat/media/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.(percent);
          }
        },
      });

      return res.data.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        handleSend,
        isSending,
        fetchMessages,
        uploadFile,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
