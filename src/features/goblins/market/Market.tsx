import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GoblinProvider";

import market from "assets/buildings/shop_building.png";
import plant from "assets/icons/plant.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import { MarketItems } from "./MarketItems";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { shopAudio } from "lib/utils/sfx";

export const Market: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMarketClick = () => {
    setIsOpen(true);
    shopAudio.play();
  };

  return (
    <div
      id={Section.Shop}
      className="absolute cursor-pointer hover:img-highlight"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        right: `${GRID_WIDTH_PX * 30}px`,
        top: `${GRID_WIDTH_PX * 25}px`,
      }}
    >
      <img
        src={market}
        alt="market"
        onClick={handleMarketClick}
        className="w-full"
      />
      <Action
        className="absolute top-5 left-4"
        text="Shop"
        icon={plant}
        onClick={handleMarketClick}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <MarketItems onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
