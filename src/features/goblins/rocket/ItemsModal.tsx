import React from "react";

import { LimitedItemType } from "features/game/types";
import { Rare } from "../Rare";

import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ItemsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = React.useState<"items">("items");

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "items"} onClick={() => setTab("items")}>
            {/* <img src={flag} className="h-5 mr-2" /> */}
            <span className="text-sm text-shadow">Items</span>
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
        <Rare
          type={LimitedItemType.MOMEventItem}
          onClose={onClose}
          // canCraft={true}
        />
      </div>
    </Panel>
  );
};
