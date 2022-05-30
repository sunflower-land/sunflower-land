import React, { useState } from "react";

import close from "assets/icons/close.png";
import radishPie from "assets/nfts/radish_pie.png";
import carrotCake from "assets/nfts/cakes/carrot_cake.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { FOODS } from "features/game/types/craftables";

import { CraftingItems } from "./CraftingItems";
import { Cakes } from "./Cakes";
import { CONFIG } from "lib/config";

interface Props {
  onClose: () => void;
}

export const Crafting: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"cook" | "sell">("cook");

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "cook"} onClick={() => setTab("cook")}>
            <img src={radishPie} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Cook</span>
          </Tab>
          {CONFIG.NETWORK === "mumbai" && (
            <Tab isActive={tab === "sell"} onClick={() => setTab("sell")}>
              <img src={carrotCake} className="h-5 mr-2" />
              <span className="text-sm text-shadow">Sell</span>
            </Tab>
          )}
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      <div
        style={{
          minHeight: "200px",
        }}
      >
        {tab === "cook" && <CraftingItems items={FOODS()} />}
        {tab === "sell" && <Cakes />}
      </div>
    </Panel>
  );
};
