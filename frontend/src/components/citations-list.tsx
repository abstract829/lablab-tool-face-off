import { cn } from "@/lib/utils";
import { formatDuration, intervalToDuration } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import useApp from "@/context/use-app";

function formatSeconds(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return formatDuration(duration);
}

export function CitationsList() {
  const { selectedMessage, setStart } = useApp();

  if (!selectedMessage) return null;

  return (
    <ScrollArea className="h-screen">
      <h3 className="mb-2 px-4 text-xl font-bold">
        Citations for:{" "}
        <span className="text-base font-normal">
          "{selectedMessage.content}"
        </span>
      </h3>

      <div className="flex flex-col gap-2 p-4 pt-0">
        {selectedMessage.docs?.map((item: any) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
            )}
            onClick={() => setStart(parseInt(item.start || "0"))}
          >
            <div>
              From {formatSeconds(Number(item.start))} to{" "}
              {formatSeconds(Number(item.start) + Number(item.duration))}
            </div>
            <div
              className="line-clamp-2 text-xs text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: `"${item.text}"` }}
            ></div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
