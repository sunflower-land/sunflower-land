import React, { useState } from "react";

import close from "assets/icons/close.png";
import flag from "assets/nfts/flags/sunflower_flag.gif";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { FLAGS } from "features/game/types/craftables";
import { CraftingItems } from "features/blacksmith/components/CraftingItems";
import { Rare } from "features/blacksmith/components/Rare";

interface Props {
  onClose: () => void;
}

export const TailorSale: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"flags">("flags");

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "flags"} onClick={() => setTab("flags")}>
            <img src={flag} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Flags</span>
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
        <Rare items={FLAGS} onClose={onClose} hasAccess={true} />
        <p className="text-xxs p-1 m-1 underline text-center">
          Max 2 flags per farm. Crafting flags will sync your farm to the
          blockchain.
        </p>
      </div>
    </Panel>
  );
};
