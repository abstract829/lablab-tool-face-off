import { AppProvider } from "@/context/app-context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ToastContainer />

        <Component {...pageProps} />
      </AppProvider>
    </QueryClientProvider>
  );
}
