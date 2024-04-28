import React, { createContext } from "react";

type AppContextType = {
  currentVideoUrl: string;
  setCurrentVideoUrl: (url: string) => void;
  start: number;
  setStart: (start: number) => void;
  selectedMessage: any;
  setSelectedMessage: (message: any) => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState(
    "https://youtu.be/bZQun8Y4L2A"
  );
  const [start, setStart] = React.useState(0);

  const [selectedMessage, setSelectedMessage] = React.useState();

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
