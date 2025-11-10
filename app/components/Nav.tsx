"use client";
import ThemeToggle from "./ThemeToggle";
import { ChevronDown, Info as InfoBtn } from "lucide-react";
import { motion } from "motion/react";
import { useState, Dispatch, SetStateAction } from "react";

export default function Nav({
  openInfoModal,
}: {
  openInfoModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [active, setActive] = useState(false);

  return (
    <motion.nav
      variants={{
        active: { y: 0 },
        inactive: { y: "-82%" },
      }}
      initial={false}
      onBlur={(e) => {
        const nextFocused = e.relatedTarget as HTMLElement | null;
        if (!e.currentTarget.contains(nextFocused)) {
          setActive(false);
        }
      }}
      animate={active ? "active" : "inactive"}
      className="flex flex-col justify-between items-center pt-[30px] px-[8px] fixed right-[16px] outline-[2px] rounded-[6px] outline-secondary backdrop-blur-[10px] bg-secondary/30 gap-[30px]  has-[.drop:hover]:translate-y-[2px] transition-transform duration-150 z-[200]"
    >
      <div className="flex flex-col gap-[20px] items-center">
        <ThemeToggle />
        <button
          onClick={() => {
            setActive(false);
            openInfoModal(true);
          }}
          className="cursor-pointer"
          type="button"
          role="button"
        >
          <InfoBtn
            size="30"
            className="fill-primary text-mainBg hover:fill-primary/70"
          />
        </button>
      </div>
      <motion.button
        className="cursor-pointer drop pb-[4px]"
        onClick={() => {
          setActive((prev) => !prev);
        }}
      >
        <ChevronDown size="18" className="text-accent2/70" />
      </motion.button>
    </motion.nav>
  );
}
