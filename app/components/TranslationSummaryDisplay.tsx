"use client";
import { Dispatch, SetStateAction } from "react";
import { ActionFeedback } from "../constants";
import CopyBtn from "./CopyBtn";
export default function TranslationSummaryDisplay({
  feedback,
  type,
  openInfoModal,
}: {
  feedback: ActionFeedback[];
  type: string;
  openInfoModal: Dispatch<SetStateAction<boolean>>;
}) {
  const feedbackComponents = feedback.map((item, idx) => {
    if (item.type !== type) return;
    return (
      <div
        key={idx}
        className="text-accent2 flex flex-col gap-[6px] border-t-[2px] border-primary/15 pt-[18px] px-[16px]"
      >
        <p className="text-[14px] text-accent2/70">
          {"sourceLang" in item &&
            "targetLang" in item &&
            '"' + item.sourceLang + " to " + item.targetLang + '"'}
          {"summaryType" in item &&
            "length" in item &&
            '"' + item.summaryType + "- " + item.length + '"'}
        </p>
        {item.error != "" && (
          <p className="text-red-500 text-[14px]">
            {item.error}{" "}
            <span
              className="cursor-pointer text-[12px] hover:underline"
              onClick={() => {
                openInfoModal(true);
              }}
            >
              Learn More
            </span>
          </p>
        )}
        {item.response != "" && (
          <p>
            {item.response}
            <CopyBtn text={item.response} />
          </p>
        )}
      </div>
    );
  });
  return (
    <div className="w-full flex flex-col gap-[40px] ">
      <>{feedbackComponents}</>
    </div>
  );
}
