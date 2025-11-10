"use client";
import { createContext, SetStateAction, Dispatch } from "react";

export const themeOptions = ["light", "dark"] as const;
export type ThemeOptions = (typeof themeOptions)[number];

export const ThemeContext = createContext<{
  theme: ThemeOptions | null;
  setTheme: Dispatch<SetStateAction<ThemeOptions | null>>;
}>({
  theme: "light",
  setTheme: () => {},
});

export const translationLanguages = [
  { long: "English", short: "en" },
  { long: "Spanish", short: "es" },
  { long: "French", short: "fr" },
  { long: "Japanese", short: "ja" },
  { long: "Chinese", short: "zh" },
  { long: "Portuguese", short: "pt" },
  { long: "Russian", short: "ru" },
  { long: "Arabic", short: "ar" },
  { long: "Turkish", short: "tr" },
  { long: "German", short: "de" },
];

export interface ActionFeedback {
  type: string;
  response: string;
  sourceLang?: string;
  targetLang?: string;
  length?: string;
  summaryType?: string;
  error: string;
}

export const summaryLength = ["short", "medium", "long"];

export const summaryType = ["key-points", "tldr", "teaser", "headline"];

export interface DetectedLanguage {
  language: string;
  languageFull: string;
  confidence: string;
}
