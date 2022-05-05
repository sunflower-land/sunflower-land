import React from "react";

import goblin from "assets/npcs/goblin.gif";
import plant from "assets/icons/plant.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import { ItemsModal } from "./ItemsModal";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { shopAudio } from "lib/utils/sfx";

export const Market: React.FC = () => {
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
        width: `${GRID_WIDTH_PX * 0.9}px`,
        right: `${GRID_WIDTH_PX * 18.4}px`,
        top: `${GRID_WIDTH_PX * 13}px`,
      }}
    >
      <img
        src={goblin}
        alt="market"
        onClick={handleMarketClick}
        className="w-full"
      />
      <Action
        className="absolute -bottom-10 -left-8"
        text="Shop"
        icon={plant}
        onClick={handleMarketClick}
      />
      <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
