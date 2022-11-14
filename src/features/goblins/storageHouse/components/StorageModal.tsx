import React, { useState } from "react";

import wood from "assets/resources/wood.png";
import player from "assets/npcs/goblin_head.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Delivery } from "./Delivery";
import { StorageItems } from "./StorageItems";
import { PIXEL_SCALE } from "features/game/lib/constants";
interface Props {
  onClose: () => void;
}
export const StorageModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"storage" | "delivery" | "treasury">(
    "storage"
  );

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "storage"} onClick={() => setTab("storage")}>
          <img src={wood} className="h-5 mr-2" />
          <span className="text-sm">Storage</span>
        </Tab>
        <Tab isActive={tab === "delivery"} onClick={() => setTab("delivery")}>
          <img src={player} className="h-5 mr-2" />
          <span className="text-sm">Delivery</span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      <div>
        {tab === "storage" && <StorageItems />}
        {tab === "delivery" && <Delivery onWithdraw={onClose} />}
      </div>
    </Panel>
  );
};
