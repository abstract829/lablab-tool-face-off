import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutationLoadVideo } from "@/hooks/chat";
import getVideoId from "get-video-id";
import { toast } from "react-toastify";
import useApp from "@/context/use-app";

export function VideoInserter() {
  const [inputValue, setInputValue] = React.useState(
    "https://www.youtube.com/watch?v=75Hv0RUFIrQ"
  );

  const load = useMutationLoadVideo();

  const { setCurrentVideoUrl, setStart, setSelectedMessage } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStart = async () => {
    const { id, service } = getVideoId(inputValue);

    if (service !== "youtube" || !id) {
      alert("Url do not match youtube video format");
      return;
    }

    load.mutate(inputValue, {
      onSuccess: () => {
        toast.success("Video loaded successfully");
        setCurrentVideoUrl(inputValue);
        setStart(0);
        setSelectedMessage(null);
      },
      onError: () => {
        toast.error("Error loading video, make sure your video have subtitles");
      },
    });
  };

  return (
    <>
      {load.isPending && (
        <div className="backdrop">
          <div className="flex flex-col items-center text-white">
            <div className="loader" />
            Processing video...
          </div>
        </div>
      )}
      <div className="flex w-full max-w-xl flex-wrap gap-2 lg:flex-nowrap">
        <Input value={inputValue} onChange={handleInputChange} />
        <Button onClick={handleStart} className="w-full px-4 lg:w-auto">
          Load
        </Button>
      </div>
    </>
  );
}
