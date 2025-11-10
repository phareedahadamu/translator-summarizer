"use client";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
export default function Info({
  openInfoModal,
}: {
  openInfoModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="fixed left-0 h-screen w-screen bg-black/15 backdrop-blur-md flex items-center justify-center z-[300]">
      <div className="flex flex-col gap-[6px] relative bg-secondary rounded-[8px] max-w-[450px] w-[98%] px-[24px] py-[40px] text-accent2 **:[strong]:font-medium **:[strong]:text-primary">
        <button
          className="absolute top-[16px] right-[16px] cursor-pointer"
          onClick={() => {
            openInfoModal(false);
          }}
        >
          <X size="16" className="text-accent2 hover:text-accent2/70" />
        </button>
        <h1 className="text-center font-medium text-[21px]">About this app</h1>
        <p className="text-justify">
          This app is powered by Chrome&apos;s built-in AI features — the{" "}
          <strong>Language Detector</strong>, <strong>Translator</strong>, and{" "}
          <strong>Summarizer</strong> — to help you understand, translate, and
          simplify text right in your browser. Everything runs locally on your
          device, so it&apos;s fast and private — no data leaves your browser.
        </p>
        <p className="text-justify">
          These tools currently work best in{" "}
          <strong>Google Chrome Canary</strong>. If you&apos;re using other
          browsers, or if your browser is out of date, some features might not
          be available just yet.
        </p>
        <p className="text-justify">
          If something doesn&apos;t seem to work, try updating your browser or
          switching to Chrome for the full experience 🚀
        </p>
      </div>
    </div>
  );
}
