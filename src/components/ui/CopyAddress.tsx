import React, { useState } from "react";

import { CopySvg } from "components/ui/CopyField";
import { shortAddress } from "lib/utils/shortAddress";

import { Label } from "components/ui/Label";
import clipboard from "clipboard";
import classNames from "classnames";

const EyeSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-eye-fill"
    viewBox="0 0 16 16"
  >
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </svg>
);

const CloseEyeSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-eye-slash-fill"
    viewBox="0 0 16 16"
  >
    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
  </svg>
);

const TOOL_TIP_MESSAGE = "Copy Address";

export const CopyAddress: React.FC<{ address: string }> = ({ address }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [showLabel, setShowLabel] = useState(false);

  const copyToClipboard = () => {
    try {
      clipboard.copy(address);

      setShowLabel(true);
      setTooltipMessage("Copied!");
    } catch (e: unknown) {
      setShowLabel(true);
      setTooltipMessage(typeof e === "string" ? e : "Copy Failed!");
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  return (
    <div className="relative w-full my-4">
      <div className="flex justify-center items-center w-full">
        <span
          className="cursor-pointer mr-3 flex-none"
          onClick={() => setShowFullAddress(!showFullAddress)}
        >
          {showFullAddress ? <CloseEyeSvg /> : <EyeSvg />}
        </span>
        <p
          className={classNames({
            "grow text-[11px] sm:text-xs": showFullAddress,
          })}
        >
          {showFullAddress ? address : shortAddress(address)}
        </p>
        <span
          className="cursor-pointer ml-3 flex-none"
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
          onClick={copyToClipboard}
        >
          <CopySvg />
        </span>
      </div>
      <div
        className={`absolute top-8 right-28 mr-5 transition duration-400 pointer-events-none ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        <Label type="success">{tooltipMessage}</Label>
      </div>
    </div>
  );
};
