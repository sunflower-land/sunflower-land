import React, { useState } from "react";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Seeds } from "./Seeds";
import { Crops } from "./Crops";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "./Tutorial";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

interface Props {
  onClose: () => void;
}

export const ShopItems: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Market")
  );

  const handleTabClick = (tab: "buy" | "sell") => {
    setTab(tab);
  };

  const acknowledge = () => {
    acknowledgeTutorial("Market");
    setShowTutorial(false);
  };

  const bumpkinParts: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    hair: "Rancher Hair",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Parsnip",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  if (showTutorial) {
    return <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />;
  }

  return (
    <Panel className="relative" hasTabs bumpkinParts={bumpkinParts}>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "buy"} onClick={() => handleTabClick("buy")}>
          <img src={SUNNYSIDE.icons.seeds} className="h-5 mr-2" />
          <span className="text-sm">Buy</span>
        </Tab>
        <Tab isActive={tab === "sell"} onClick={() => handleTabClick("sell")}>
          <img src={CROP_LIFECYCLE.Sunflower.crop} className="h-5 mr-2" />
          <span className="text-sm">Sell</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
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
      {tab === "sell" && <Crops />}
    </Panel>
  );
};
