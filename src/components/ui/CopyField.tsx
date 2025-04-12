import React, { useState } from "react";
import { Label } from "./Label";
import { translate } from "lib/i18n/translate";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";

export const CopySvg = ({ height = 16 }: { height?: number }) => (
  <svg
    className="fill-white"
    aria-hidden="true"
    height={`${height}`}
    viewBox="0 0 16 16"
    version="1.1"
    width="16"
    data-view-component="true"
  >
    <path
      fillRule="evenodd"
      d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
    ></path>
    <path
      fillRule="evenodd"
      d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
    ></path>
  </svg>
);

interface Props {
  text?: string;
  copyFieldMessage?: string;
}

export const CopyField: React.FC<Props> = ({ text = "", copyFieldMessage }) => {
  const [tooltipMessage, setTooltipMessage] = useState(copyFieldMessage);
  const [showLabel, setShowLabel] = useState(false);
  const { isDarkMode } = useIsDarkMode();

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setTooltipMessage(translate("copied"));
    } catch (e: unknown) {
      setTooltipMessage(typeof e === "string" ? e : translate("copy.failed"));
    }

    setTimeout(() => {
      setTooltipMessage(copyFieldMessage);
    }, 2000);
  };

  const handleMouseEnter = () => {
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
  };

  return (
    <div className="mb-4">
      <div
        className={`mt-2 p-1 ${isDarkMode ? "bg-brown-200" : "bg-[#c28669]"}`}
      >
        <div className="flex justify-content-between p-2 gap-x-2 align-items-center">
          <span className="text-xs m-auto break-all select-text">{text}</span>
          <span
            className="cursor-pointer scale-[1.5]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={copyToClipboard}
          >
            <CopySvg />
          </span>
        </div>
      </div>
      <div
        className={`absolute mr-5 transition duration-400 pointer-events-none ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        <Label type="default">{tooltipMessage}</Label>
      </div>
    </div>
  );
};
