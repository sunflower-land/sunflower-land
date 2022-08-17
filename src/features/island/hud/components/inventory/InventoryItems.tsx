import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";

import basket from "assets/icons/basket.png";
import chest from "assets/icons/chest.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { Chest } from "./Chest";

type Tab = "basket" | "chest";

interface Props {
  state: GameState;
  onClose: () => void;
  isFarming?: boolean;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const InventoryItems: React.FC<Props> = ({ state, onClose }) => {
  const [currentTab, setCurrentTab] = useState<Tab>("basket");

  const handleTabClick = (tab: Tab) => {
    setCurrentTab(tab);
  };

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab
            className="flex items-center"
            isActive={currentTab === "basket"}
            onClick={() => handleTabClick("basket")}
          >
            <img src={basket} className="h-4 sm:h-5 mr-2" />
            <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
              Basket
            </span>
          </Tab>
          <Tab
            className="flex items-center"
            isActive={currentTab === "chest"}
            onClick={() => handleTabClick("chest")}
          >
            <img src={chest} className="h-4 sm:h-5 mr-2" />
            <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
              Chest
            </span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      {currentTab === "basket" && <Basket />}
      {currentTab === "chest" && <Chest state={state} closeModal={onClose} />}
    </Panel>
  );
};
