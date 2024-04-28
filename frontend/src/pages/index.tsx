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
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const { currentVideoUrl, start } = useApp();

  const { id, service } = getVideoId(currentVideoUrl);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {}}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={false}
          minSize={15}
          maxSize={20}
        >
          <div className={cn("flex h-[56px] items-center justify-center px-2")}>
            <VideoInserter />
          </div>
          <Separator />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="video">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">{currentVideoUrl}</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="video"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Video
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="pt-4">
              <TabsContent value="video" className="m-0">
                <div className="px-4">
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
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={40}>
          <ChatDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
