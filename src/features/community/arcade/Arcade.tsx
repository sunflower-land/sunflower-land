import React from "react";

import { Action } from "components/ui/Action";
import { ArcadeModal } from "features/community/arcade/ArcadeModal";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import icon from "assets/brand/icon.png";

export const Arcade: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="relative"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 27}px`,
        top: `${GRID_WIDTH_PX * 28.5}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight relative">
        <Action
          className="absolute -bottom-[30px] -left-[5px]"
          text="Arcade"
          icon={icon}
          onClick={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <ArcadeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
