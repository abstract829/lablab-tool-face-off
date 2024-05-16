import { ConvertedMessage } from "@/components/chatbot/chat-item";
import React, { createContext } from "react";

type AppContextType = {
  currentVideoUrl: string;
  setCurrentVideoUrl: (url: string) => void;
  start: number;
  setStart: (start: number) => void;
  selectedMessage: ConvertedMessage | null;
  setSelectedMessage: (message: ConvertedMessage | null) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState(
    "https://www.youtube.com/watch?v=75Hv0RUFIrQ"
  );
  const [start, setStart] = React.useState(0);

  const [selectedMessage, setSelectedMessage] =
    React.useState<ConvertedMessage | null>(null);

  return (
    <AppContext.Provider
      value={{
        currentVideoUrl,
        setCurrentVideoUrl,
        start,
        setStart,
        selectedMessage,
        setSelectedMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
