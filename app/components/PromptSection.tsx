"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Forward } from "lucide-react";

export default function PromptSection({
  prompt,
  setPrompt,
  setPromptReceived,
}: {
  prompt: string | undefined;
  setPrompt: Dispatch<SetStateAction<string | undefined>>;
  setPromptReceived: Dispatch<SetStateAction<boolean>>;
}) {
  const isValid = prompt && prompt.trim().length >= 5;
  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.currentTarget.value;
    setPrompt(value);
  }
  function sendPrompt() {
    setPromptReceived(true);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendPrompt();
    }
  }
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-[24px]">
      <div className="flex flex-col items-center">
        <h1 className="text-[32px] text-accent2 font-semibold">Welcome</h1>
      </div>
      <div className="w-full relative flex">
        <textarea
          className="w-full rounded-[6px] outline-[2px] outline-primary/15 backdrop-blur-[10px] bg-secondary/30 resize-none field-sizing-content max-h-[14em]  p-4 pr-[53px] overflow-y-auto min-h-[8em] focus:shadow-[2px_2px_8px,-2px_-2px_8px] shadow-primary/15 transition-colors duration-1000 placeholder:text-accent2/25 text-accent2 leading-[1.5em]"
          placeholder="Enter text to translate or summarize"
          value={prompt}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button
          disabled={!isValid}
          className="absolute right-[8px] top-[50%] -translate-y-[50%] p-2  rounded-full bg-primary hover:bg-primary/80 transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 "
          aria-label="Submit text"
          role="button"
          type="submit"
          onClick={sendPrompt}
        >
          <Forward
            className="text-secondary rotate-180 -scale-x-[1]"
            size="21"
          />
        </button>
        {prompt && (
          <p className="text-[12px] text-accent2/50 absolute bottom-0 left-[8px]">
            {prompt.trim().length + " characters"}
          </p>
        )}
      </div>
      {prompt && prompt.length > 0 && !isValid && (
        <p className="text-red-500 text-[12px] flex w-full justify-end">
          Must be at least 5 characters
        </p>
      )}
    </section>
  );
}
