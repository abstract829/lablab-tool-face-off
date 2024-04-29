import ChatAvatar from "./chat-avatar";
import { Message } from "./chat-messages";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import useApp from "@/context/use-app";

export interface Citation {
  start: number;
  end: number;
  text: string;
  document_ids: string[];
}

export interface CohereDocument {
  id: string;
  text: string;
  start?: string;
  duration?: string;
  source: string;
  topics?: string;
}

export interface ConvertedMessage {
  type: "text" | "citation";
  content: string;
  documentIds?: string[];
  docs?: CohereDocument[];
}

export default function ChatItem(
  message: Message & {
    loading?: boolean;
  }
) {
  const { setSelectedMessage } = useApp();

  const parseMessage = (str: string) => {
    if (message.role !== "user") {
      const json = JSON.parse(message.content ?? "{}");
      return json.response;
    }
    return str;
  };
  const isFromUser = message.role === "user";

  const convertMessage = (content: string): ConvertedMessage[] => {
    let [message, strCitationsAndDocs] = content.split("[CITATIONS]");

    if (!message)
      return [
        {
          type: "text",
          content: "",
        },
      ];

    if (!strCitationsAndDocs)
      return [
        {
          type: "text",
          content: message,
        },
      ];

    const [strCitations, strDocs] = strCitationsAndDocs.split("[DOCUMENTS]");

    let citations = (JSON.parse(strCitations) ?? []) as Citation[];
    const docs = (JSON.parse(strDocs) ?? []) as CohereDocument[];

    if (
      citations.length === 0 ||
      docs.length === 0 ||
      (citations as any) === "[]" ||
      (docs as any) === "[]"
    )
      return [{ type: "text", content: message }];

    const convertedMessages: ConvertedMessage[] = [];
    let i = 0;
    let lastEnd = 0;

    citations = citations?.map((citation) => {
      const { text, document_ids } = citation;

      const findTextInMessage = (text: string) => {
        const idx = message.indexOf(text, i);
        if (idx === -1) return -1;
        return idx;
      };

      const start = findTextInMessage(text);
      const end = start + text.length;

      return {
        ...citation,
        start,
        end,
        documentIds: document_ids,
      };
    });

    while (i < message.length) {
      const citation = citations.find((citation) => citation.start === i);

      if (citation) {
        const { start, end, text, document_ids } = citation;

        convertedMessages.push({
          type: "text",
          content: message.slice(lastEnd, start),
        });

        convertedMessages.push({
          type: "citation",
          content: `${text}`,
          documentIds: document_ids,
          docs: docs.filter((doc) => document_ids.includes(doc.id)),
        });

        i = end;

        lastEnd = end;
      } else {
        if (i === message.length - 1) {
          convertedMessages.push({
            type: "text",
            content: message.slice(lastEnd, i + 1),
          });
        }

        i++;
      }
    }

    return convertedMessages;
  };

  return (
    <div className="pr-2">
      {isFromUser ? (
        <div className="flex flex-col items-end justify-end gap-2 pt-4">
          <div className="flex items-center gap-2">
            <div className="text-default-600 text-xs">User</div>
            <div className="w-[35px]">
              <ChatAvatar {...message} />
            </div>
          </div>
          <div className="ml-8 mr-[40px] break-words rounded-xl rounded-tr-none border bg-white px-4 py-2 text-left text-sm text-black shadow">
            {message.content}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-end gap-2 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-[35px]">
              <ChatAvatar {...message} />
            </div>
            <div className="text-default-600 text-xs">Chatbot</div>
          </div>
          <div className=" ml-[40px] mr-8 break-words  rounded-xl  rounded-tl-none border  bg-white px-4 py-2   text-left text-sm text-black shadow">
            {convertMessage(message.content)?.map((message, idx) => (
              <HoverCard key={idx}>
                <HoverCardTrigger
                  className={cn(
                    message.type === "citation"
                      ? "cursor-pointer text-gray-600 underline"
                      : ""
                  )}
                  onClick={
                    message.type === "citation"
                      ? () => setSelectedMessage?.(message)
                      : undefined
                  }
                >
                  {message.content}
                </HoverCardTrigger>
                {message.type === "citation" && (
                  <HoverCardContent>
                    {message.docs?.map((doc) => (
                      <div key={doc.id} className="mb-2">
                        <p
                          className="text-xs"
                          dangerouslySetInnerHTML={{ __html: `"${doc.text}"` }}
                        ></p>
                      </div>
                    ))}
                  </HoverCardContent>
                )}
              </HoverCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
