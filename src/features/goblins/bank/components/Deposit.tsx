import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { CopySvg } from "components/ui/CopyField";
import { OuterPanel } from "components/ui/Panel";
import { shortAddress } from "features/farming/hud/components/Address";
import * as AuthProvider from "features/auth/lib/Provider";

import farm from "assets/brand/nft.png";
import alert from "assets/icons/expression_alerted.png";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
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

const SFLTokenInstructions = () => (
  <ol>
    <li className="flex text-xs mb-3">
      <span className="mr-1">1.</span>
      <span>{'Go to MetaMask and under "Assets" tab click SFL token'}</span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">2.</span>
      <span>{`Click "Send" on the token's main page`}</span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">3.</span>
      <span>
        {
          'Copy your farm address from above and paste into the "Add Recipient" field'
        }
      </span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">4.</span>
      <span>
        {
          'In the "Amount" field, enter the amount of the token you want to deposit'
        }
      </span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">5.</span>
      <span>{'Review the transaction detail and click "Confirm" to send'}</span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">6.</span>
      <span>
        {
          'Once the transaction has completed successfully, open the menu inside Sunflower Land and click "Sync on Chain"'
        }
      </span>
    </li>
  </ol>
);

const SFLItemsInstructions = () => (
  <ol>
    <div className="text-xs mb-3 text-center">
      <span>
        Only send items from the
        <a
          className="underline ml-2"
          href="https://docs.sunflower-land.com/fundamentals/withdrawing"
          target="_blank"
          rel="noreferrer"
        >
          Sunflower Land Collectibles
        </a>
      </span>
    </div>

    <li className="flex text-xs mb-3">
      <span className="mr-1">1.</span>
      <span>{'Go to Opensea and click the "Transfer" button'}</span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">2.</span>
      <span>
        {'Copy your farm address from above and paste into the "Address" field'}
      </span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">3.</span>
      <span>Follow the prompts</span>
    </li>
    <li className="flex text-xs mb-3">
      <span className="mr-1">4.</span>
      <span>
        {
          'Once the transaction has completed successfully, open the menu inside Sunflower Land and click "Sync on Chain"'
        }
      </span>
    </li>
  </ol>
);

const TOOL_TIP_MESSAGE = "Copy Farm Address";

enum Instructions {
  "token",
  "item",
}

export const Deposit: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [showFullAddress, setShowFullAddress] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [showLabel, setShowLabel] = useState(false);
  const [instructions, setInstructions] = useState<Instructions | null>(null);

  const farmAddress = authState.context.address as string;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(farmAddress);
    setTooltipMessage("Copied!");
    setTimeout(() => {
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  const showTokenInstructions = instructions === Instructions.token;
  const showItemInstructions = instructions === Instructions.item;

  return (
    <div>
      {/* Address card */}
      <div className="h-14 w-full" style={{ perspective: "1000px" }}>
        <div className="relative">
          <OuterPanel
            className="w-full transition-transform duration-700 h-14"
            style={
              {
                transformStyle: "preserve-3d",
                transform: showFullAddress ? "rotateX(180deg)" : undefined,
              } as { [key: string]: React.CSSProperties }
            }
          >
            <div
              className="flex items-center absolute w-full h-full px-2 rotate-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img src={farm} className="h-8 mr-2 z-50" />
              <div className="flex flex-1 justify-center items-center">
                <span>{shortAddress(farmAddress)}</span>
                <span
                  className="cursor-pointer ml-3"
                  onMouseEnter={() => setShowLabel(true)}
                  onMouseLeave={() => setShowLabel(false)}
                  onClick={copyToClipboard}
                >
                  <CopySvg />
                </span>
              </div>
              <span
                className="cursor-pointer"
                onClick={() => setShowFullAddress(true)}
              >
                <EyeSvg />
              </span>
            </div>
            <div
              className="flex items-center justify-center absolute w-full h-full px-2"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <span className="text-[10px] sm:text-xs mt-2 break-all select-text">
                {farmAddress}
              </span>
              <span
                className="cursor-pointer ml-3 mt-2"
                onClick={() => setShowFullAddress(false)}
              >
                <CloseEyeSvg />
              </span>
            </div>
          </OuterPanel>
          <div
            className={`absolute top-12 right-16 mr-5 transition duration-400 pointer-events-none ${
              showLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            <Label>{tooltipMessage}</Label>
          </div>
        </div>
      </div>
      {/* Instructions */}
      <span className="text-sm sm:text-lg text-shadow underline block text-center mb-4 mt-6">
        How to deposit?
      </span>

      <div className="flex mb-3">
        <Button
          className={classNames("mr-1", {
            "bg-brown-300": showTokenInstructions,
          })}
          onClick={() => setInstructions(Instructions.token)}
        >
          SFL Token
        </Button>
        <Button
          className={classNames("ml-1", {
            "bg-brown-300": showItemInstructions,
          })}
          onClick={() => setInstructions(Instructions.item)}
        >
          SFL Items
        </Button>
      </div>

      {showTokenInstructions && <SFLTokenInstructions />}
      {showItemInstructions && <SFLItemsInstructions />}

      <div className="flex items-center border-2 rounded-md border-black p-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          DO NOT SEND MATIC OR ANY OTHER NON SFL TOKENS TO YOUR FARM ADDRESS
        </span>
      </div>
    </div>
  );
};
