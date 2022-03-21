import React, { useState } from "react";

import close from "assets/icons/close.png";
 
import wizard_hat from "assets/icons/wizard_hat.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { FOODS } from "features/game/types/craftables";
import {PERKS} from "features/game/types/craftables";
import { CraftingItems } from "./CraftingItems";

interface Props {
  onClose: () => void;
}

export const EventModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState("perks");
  

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab   isActive={tab === "perks"} onClick={() => setTab("perks")}>
            <img src={wizard_hat} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Event</span>
            
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
        {tab === "perks" && <CraftingItems items={PERKS} onClose={onClose} />}
      </div>
    </Panel>
  );
};
