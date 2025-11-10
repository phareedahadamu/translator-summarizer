"use client";

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { checkTranslatorAvailability, translateText } from "../actions";
import {
  translationLanguages,
  ActionFeedback,
  DetectedLanguage,
} from "../constants";
import ISO6391 from "iso-639-1";
import TranslationSummaryDisplay from "./TranslationSummaryDisplay";

export default function TranslationTab({
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
  // Translator....
  const translateControllerRef = useRef<AbortController | null>(null);
  const selectTranslationLanguageComponent = translationLanguages.map(
    (lang, idx) => {
      if (lang.short === detectedLanguage.language) return;
      return (
        <option key={idx} value={lang.short} className="bg-mainBg ">
          {lang.long}
        </option>
      );
    }
  );
  const [selectedTranslationLanguage, setSelectedTranslationLanguage] =
    useState("");
  const [translating, setTranslating] = useState(false);

  const [downloadingTranslator, setDownloadingTranslator] = useState(false);

  async function translate() {
    if (translateControllerRef.current) {
      translateControllerRef.current.abort("Timeout: Try again later");
    }
    translateControllerRef.current = new AbortController();
    if (!detectedLanguage.language || !prompt || !selectedTranslationLanguage)
      return;

    setTranslating(true);
    if (self !== undefined && "Translator" in self) {
      const availability = await checkTranslatorAvailability(
        detectedLanguage.language,
        selectedTranslationLanguage
      );
      if (availability === "unavailable") {
        setFeedback((prev) => [
          {
            type: "translation",
            response: "",
            sourceLang:
              detectedLanguage.languageFull != ""
                ? detectedLanguage.languageFull
                : detectedLanguage.language,
            targetLang: ISO6391.getName(selectedTranslationLanguage),
            error: `"${ISO6391.getName(
              detectedLanguage.language
            )} to ${ISO6391.getName(
              selectedTranslationLanguage
            )}" translator is currently not supported`,
          },
          ...prev,
        ]);
        setTranslating(false);
        return;
      }
      if (availability === "downloadable" || availability === "downloading") {
        setDownloadingTranslator(true);
        setTranslating(false);
      }
      const timeoutId = setTimeout(() => {
        if (translateControllerRef.current) {
          console.warn("Aborting due to timeout");
          translateControllerRef.current.abort("Timeout: Try again later");
        }
      }, 300000);
      try {
        if (!translateControllerRef.current) {
          throw new Error("Oops, something went wrong!");
        }
        const output = await translateText(
          detectedLanguage.language,
          selectedTranslationLanguage,
          prompt,
          translateControllerRef.current.signal
        );
        if (output)
          setFeedback((prev) => [
            {
              type: "translation",
              response: output,
              sourceLang:
                detectedLanguage.languageFull != ""
                  ? detectedLanguage.languageFull
                  : detectedLanguage.language,
              targetLang: ISO6391.getName(selectedTranslationLanguage),
              error: "",
            },
            ...prev,
          ]);
      } catch (error) {
        setFeedback((prev) => [
          {
            type: "translation",
            response: "",
            sourceLang:
              detectedLanguage.languageFull != ""
                ? detectedLanguage.languageFull
                : detectedLanguage.language,
            targetLang: ISO6391.getName(selectedTranslationLanguage),
            error: `${error}.`,
          },
          ...prev,
        ]);
        console.warn(error);
      } finally {
        clearTimeout(timeoutId);
        setDownloadingTranslator(false);
        setTranslating(false);
      }
    } else {
      setFeedback((prev) => [
        {
          type: "translation",
          response: "",
          sourceLang:
            detectedLanguage.languageFull != ""
              ? detectedLanguage.languageFull
              : detectedLanguage.language,
          targetLang: ISO6391.getName(selectedTranslationLanguage),
          error: `Translator is not compatible with your device / browser`,
        },
        ...prev,
      ]);
    }
  }

  useEffect(() => {
    return () => {
      if (translateControllerRef.current) {
        translateControllerRef.current.abort("Timeout: Try again later");
        console.log("⛔ Aborted translator on unmount");
      }
    };
  }, []);

  return (
    <div
      className={`w-full flex flex-col px-4 pb-8 pt-4 gap-[12px] rounded-[12px] border border-primary/25 bg-secondary ${
        inView ? "z-40" : "z-10 invisible"
      } absolute bottom-0 left-0 translate-y-[100%]`}
    >
      <div className="flex justify-center gap-[12px]">
        <select
          onChange={(e) => {
            setSelectedTranslationLanguage(e.currentTarget.value);
          }}
          value={selectedTranslationLanguage}
          className="max-w-[200px] w-full cursor-pointer text-[14px] text-accent2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={translating || downloadingTranslator || notAvailable}
        >
          <option disabled value="" className="bg-mainBg ">
            Select a language
          </option>
          {selectTranslationLanguageComponent}
        </select>
        <button
          className="cursor-pointer  rounded-[6px] bg-primary px-[12px] py-[6px] text-[14px] not-disabled:hover:bg-primary/80 duration-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 text-secondary"
          type="button"
          onClick={() => {
            translate();
          }}
          disabled={
            translating ||
            !selectedTranslationLanguage ||
            downloadingTranslator ||
            notAvailable
          }
        >
          Translate
        </button>
      </div>
      {(translating || downloadingTranslator) && (
        <div className="flex w-full justify-center text-[14px] text-accent2 items-center gap-[12px]">
          <Loader2 size="14" className="text-accent2 animate-spin" />
          <p className="text-[14px]">
            {translating
              ? "Translating..."
              : "Downloading translator models..."}
          </p>
        </div>
      )}
      {feedback.length > 0 && (
        <TranslationSummaryDisplay
          feedback={feedback}
          type={"translation"}
          openInfoModal={openInfoModal}
        />
      )}
    </div>
  );
}
