import React from "react";

import seeds from "assets/icons/plant.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { DecorationItems } from "./DecorationItems";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const DecorationShopItems: React.FC<Props> = ({ onClose }) => {
  return (
    <Panel
      className="relative"
      hasTabs
      bumpkinParts={{
        body: "Beige Farmer Potion",
        hair: "Red Long Hair",
        pants: "Farmer Overalls",
        shirt: "Bumpkin Art Competition Merch",
        tool: "Farmer Pitchfork",
        background: "Farm Background",
        shoes: "Black Farmer Boots",
      }}
    >
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive>
          <img src={seeds} className="h-5 mr-2" />
          <span className="text-sm">Decorations</span>
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
      <DecorationItems onClose={onClose} />
    </Panel>
  );
};
