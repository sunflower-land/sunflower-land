import React, { useContext, useState } from "react";

import { Context } from "features/game/GoblinProvider";

import { TraderModal } from "./TraderModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import goblinBalloon from "assets/npcs/goblin_balloon.png";
import icon from "assets/brand/icon.png";

export const Trader: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const openTrader = () => {
    goblinService.send("OPEN_TRADING_POST");
    setShowModal(true);
  };

  return (
    <>
      <div
        className="absolute animate-float cursor-pointer hover:img-highlight"
        style={{
          width: `${GRID_WIDTH_PX * 2.9}px`,
          left: `${GRID_WIDTH_PX * 29.4}px`,
          top: `${GRID_WIDTH_PX * 13.4}px`,
        }}
      >
        <img
          src={goblinBalloon}
          alt="goblin trader"
          className="w-full"
          onClick={openTrader}
        />
        {
          <Action
            className="absolute -bottom-[40px] left-[13px]"
            text="Trade"
            icon={icon}
            onClick={openTrader}
          />
        }
      </div>

      {showModal && (
        <TraderModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
