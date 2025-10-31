import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthCheck } from "@/hooks/auth-check";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { DynamicIcon } from "lucide-react/dynamic";
import Image from "next/image";

const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const { user } = useAuthCheck();
  const isUser = user && user.id == msg.sender_id;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <Avatar>
          <AvatarImage />
          <AvatarFallback className="text-[8px]">CS</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1 text-sm max-w-[225px]">
        {msg.media &&
          msg.media.length > 0 &&
          msg.media.map((m) => (
            <div
              className={cn("p-2 rounded-md", {
                "bg-accent/90": !isUser,
                "bg-amber-400/50": isUser,
              })}
              key={m.file_name}
            >
              {m.type.startsWith("image/") ? (
                <Image
                  src={m.file}
                  alt={m.file_name}
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
              ) : m.type.startsWith("video/") ? (
                <video src={m.file} controls className="w-full rounded-md" />
              ) : (
                <div className="flex items-center gap-1">
                  <DynamicIcon name="file" className="w-5 h-5" />
                  <span className="text-sm truncate">{m.file_name}</span>
                </div>
              )}
            </div>
          ))}
        {msg.message && (
          <div
            className={cn("p-2 rounded-md whitespace-pre-wrap", {
              "bg-accent/90": !isUser,
              "bg-amber-400/50": isUser,
            })}
          >
            {msg.message}
          </div>
        )}
      </div>
      {isUser && (
        <Avatar>
          <AvatarImage />
          <AvatarFallback className="text-[8px]">ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
