import React, { useState } from "react";

import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Cakes } from "features/farming/cakeStall/components/Cakes";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const CakeSale: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"cook" | "sell">("cook");

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
        <Tab isActive={tab === "cook"}>
          <span className="text-sm">Cake Collection</span>
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
        <Cakes />
      </div>
    </Panel>
  );
};
