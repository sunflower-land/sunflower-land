import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import sunflowerPlant from "assets/crops/sunflower/crop.png";
import close from "assets/icons/close.png";
import seeds from "assets/icons/seeds.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { InventoryFoods } from "./InventoryFoods";
import { InventorySeeds } from "./InventorySeeds";

interface Props {
  onClose: () => void;
}

export const InventoryItems: React.FC<Props> = ({ onClose }) => {

  const [tab, setTab] = useState<"seeds" | "food">("seeds");

  

  return (
    <Panel className="pt-5 relative">
 
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "seeds"} onClick={() => setTab("seeds")}>
            <img src={seeds} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Seeds</span>
          </Tab>
          <Tab isActive={tab === "food"} onClick={() => setTab("food")}>
            <img src={sunflowerPlant} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Food</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      {tab === "seeds" && <InventorySeeds />}
      {tab === "food" && <InventoryFoods />}
      
    </Panel>
  );
};
