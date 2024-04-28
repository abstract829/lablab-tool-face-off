import { IoMdSend } from "react-icons/io";
import { Input } from "../ui/input";

export interface ChatInputProps {
  /** The current value of the input */
  input?: string;
  /** An input/textarea-ready onChange handler to control the value of the input */
  handleInputChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  /** Form submission handler to automatically reset input and append a user message  */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  multiModal?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
  return (
    <>
      <form
        onSubmit={props.handleSubmit}
        className="flex w-full items-center justify-between gap-4 "
      >
        <Input
          autoFocus
          name="message"
          placeholder="Type a question..."
          value={props.input}
          onChange={props.handleInputChange}
          onKeyDown={(e: any) => {
            if (e.key === "Enter" && !props.multiModal) {
              props.handleSubmit({ preventDefault: () => {} } as any);
            }
          }}
        />
        <IoMdSend
          onClick={() =>
            props.handleSubmit({ preventDefault: () => {} } as any)
          }
          className="text-default-500 h-6 w-6 cursor-pointer transition-all hover:scale-105"
        />
      </form>
    </>
  );
}
