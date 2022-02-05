import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import sunflowerPlant from "assets/crops/sunflower/crop.png";
import flour from "assets/crops/wheat/flour.png";
import close from "assets/icons/close.png";
import seeds from "assets/icons/seeds.png";
import gnome from "assets/nfts/gnome.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { NFTs, TOOLS, FOODS } from "features/game/types/craftables";
import { CROPS, SEEDS } from 'features/game//types/crops';

import { InventoryPreview } from "./InventoryPreview";

interface Props {
  onClose: () => void;
}

export const InventoryItems: React.FC<Props> = ({ onClose }) => {

  const currentTab = localStorage.getItem("inventory.tab") ?? "seeds";
  
  const [tab, setTab] = useState(currentTab  as "seeds" | "crops" | "foods" | "nfts");
  
  return (
    <Panel className="pt-5 relative">
 
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "seeds"} onClick={() => setTab("seeds")}>
            <img src={seeds} className="h-5 mr-2" />
            <span className="text-xs text-shadow">Seeds</span>
          </Tab>
          <Tab isActive={tab === "crops"} onClick={() => setTab("crops")}>
            <img src={sunflowerPlant} className="h-5 mr-2" />
            <span className="text-xs text-shadow">Crops</span>
          </Tab>
          <Tab isActive={tab === "foods"} onClick={() => setTab("foods")}>
            <img src={flour} className="h-5 mr-2" />
            <span className="text-xs text-shadow">Foods</span>
          </Tab>
          <Tab isActive={tab === "nfts"} onClick={() => setTab("nfts")}>
            <img src={gnome} className="h-5 mr-2" />
            <span className="text-xs text-shadow">Items</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      {/* {tab === "craft" && <CraftingItems items={TOOLS} isBulk />}
      {tab === "nfts" && <CraftingItems items={NFTs} />}
      {tab === "foods" && <CraftingItems items={FOODS} />} */}
      
      {tab === "seeds" && <InventoryPreview items={SEEDS} />}
      {tab === "crops" && <InventoryPreview items={CROPS} />}
      {tab === "foods" && <InventoryPreview items={FOODS} />}
      {tab === "nfts" && <InventoryPreview items={Object.assign(TOOLS,NFTs)} />}
      
    </Panel>
  );
};
