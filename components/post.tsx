"use client";

import { Socket } from "socket.io-client";
import { TReaction } from "@/global/types";
import Reaction from "./reaction";

export default function Post({
  postId,
  socket,
  author,
  content,
  reactions,
  isLast,
}: {
  postId: string;
  socket: Socket;
  author: string;
  content: string;
  reactions: TReaction[];
  isLast: boolean;
}) {
  return (
    <div
      className={`flex gap-2 w-fit ${
        author === socket.id ? "mr-0 ml-auto" : "ml-0"
      } ${isLast ? "mb-10" : "m-2"}`}
    >
      <div className="flex flex-col w-[300px]">
        <div className="break-words relative rounded-lg border border-gray-200 bg-white text-black p-4">
          {content}
        </div>
        <Reaction postId={postId} reactions={reactions || []} socket={socket} />
      </div>
    </div>
  );
}
