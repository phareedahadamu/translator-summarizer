"use client";

import { useState, useEffect } from "react";
import { ThemeContext, ThemeOptions, themeOptions } from "./constants";
import Nav from "./components/Nav";
import PromptSection from "./components/PromptSection";
import ActionSection from "./components/ActionSection";
import Info from "./components/Info";

export default function MainPage() {
  const [theme, setTheme] = useState<ThemeOptions | null>(null);
  const value = { theme, setTheme };
  const [prompt, setPrompt] = useState<string | undefined>(undefined);
  const [promptReceived, setPromptReceived] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState(false);
  useEffect(() => {
    if (theme === null) {
      const storedTheme = localStorage.getItem("translatorSummarizerTheme");
      if (storedTheme && themeOptions.includes(storedTheme as ThemeOptions))
        setTheme(storedTheme as ThemeOptions);
      else setTheme("light");
    } else {
      localStorage.setItem("translatorSummarizerTheme", theme);
    }
  }, [theme]);
  return (
    <ThemeContext value={value}>
      <main
        className={`bg-mainBg w-full ${
          theme as string
        } flex flex-col items-center bg-radial from-secondary to-mainBg to-90%  gap-[24px] font-sans h-screen `}
      >
        <Nav openInfoModal={setOpenInfo} />
        {openInfo && <Info openInfoModal={setOpenInfo} />}
        <div className="max-w-[840px] w-[98%] h-full flex">
          {!promptReceived ? (
            <PromptSection
              prompt={prompt}
              setPrompt={setPrompt}
              setPromptReceived={setPromptReceived}
            />
          ) : (
            prompt &&
            promptReceived && (
              <ActionSection
                prompt={prompt}
                setPrompt={setPrompt}
                setPromptReceived={setPromptReceived}
                openInfoModal={setOpenInfo}
              />
            )
          )}
        </div>
      </main>
    </ThemeContext>
  );
}
