"use client";

import { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DynamicIcon } from "lucide-react/dynamic";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Trash2Icon, XCircle } from "lucide-react";
import { useAuthCheck } from "@/hooks/auth-check";
import { useChat } from "@/providers/ChatProvider";
import { ChatMessage } from "@/types/chat";
import { connectReverb } from "@/lib/socket";
import ChatBody from "./ChatBody";
import { Badge } from "@/components/ui/badge";
import { useNotificationSound } from "@/hooks/useMessageSound";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type UploadFile = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
};

export default function ChatButton() {
  const { isAuthenticated } = useAuthCheck();
  const {
    handleSend: submitMessage,
    uploadFile,
    setMessages,
    fetchMessages,
    unreadCount,
    setUnreadCount,
    isSending,
  } = useChat();
  const { user } = useAuthCheck();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [message, setMessage] = useState<string>("");

  const chatContainer = useRef<HTMLDivElement>(null);

  const { audioRef, playSound } = useNotificationSound();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const randomId = Math.random().toString(36).substring(2, 15);
    const newFile = {
      id: randomId,
      file: selected,
      progress: 0,
      status: "pending" as const,
    };

    setFiles((prev) => [...prev, newFile]);

    try {
      const url = await uploadFile(selected, (progress) => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === randomId ? { ...f, progress, status: "uploading" } : f
          )
        );
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === randomId ? { ...f, url, progress: 100, status: "done" } : f
        )
      );
    } catch (error) {
      console.error(error);
      setFiles((prev) =>
        prev.map((f) => (f.id === randomId ? { ...f, status: "error" } : f))
      );
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && !files.length) || !user) return;
    try {
      await submitMessage({
        message: message.trim(),
        sender_id: user?.id,
        media: files.map((m) => ({
          url: m.url || "",
          type: m.file.type,
          name: m.file.name,
        })),
      });
      setMessage("");
      setFiles([]);
      setTimeout(() => {
        const container = chatContainer.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages(1, false, 1);
  }, []);

  useEffect(() => {
    if (user) {
      const socket = connectReverb({
        userId: user.id,
        onMessage: (msg) => {
          if (msg.event === "message.sent") {
            try {
              const parsedData =
                typeof msg.data === "string" ? JSON.parse(msg.data) : msg.data;
              const parsed = parsedData.message as ChatMessage;
              setUnreadCount((prev) => prev + 1);
              setMessages((prev) => [...prev, parsed]);
              playSound();
            } catch (error) {
              console.error("Error parsing incoming message:", error, msg.data);
            }
          }
        },
      });
      return () => socket.close();
    }
  }, [user, playSound]);

  if (!isAuthenticated) return <></>;

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex justify-center relative items-center rounded-full p-3 shadow-lg hover:bg-coffee-brown hover:border-amber-100 hover:border bg-amber-400 text-white hover:text-white">
            <DynamicIcon name="message-circle" height={28} width={28} />
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-sm rounded-full absolute top-[-7px] right-0">
                {unreadCount}
              </Badge>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 shadow-xl p-0 mr-4 mb-1 rounded-md">
          <div className="bg-amber-400 dark:bg-card rounded-t-[7px] h-14 flex flex-row items-center px-4 gap-2">
            <DynamicIcon name="headset" className="h-6 w-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Chat Support</h2>
          </div>
          <Separator />
          <div
            className="p-3 h-80 space-y-4 overflow-y-auto"
            ref={chatContainer}
          >
            <ChatBody chatContainer={chatContainer} />
          </div>
          {files.length > 0 && (
            <div className="px-4 py-2">
              <div className="space-y-3">
                {files.map((f, idx) => (
                  <div
                    key={idx}
                    className="bg-muted p-2 rounded-md text-sm border space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{f.file.name}</span>
                      {f.status === "done" && (
                        <Trash2Icon
                          className="text-red-500  w-4 h-4"
                          onClick={() =>
                            setFiles(files.filter((f) => f.id !== f.id))
                          }
                        />
                      )}
                      {f.status === "error" && (
                        <XCircle className="text-red-500 w-4 h-4" />
                      )}
                    </div>
                    <Progress value={f.progress} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />
          <div className="flex flex-row p-4 items-center space-x-2">
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="chat-attachment" className="cursor-pointer">
                    <DynamicIcon name="paperclip" className="h-5 w-5" />
                  </label>
                </TooltipTrigger>
                <TooltipContent>Attach</TooltipContent>
              </Tooltip>

              <input
                type="file"
                id="chat-attachment"
                className="hidden"
                accept="image/*,video/*,.zip,.rar,.7z,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>

            <Input
              name="chat"
              placeholder="Type here to chat..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend();
                }
              }}
              className="rounded-full w-58"
            />

            <Tooltip>
              <TooltipTrigger asChild disabled={isSending}>
                <DynamicIcon
                  name={isSending ? "loader" : "send-horizontal"}
                  className={cn(
                    "h-5 w-5 cursor-pointer",
                    isSending ? "animate-spin" : ""
                  )}
                  onClick={handleSend}
                />
              </TooltipTrigger>
              <TooltipContent>Send</TooltipContent>
            </Tooltip>
          </div>
        </PopoverContent>
      </Popover>
      <audio ref={audioRef} src="/message-pop-alert.mp3" preload="auto" />
    </div>
  );
}
