import React, { useState } from "react";

import close from "assets/icons/close.png";
import radishPie from "assets/sfts/radish_pie.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { FOODS } from "features/game/types/craftables";

import { CraftingItems } from "./CraftingItems";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const Crafting: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"cook" | "sell">("cook");

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
        <Tab isActive={tab === "cook"} onClick={() => setTab("cook")}>
          <img src={radishPie} className="h-5 mr-2" />
          <span className="text-sm">Cook</span>
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

      <div
        style={{
          minHeight: "200px",
        }}
      >
        {tab === "cook" && <CraftingItems items={FOODS()} onClose={onClose} />}
      </div>
    </Panel>
  );
};
