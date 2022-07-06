import React, { useState } from "react";

import wood from "assets/resources/wood.png";
import player from "assets/npcs/goblin_head.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { DeliverItems } from "./DeliverItems";
import { Delivery } from "./Delivery";
import { StorageItems } from "./StorageItems";

interface Props {
  onClose: () => void;
}
export const StorageModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"storage" | "delivery">("storage");

  return (
    <Panel className="pt-5 relative max-w-5xl">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "storage"} onClick={() => setTab("storage")}>
            <img src={wood} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Storage</span>
          </Tab>
          <Tab isActive={tab === "delivery"} onClick={() => setTab("delivery")}>
            <img src={player} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Delivery</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      <div>
        {tab === "storage" && <StorageItems />}
        {tab === "delivery" && <Delivery />}
      </div>
    </Panel>
  );
};
