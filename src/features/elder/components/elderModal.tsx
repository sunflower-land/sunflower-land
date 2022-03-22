import React, { useState } from "react";

import close from "assets/icons/close.png";
 
import wizard_hat from "assets/icons/wizard_hat.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { FOODS } from "features/game/types/craftables";
import {POTIONS} from "features/game/types/craftables";
import { CraftingItems } from "./CraftingItems";
import wzg from "assets/icons/disc.png";
import { WizardModal } from "./WizardModal";
 

interface Props {
  onClose: () => void;
}

export const ElderModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"wizard" | "potions">("wizard");
 
  

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab   isActive={tab === "wizard"} onClick={() => setTab("wizard")}>
            <img src={wzg} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Wizard Gold</span>
            
          </Tab>
          <Tab isActive={tab === "potions"} onClick={() => setTab("potions")}>
            <img src={wizard_hat} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Potions</span>
          </Tab>
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
 {tab === "wizard" && (
          <WizardModal   onClose={onClose} />
        )}
        {tab === "potions" && <CraftingItems items={POTIONS} isBulk onClose={onClose} />}
      </div>
    </Panel>
  );
};
