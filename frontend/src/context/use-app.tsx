import { useContext } from "react";
import { AppContext } from "./app-context";

const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};

export default useApp;
