import { User } from "lucide-react";
import { cn } from "../../lib/utils";
import Logo from "../ui/Logo";

interface MessageProps {
  content: string
  isUserMessage: boolean
}

export const Message = ({ content, isUserMessage }: MessageProps) => {
  return (
    <div
      className={cn({
        "bg-secondary": isUserMessage,
        "bg-background": !isUserMessage,
      })}
    >
      <div className="p-6">
        <div className="mx-auto flex items-start gap-2.5">
          <div className={cn(
              "size-10 shrink-0 aspect-square rounded-full border border-zinc-700 flex justify-center items-center",
              {
                "bg-blue-950 border-blue-700 text-zinc-200": isUserMessage,
              }
            )}
          >
            {isUserMessage ? <User className="size-5" /> : <Logo isClickable={false} size="ls"/>/*<Bot className="size-5 text-white" />*/}
          </div>

          <div className="flex flex-col ml-6 w-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-foreground dark:text-white">
                {isUserMessage ? "Moi" : "SafeTrain AI"}
              </span>
            </div>

            <p className="font-normal py-2.5 text-foreground dark:text-white">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};