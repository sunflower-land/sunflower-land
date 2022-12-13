import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { CopySvg } from "components/ui/CopyField";
import { shortAddress } from "lib/utils/shortAddress";
import * as AuthProvider from "features/auth/lib/Provider";

import alert from "assets/icons/expression_alerted.png";
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

const TOOL_TIP_MESSAGE = "Copy Farm Address";

export const Deposit: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [showFullAddress, setShowFullAddress] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [showLabel, setShowLabel] = useState(false);

  const farmAddress = authState.context.address as string;

  const copyToClipboard = () => {
    try {
      clipboard.copy(farmAddress);

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
    <div className="p-2 pt-0">
      <div className="flex flex-col items-center text-xs sm:text-sm mb-3">
        <p className="mb-3">
          Your account in Sunflower Land has its own wallet address into which
          you can send SFL tokens or SFL collectibles.
        </p>
        <p>
          {`This address will be the "recipient" address of any transfer you initiate whether it's from your personal wallet or from a marketplace like OpenSea or Niftyswap.`}
        </p>
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
              {showFullAddress ? farmAddress : shortAddress(farmAddress)}
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
        <p className="mb-3">
          Always double check the address before and after copying and pasting.
        </p>
        <p>
          Once the transfer has been completed, you can go into Settings and use
          the Refresh button to see your deposited items in the game.
        </p>
      </div>

      <div className="flex items-center border-2 rounded-md border-black p-2 bg-orange-400">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          DO NOT SEND MATIC, BUMPKIN ITEMS OR ANY OTHER NON SFL TOKENS TO YOUR
          FARM ADDRESS
        </span>
      </div>
    </div>
  );
};
