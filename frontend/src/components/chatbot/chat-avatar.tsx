"use client";

import { type Message } from "./chat-messages";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function ChatAvatar(message: Message) {
  if (message.role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="black"
          className="h-5 w-5"
        >
          <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z"></path>
        </svg>
      </div>
    );
  }

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage alt="chatbot-name" src="/fai.png" />
      <AvatarFallback>AI</AvatarFallback>
    </Avatar>
  );
}
