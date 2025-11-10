"use client";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { checkLanguageDetectorAvailability, detectLanguage } from "../actions";
import ISO6391 from "iso-639-1";
import { ActionFeedback, DetectedLanguage } from "../constants";
import TranslationTab from "./TranslationTab";
import SummaryTab from "./SummaryTab";

export default function ActionSection({
  prompt,
  setPrompt,
  setPromptReceived,
  openInfoModal,
}: {
  prompt: string | undefined;
  setPrompt: Dispatch<SetStateAction<string | undefined>>;
  setPromptReceived: Dispatch<SetStateAction<boolean>>;
  openInfoModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [feedback, setFeedback] = useState<ActionFeedback[]>([]);
  const [tab, setTab] = useState("translation");
  const tabs = ["translation", "summary"];
  const [error, setError] = useState("");
  const tabComponents = tabs.map((item) => (
    <motion.button
      key={item}
      onClick={() => {
        setTab(item);
      }}
      initial={false}
      className={`${
        item === tab
          ? "bg-secondary font-medium"
          : "bg-transparent font-regular"
      } cursor-pointer  p-[6px] text-accent2 relative rounded-t-[6px] h-[30px] flex items-center leading-[20px] text-[14px]`}
    >
      <span
        className={`rounded-[6px] px-[8px] ${
          item === tab ? "" : "hover:bg-secondary"
        }`}
      >
        {item[0].toUpperCase() + item.slice(1)}
      </span>
      {item === tab && (
        <motion.div
          className="border border-b-[2px] border-primary/25 top-0 bottom-[-1px] left-0 right-0 absolute rounded-t-[6px] border-b-secondary z-50"
          layoutId="tab"
        />
      )}
    </motion.button>
  ));
  const [viewingFullPrompt, setViewingFullPrompt] = useState(false);
  const displayedPrompt =
    prompt && !viewingFullPrompt ? prompt.slice(0, 187) : prompt;

  function backToPrompt() {
    setPrompt(undefined);
    setPromptReceived(false);
  }

  // Detector...
  const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage>({
    language: "",
    languageFull: "",
    confidence: "",
  });
  const detectControllerRef = useRef<AbortController | null>(null);
  const [downloadingLanguageModel, setDownloadingLaguageModel] =
    useState(false);

  const [detectingLanguage, setDetectingLanguage] = useState(false);

  // UseEffects...
  useEffect(() => {
    if (detectControllerRef.current) {
      detectControllerRef.current.abort("Timeout: Try again later");
    }
    detectControllerRef.current = new AbortController();

    async function check() {
      if (!prompt) return;
      setDetectingLanguage(true);
      const availability = await checkLanguageDetectorAvailability();
      if (availability === "unavailable") {
        setError(
          "Language Detector API is not compatible with your device / browser"
        );
        setDetectingLanguage(false);
        return;
      }
      if (availability === "downloadable" || availability === "downloading") {
        setDetectingLanguage(false);
        setDownloadingLaguageModel(true);
      }
      const timeoutId = setTimeout(() => {
        if (detectControllerRef.current) {
          console.warn("Aborting due to timeout");
          detectControllerRef.current.abort("Timeout: Try again later");
        }
      }, 300000);
      try {
        if (!detectControllerRef.current) {
          throw new Error("Oops, something went wrong!");
        }
        const detected = await detectLanguage(
          prompt,
          detectControllerRef.current.signal
        );
        if (
          detected &&
          detected[0].detectedLanguage &&
          detected[0].confidence
        ) {
          const language = detected[0].detectedLanguage;
          const languageFull = ISO6391.getName(detected[0].detectedLanguage);
          const confidence = String(
            Math.round(detected[0].confidence * 1000) / 10
          );
          setDetectedLanguage({
            language: language,
            languageFull: languageFull,
            confidence: confidence,
          });
        }
      } catch (error) {
        setError(error as string);
      } finally {
        clearTimeout(timeoutId);
        setDetectingLanguage(false);
        setDownloadingLaguageModel(false);
      }
    }

    if (self !== undefined && "LanguageDetector" in self) {
      check();
    } else {
      setError(
        "Language Detector API is not compatible with your device / browser"
      );
      return;
    }
    return () => {
      if (detectControllerRef.current) {
        detectControllerRef.current.abort();
      }
    };
  }, [prompt]);

  useEffect(() => {
    if (prompt) {
      if (prompt.length > 187) setViewingFullPrompt(false);
    } else {
      setViewingFullPrompt(true);
    }
  }, [prompt]);
  return (
    <section className="flex flex-col items-center gap-[24px] w-full h-full lg:py-[60px] py-[36px]">
      <div className="w-full flex text-accent2 items-end flex-col gap-[12px]">
        <p className="text-accent2 rounded-[6px] bg-primary/5 p-4 relative pb-8 w-full">
          {displayedPrompt}
          {prompt && prompt.length > 187 && (
            <button
              className="cursor-pointer text-[12px] pl-[8px]"
              onClick={() => {
                setViewingFullPrompt((prev) => !prev);
              }}
            >
              {viewingFullPrompt ? "...hide" : "...show all"}
            </button>
          )}
          <button
            className="absolute bottom-0 right-[50%] translate-x-[50%] translate-y-[50%] p-2  rounded-full bg-primary hover:bg-primary/80 transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 "
            onClick={backToPrompt}
          >
            <RefreshCw className="text-secondary" size="21" />
          </button>
        </p>
        <div className="flex justify-between w-full">
          {prompt && (
            <p className="text-[12px] text-accent2/50 ">
              {prompt.trim().length + " characters"}
            </p>
          )}
          {error !== "" ? (
            <p className="text-red-500 text-[14px] py-[2px] px-[16px] rounded-[6px] border border-red-500 bg-red-50 ">
              {error}
              {" "}
              <span
                className="cursor-pointer text-[12px] hover:underline"
                onClick={() => {
                  openInfoModal(true);
                }}
              >
                Learn More
              </span>
            </p>
          ) : downloadingLanguageModel ? (
            <p className="flex gap-[16px] text-[14px] items-center">
              <Loader2 size="14" className="text-accent2 animate-spin" />
              Downloading Language Model...
            </p>
          ) : detectingLanguage ? (
            <p className="flex gap-[16px] text-[14px] items-center">
              <Loader2 size="14" className="text-accent2 animate-spin" />
              Detecting Language...
            </p>
          ) : (
            detectedLanguage.language !== "" && (
              <div className="flex flex-col gap-[16px] w-fit items-end">
                <div className="text-accent2 flex gap-[6px] items-end">
                  <p className="">
                    {detectedLanguage.languageFull
                      ? detectedLanguage.languageFull
                      : detectedLanguage.language}
                  </p>
                  <p className="text-[12px]">
                    {detectedLanguage.confidence + "% "}
                    <span>accuracy </span>
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="w-full flex flex-col relative">
        <div className="flex pl-[30px] text-[14px]">{tabComponents}</div>

        {prompt && (
          <TranslationTab
            prompt={prompt}
            detectedLanguage={detectedLanguage}
            feedback={feedback}
            setFeedback={setFeedback}
            inView={tab === "translation"}
            notAvailable={error !== ""}
            openInfoModal={openInfoModal}
          />
        )}
        {prompt && (
          <SummaryTab
            prompt={prompt}
            detectedLanguage={detectedLanguage}
            feedback={feedback}
            setFeedback={setFeedback}
            inView={tab === "summary"}
            notAvailable={error !== ""}
            openInfoModal={openInfoModal}
          />
        )}
      </div>
    </section>
  );
}
