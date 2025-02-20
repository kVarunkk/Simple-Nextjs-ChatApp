"use client";

import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Socket } from "socket.io-client";
import { TReaction } from "@/global/types";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

export default function Reaction({
  postId,
  socket,
  reactions,
}: {
  postId: string;
  socket: Socket;
  reactions: TReaction[];
}) {
  return (
    <div className="flex flex-wrap gap-2 text-sm items-center pl-0 p-2">
      {socket &&
        reactions &&
        reactions.length > 0 &&
        reactions
          .filter((each) => each.count > 0)
          .map(({ name, count, addedBy }) => (
            <button
              onClick={() => {
                socket?.emit("handle_reaction", {
                  postId,
                  name,
                  userId: socket.id,
                });
              }}
              key={name}
              className={`group border border-gray-200 flex p-1 rounded-full items-center gap-1 ${
                socket && socket.id && addedBy.includes(socket.id)
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <div className="group-hover:-translate-y-[2px] transition">
                {name}
              </div>
              <motion.div
                key={count}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {count}
              </motion.div>
            </button>
          ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-[5px] rounded-full border border-gray-200 text-gray-600">
            <Plus size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <EmojiPicker
            onEmojiClick={(emoji) => {
              socket?.emit("add_reaction", {
                postId,
                emoji,
                userId: socket.id,
              });
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
