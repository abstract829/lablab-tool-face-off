"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VideoInserter } from "@/components/video-inserter";
import * as React from "react";
import getVideoId from "get-video-id";
import YouTube from "react-youtube";
import useApp from "@/context/use-app";
import { ChatDisplay } from "@/components/chat-display";
import { CitationsList } from "@/components/citations-list";

interface Props {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function HomePage({
  defaultLayout = [440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const { currentVideoUrl, start } = useApp();

  const { id, service } = getVideoId(currentVideoUrl);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-6 border-r">
          <Tabs defaultValue="video">
            <div className="flex items-center justify-between px-4 py-2">
              <VideoInserter />
            </div>
            <Separator />
            <div className="pt-4">
              <TabsContent value="video" className="m-0">
                <div className="px-4">
                  <h1 className="text-xl font-bold mb-4">{currentVideoUrl}</h1>

                  {id && (
                    <YouTube
                      videoId={id}
                      iframeClassName="rounded"
                      opts={{
                        height: "450",
                        width: "100%",
                        playerVars: {
                          autoplay: start > 0 ? 1 : 0,
                          start,
                        },
                      }}
                      className="pb-4"
                    />
                  )}
                </div>
                <CitationsList />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="col-span-6">
          <ChatDisplay />
        </div>
      </div>
    </TooltipProvider>
  );
}
