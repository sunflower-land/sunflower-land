import React, { useState } from "react";

import seeds from "assets/icons/seeds.png";
import sunflowerPlant from "assets/crops/sunflower/crop.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Seeds } from "./Seeds";
import { Plants } from "./Plants";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const ShopItems: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"buy" | "sell">("buy");

  const handleTabClick = (tab: "buy" | "sell") => {
    setTab(tab);
  };

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "buy"} onClick={() => handleTabClick("buy")}>
          <img src={seeds} className="h-5 mr-2" />
          <span className="text-sm">Buy</span>
        </Tab>
        <Tab isActive={tab === "sell"} onClick={() => handleTabClick("sell")}>
          <img src={sunflowerPlant} className="h-5 mr-2" />
          <span className="text-sm">Sell</span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      {tab === "buy" && <Seeds onClose={onClose} />}
      {tab === "sell" && <Plants />}
    </Panel>
  );
};
