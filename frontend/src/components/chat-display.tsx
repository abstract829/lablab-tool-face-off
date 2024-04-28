import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInput, ChatMessages } from "./chatbot";
import { insertDataIntoMessages } from "./chatbot/transform";
import { Separator } from "@/components/ui/separator";
import { useChat } from "ai/react";
import { useMemo } from "react";
import Link from "next/link";

export function ChatDisplay() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    data,
    setMessages,
  } = useChat({
    api: `/api/chat`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const transformedMessages = useMemo(() => {
    return insertDataIntoMessages(messages, data);
  }, [messages, data]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col">
        <div className="flex h-[56px] items-start p-2">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt="mail-name" src="/fai.png" />
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
          messages={transformedMessages}
          isLoading={isLoading}
          reload={reload}
          stop={stop}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
        <Separator className="mt-4" />
        <div className="p-4">
          <ChatInput
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            multiModal={false}
          />
        </div>
      </div>
    </div>
  );
}
