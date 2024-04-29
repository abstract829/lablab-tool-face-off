import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInput, ChatMessages, Message } from "./chatbot";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutationChat } from "@/hooks/chat";

export function ChatDisplay() {
  const chat = useMutationChat();

  const [messages, setMessages] = useState<Message[]>([]);
  const [lastInput, setLastInput] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!input || input.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), content: input, role: "user" },
    ]);

    setLastInput(input);

    setInput("");
  };

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const [input, setInput] = useState("");

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage?.role === "user") {
        chat.mutate(lastInput, {
          onSuccess: (data) => {
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                content: `${data.text}[CITATIONS]${JSON.stringify(
                  data.citations || "[]"
                )}[DOCUMENTS]${JSON.stringify(data.documents || "[]")}`,
                role: "ai",
              },
            ]);

            setLastInput("");
          },
        });
      }
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col">
        <div className="flex h-[56px] items-start p-2">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt="chatbot-name" src="/fai.png" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <Link
                href="#"
                target="_blank"
                className="font-semibold hover:underline"
              >
                Chatbot
              </Link>
              <div className="line-clamp-1 text-xs">Youtube Chatbot</div>
            </div>
          </div>
        </div>
        <Separator />
        <ChatMessages
          messages={messages}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isLoading={chat.isPending}
        />
        <Separator className="mt-4" />
        <div className="p-4">
          <ChatInput
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            multiModal={false}
          />
        </div>
      </div>
    </div>
  );
}
