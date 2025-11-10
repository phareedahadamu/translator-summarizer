"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { checkSummarizerAvailability, summarizeText } from "../actions";
import {
  ActionFeedback,
  summaryLength,
  summaryType,
  DetectedLanguage,
} from "../constants";
import TranslationSummaryDisplay from "./TranslationSummaryDisplay";

export default function SummaryTab({
  prompt,
  detectedLanguage,
  feedback,
  setFeedback,
  inView,
  notAvailable,
  openInfoModal,
}: {
  prompt: string;
  detectedLanguage: DetectedLanguage;
  feedback: ActionFeedback[];
  setFeedback: Dispatch<SetStateAction<ActionFeedback[]>>;
  inView: boolean;
  notAvailable: boolean;
  openInfoModal: Dispatch<SetStateAction<boolean>>;
}) {
  // Summarizer ....
  const summarizeControllerRef = useRef<AbortController | null>(null);
  const [selectedSummaryLength, setSelectedSummaryLength] = useState(
    summaryLength[0] ?? "short"
  );
  const [selectedSummaryType, setSelectedSummaryType] = useState(
    summaryType[0] ?? "key-points"
  );
  const selectSummaryTypeComponent = summaryType.map((type, idx) => {
    return (
      <option key={idx} value={type} className="bg-mainBg">
        {type[0].toUpperCase() + type.slice(1)}
      </option>
    );
  });
  const selectSummaryLengthComponent = summaryLength.map((length, idx) => {
    return (
      <option key={idx} value={length} className="bg-mainBg">
        {length[0].toUpperCase() + length.slice(1)}
      </option>
    );
  });
  const [downloadingSummarizer, setDownloadingSummarizer] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  async function summarize() {
    if (summarizeControllerRef.current) {
      summarizeControllerRef.current.abort("Timeout: Try again later");
    }
    summarizeControllerRef.current = new AbortController();
    if (
      !selectedSummaryLength ||
      !prompt ||
      !selectedSummaryType ||
      !detectedLanguage.language
    )
      return;
    setSummarizing(true);
    if (self !== undefined && "Summarizer" in self) {
      const availability = await checkSummarizerAvailability(
        selectedSummaryLength,
        selectedSummaryType,
        detectedLanguage.language
      );
      if (availability === "unavailable") {
        setFeedback((prev) => [
          {
            type: "summary",
            response: "",
            length: selectedSummaryLength,
            summaryType: selectedSummaryType,
            error: `Summarizer in the selected "language-length-summary type" is currently not supported`,
          },
          ...prev,
        ]);
        setSummarizing(false);
        return;
      }
      if (availability === "downloadable" || availability === "downloading") {
        setSummarizing(false);
        setDownloadingSummarizer(true);
      }
      const timeoutId = setTimeout(() => {
        if (summarizeControllerRef.current) {
          console.warn("Aborting due to timeout");
          summarizeControllerRef.current.abort("Timeout: Try again later");
        }
      }, 600000);
      try {
        if (!summarizeControllerRef.current) {
          throw new Error("Oops! Something went wrong!");
        }
        const output = await summarizeText(
          selectedSummaryLength,
          selectedSummaryType,
          prompt,
          detectedLanguage.language,
          summarizeControllerRef.current.signal
        );
        if (output)
          setFeedback((prev) => [
            {
              type: "summary",
              response: output,
              length: selectedSummaryLength,
              summaryType: selectedSummaryType,
              error: "",
            },
            ...prev,
          ]);
      } catch (error) {
        setFeedback((prev) => [
          {
            type: "summary",
            response: "",
            length: selectedSummaryLength,
            summaryType: selectedSummaryType,
            error: `${error}.`,
          },
          ...prev,
        ]);
        console.warn(error);
      } finally {
        clearTimeout(timeoutId);
        setDownloadingSummarizer(false);
        setSummarizing(false);
        return;
      }
    } else {
      setFeedback((prev) => [
        {
          type: "summary",
          response: "",
          length: selectedSummaryLength,
          summaryType: selectedSummaryType,
          error: `Summarizer is not compatible with your device / browser`,
        },
        ...prev,
      ]);
      setDownloadingSummarizer(false);
      setSummarizing(false);
    }
  }

  useEffect(() => {
    return () => {
      if (summarizeControllerRef.current) {
        summarizeControllerRef.current.abort("Timeout: Try again later");
        console.log("⛔ Aborted summarizer on unmount");
      }
    };
  }, []);
  return (
    <div
      className={`w-full flex flex-col px-4 pb-8 pt-4 gap-[12px] rounded-[12px] border border-primary/25 bg-secondary ${
        inView ? "z-40" : "z-10 invisible"
      } absolute bottom-0 left-0 translate-y-[100%]`}
    >
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-center gap-[12px] w-full items-center">
          <select
            onChange={(e) => {
              setSelectedSummaryType(e.currentTarget.value);
            }}
            value={selectedSummaryType}
            className="max-w-[200px] w-full cursor-pointer text-[14px] disabled:cursor-not-allowed disabled:opacity-50 text-accent2"
            disabled={
              (prompt !== undefined && prompt.length < 200) ||
              summarizing ||
              downloadingSummarizer ||
              notAvailable
            }
          >
            {selectSummaryTypeComponent}
          </select>
          <select
            onChange={(e) => {
              setSelectedSummaryLength(e.currentTarget.value);
            }}
            value={selectedSummaryLength}
            className="max-w-[200px] w-full cursor-pointer text-[14px] disabled:cursor-not-allowed disabled:opacity-50 text-accent2"
            disabled={
              (prompt !== undefined && prompt.length < 200) ||
              summarizing ||
              downloadingSummarizer ||
              notAvailable
            }
          >
            {selectSummaryLengthComponent}
          </select>
          <button
            className="cursor-pointer  rounded-[6px] bg-primary px-[12px] py-[6px] text-[14px] not-disabled:hover:bg-primary/80 duration-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-secondary"
            type="button"
            onClick={() => {
              summarize();
            }}
            disabled={
              (prompt !== undefined && prompt.length < 200) ||
              summarizing ||
              !selectedSummaryLength ||
              !selectedSummaryType ||
              downloadingSummarizer ||
              notAvailable
            }
          >
            Summarize
          </button>
        </div>
        {prompt !== undefined && prompt.length < 200 && (
          <p className="text-[12px] text-red-500 w-full  text-center">
            Too short! Summarizer requires at least 200 characters
          </p>
        )}
      </div>
      {(summarizing || downloadingSummarizer) && (
        <div className="flex w-full justify-center text-[14px] text-accent2 items-center gap-[12px]">
          <Loader2 size="14" className="text-accent2 animate-spin" />
          <p className="text-[14px]">
            {summarizing
              ? "Summarizing..."
              : "Downloading summarizer models..."}
          </p>
        </div>
      )}

      {feedback.length > 0 && (
        <TranslationSummaryDisplay
          feedback={feedback}
          type={"summary"}
          openInfoModal={openInfoModal}
        />
      )}
    </div>
  );
}
