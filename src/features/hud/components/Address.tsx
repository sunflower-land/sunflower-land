import React, { useState } from "react";

import { Panel } from "../../../components/ui/Panel";
import { Label } from "components/ui/Label";

import player from "assets/icons/player.png";
import arrowLeft from "assets/icons/arrow_left.png";
import arrowRight from "assets/icons/arrow_right.png";

interface Props {
  address: string;
}

export const shortAddress = (address: string): string => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

export const Address: React.FC<Props> = ({ address }) => {
  const [tooltipMessage, setTooltipMessage] = useState("Click to copy");
  const [showAddress, setShowAddress] = useState(true);
  const [showLabel, setShowLabel] = useState(false);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(address);
    setTooltipMessage("Copied!");
  };

  const handleMouseEnter = () => {
    setShowLabel(true);
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
    setTooltipMessage("Click to copy");
  };

  return (
    <div className="fixed bottom-2 right-2 z-50  shadow-lg">
      <Panel>
        <div className="flex items-center">
          <img src={player} className="h-8 mr-2 z-50" />

          <span
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={copyToClipboard}
            className={`transition-all cursor-pointer duration-200 origin-[center_right] text-small text-shadow ${
              showAddress
                ? "scale-x-1 opacity-100 max-w-[400px] mr-2"
                : "scale-x-0 opacity-0 max-w-[0px] -mr-1"
            }`}
          >
            {shortAddress(address)}
          </span>

          <img
            className="hover:opacity-70 cursor-pointer h-4"
            src={showAddress ? arrowRight : arrowLeft}
            onClick={() => {
              setShowAddress(!showAddress);
            }}
          />
        </div>
        <div
          className={`absolute mr-5 bottom-20 -right-[1rem] transition ${
            showLabel ? "opacity-100" : "opacity-0"
          }`}
        >
          <Label>{tooltipMessage}</Label>
        </div>
      </Panel>
    </div>
  );
};
