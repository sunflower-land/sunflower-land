import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import sunflowerPlant from "assets/crops/sunflower/crop.png";
import flour from "assets/crops/wheat/flour.png";
import close from "assets/icons/close.png";
import seeds from "assets/icons/seeds.png";
import gnome from "assets/nfts/gnome.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { InventoryCrops } from "./InventoryCrops";
import { InventoryFoods } from "./InventoryFoods";
import { InventoryNFTs } from "./InventoryNFTs";
import { InventorySeeds } from "./InventorySeeds";

interface Props {
  onClose: () => void;
}

export const InventoryItems: React.FC<Props> = ({ onClose }) => {

  const currentTab = localStorage.getItem("inventory.tab") ?? "seeds";

  const [tab, setTab] = useState<"seeds" | "crops" | "foods" | "nfts">(currentTab);

  const cached = localStorage.getItem("inventory.tab");
  
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
      {tab === "seeds" && <InventorySeeds />}
      {tab === "crops" && <InventoryCrops />}
      {tab === "foods" && <InventoryFoods />}
      {tab === "nfts" && <InventoryNFTs />}
      
    </Panel>
  );
};
