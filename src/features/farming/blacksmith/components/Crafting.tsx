import React, { useState } from "react";

import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { TOOLS } from "features/game/types/craftables";

import { CraftingItems } from "./CraftingItems";

interface Props {
  onClose: () => void;
}

export const Crafting: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"craft">("craft");

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "craft"} onClick={() => setTab("craft")}>
            <img src={hammer} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Tools</span>
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
        {tab === "craft" && (
          <CraftingItems items={TOOLS} isBulk onClose={onClose} />
        )}
      </div>
    </Panel>
  );
};
