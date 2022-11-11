import React, { useState } from "react";

import close from "assets/icons/close.png";
import chicken from "assets/resources/chicken.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ANIMALS } from "features/game/types/craftables";
import { CraftingItems } from "features/farming/blacksmith/components/CraftingItems";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const BarnSale: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"animals">("animals");

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
        <Tab isActive={tab === "animals"} onClick={() => setTab("animals")}>
          <img src={chicken} className="h-5 mr-2" />
          <span className="text-sm">Animals</span>
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

      <div
        style={{
          minHeight: "200px",
        }}
      >
        {tab === "animals" && (
          <CraftingItems items={ANIMALS()} onClose={onClose} />
        )}
      </div>
    </Panel>
  );
};
