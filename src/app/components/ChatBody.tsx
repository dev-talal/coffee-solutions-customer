"use client";

import React, { useEffect, useState } from "react";
import { useChat } from "@/providers/ChatProvider";
import MessageBubble from "./MessageBubble";
import { DynamicIcon } from "lucide-react/dynamic";

const ChatBody = ({
  chatContainer,
}: {
  chatContainer: React.RefObject<HTMLDivElement | null>;
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { fetchMessages, messages } = useChat();

  const scrollDown = () => {
    setTimeout(() => {
      const container = chatContainer.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  useEffect(() => {
    (async () => {
      const res = await fetchMessages(1);
      setHasMore(res.hasMore);
      scrollDown();
    })();
  }, []);

  useEffect(() => {
    if (!chatContainer.current) return;

    const container = chatContainer.current;

    const handleScroll = async () => {
      if (container.scrollTop <= 0 && hasMore && !loading) {
        setLoading(true);
        const oldHeight = container.scrollHeight;

        const nextPage = page + 1;
        const res = await fetchMessages(nextPage, true);

        setPage(nextPage);
        setHasMore(res.hasMore);
        setLoading(false);

        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - oldHeight;
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [chatContainer.current, hasMore, loading, page]);
  return (
    <>
      {loading && (
        <DynamicIcon name="loader" className="animate-spin w-6 h-6 mx-auto" />
      )}
      {messages.map((msg) => (
        <div key={"message" + msg.id}>
          <MessageBubble msg={msg} />
        </div>
      ))}
    </>
  );
};

export default ChatBody;
