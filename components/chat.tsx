"use client";

import { TPost, TReaction } from "@/global/types";
import { useSocket } from "@/hooks/useSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import Post from "./post";
import { ArrowDown, ArrowRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";

export default function ChatPage() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<TPost[]>([]);

  const handleReaction = useCallback(
    ({
      postId,
      name,
      userId,
    }: {
      postId: string;
      name: string;
      userId: string;
    }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id !== postId) return msg;

          const updatedReactions = msg.reactions.map((reaction) => {
            if (reaction.name === name) {
              const updatedAddedBy = reaction.addedBy.includes(userId)
                ? reaction.addedBy.filter((user) => user !== userId)
                : [...reaction.addedBy, userId];

              return {
                ...reaction,
                count: updatedAddedBy.length,
                addedBy: updatedAddedBy,
              };
            }
            return reaction;
          });

          return { ...msg, reactions: updatedReactions };
        })
      );
    },
    []
  );

  const addNewReaction = useCallback(
    ({
      postId,
      emoji,
      userId,
    }: {
      postId: string;
      emoji: any;
      userId: string;
    }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id !== postId) return msg;

          const existingReaction = msg.reactions.find(
            (reaction) => reaction.name === emoji.emoji
          );

          let updatedReactions;
          if (!existingReaction) {
            updatedReactions = [
              ...msg.reactions,
              {
                id: uuidv4(),
                name: emoji.emoji,
                count: 1,
                addedBy: [userId],
              },
            ];
          } else if (!existingReaction.addedBy.includes(userId)) {
            updatedReactions = msg.reactions.map((reaction) =>
              reaction.name === emoji.emoji
                ? {
                    ...reaction,
                    count: reaction.count + 1,
                    addedBy: [...reaction.addedBy, userId],
                  }
                : reaction
            );
          } else {
            updatedReactions = msg.reactions;
          }

          return { ...msg, reactions: updatedReactions };
        })
      );
    },
    []
  );

  const sendMessage = () => {
    if (socket && message && socket.id) {
      const messageId = uuidv4(); // Generate ID on client side
      socket.emit("message", {
        id: messageId,
        text: message,
        sender: socket.id,
      });

      setMessage("");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: {
      id: string;
      text: string;
      sender: string;
    }) => {
      // Only add the message if it doesn't already exist
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [
          ...prev,
          {
            id: data.id,
            author: data.sender,
            content: data.text,
            reactions: [],
          },
        ];
      });
    };

    socket.on("message", handleMessage);
    socket.on("handle_reaction", handleReaction);
    socket.on("add_reaction", addNewReaction);

    return () => {
      socket.off("message", handleMessage);
      socket.off("handle_reaction", handleReaction);
      socket.off("add_reaction", addNewReaction);
    };
  }, [socket, handleReaction, addNewReaction]);

  useEffect(() => {
    if (
      socket &&
      messages.length > 0 &&
      messages[messages.length - 1].author === socket.id
    ) {
      scrollToBottom();
    }
  }, [messages, socket]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      const isBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setIsAtBottom(isBottom);
    }
  };

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="px-5 w-full lg:w-1/2 mx-auto overflow-y-auto overflow-x-hidden h-screen p-5">
      <AnimatePresence>
        {socket &&
          messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Post
                key={msg.id}
                postId={msg.id}
                socket={socket}
                author={msg.author}
                content={msg.content}
                reactions={msg.reactions}
                isLast={index === messages.length - 1}
              />
            </motion.div>
          ))}
        <div ref={messagesEndRef} />
      </AnimatePresence>
      <AnimatePresence>
        {!isAtBottom && (
          <motion.div
            key="scroll-to-bottom-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-5 right-5"
          >
            <button
              className="bg-white  p-2 rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <ArrowDown size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-5 mt-4 w-full lg:w-1/2 mx-auto flex items-center px-4">
        <input
          placeholder="Type something..."
          className="border border-gray-200 rounded-lg p-2 w-full shadow-md"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button className="text-black px-2 py-2" onClick={sendMessage}>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
