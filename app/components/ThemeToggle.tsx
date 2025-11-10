"use client";
import { useContext } from "react";
import { ThemeContext } from "../constants";
import { motion } from "motion/react";
import { Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  function handleClick() {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      else return "light";
    });
  }

  return (
    <motion.button
      className={`cursor-pointer w-10 h-6 rounded-full  flex items-center justify-center disabled:cursor-not-allowed   bg-transparent `}
      type="button"
      aria-label={theme === "light" ? "Dark mode off" : "Dark mode on"}
      aria-checked={theme === "dark"}
      role="switch"
      disabled={!theme}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 1 }}
      whileTap={{ scale: [1.15, 1.05, 1] }}
      variants={{
        dark: {
          boxShadow:
            "0 2px 8px rgba(0,166,251,0.5), 0 -2px 8px rgba(250,0,167,0.5)",
        },
        light: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 -2px 4px rgba(0,0,0,0.15)",
        },
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      animate={theme ?? "light"}
    >
      <motion.span
        aria-hidden="true"
        variants={{
          dark: { color: "var(--primary)" },
          light: { color: "var(--grey2)" },
        }}
      >
        <Moon size="16" className="text-inherit" />
      </motion.span>
    </motion.button>
  );
}
