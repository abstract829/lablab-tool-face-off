import { useEffect, useRef, useState } from "react";
import ChatItem from "./chat-item";
import useApp from "@/context/use-app";

const suggestedQuestions = ["Talk me about the video"];

export interface Message {
  id: string;
  content: string;
  role: string;
}

export default function ChatMessages({
  messages,
  isLoading,
  reload,
  stop,
  handleInputChange,
  handleSubmit,
}: {
  messages: Message[];
  isLoading?: boolean;
  stop?: () => void;
  reload?: () => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  /** Form submission handler to automatically reset input and append a user message  */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);

  const [questionClicked, setQuestionClicked] = useState(false);

  const { currentVideoUrl } = useApp();

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    if (questionClicked) {
      handleSubmit({ preventDefault: () => {} } as any);
      setQuestionClicked(false);
    }
  }, [questionClicked, handleSubmit]);

  return (
    <div
      className="h-[calc(100vh-220px)] overflow-auto  whitespace-pre-wrap text-sm"
      ref={scrollableChatContainerRef}
    >
      <div className="h-[calc(100vh-220px)] p-4">
        {messages.length === 0 && currentVideoUrl && (
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col items-center justify-center pt-8">
              <p className="mt-12 max-w-xs text-center text-gray-300">
                Ask something to get started
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {suggestedQuestions?.map((question: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleInputChange({ target: { value: question } } as any);
                    setQuestionClicked(true);
                  }}
                >
                  <div className="mx-2  cursor-pointer rounded-md border px-2 py-1">
                    {question}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((m: Message) => (
          <ChatItem key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
}
