import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Context } from "features/game/GoblinProvider";

import { TraderModal } from "./TraderModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import goblinBalloon from "assets/npcs/goblin_balloon.png";
import icon from "assets/brand/icon.png";
import { useActor } from "@xstate/react";

export const Trader: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [showModal, setShowModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // Support deep-link to auto-open the trader
  useEffect(() => {
    if (!searchParams.has("viewListingsForLand")) return;
    if (!goblinState.matches("playing")) return;
    openTrader();
  }, [goblinState, searchParams]);

  const openTrader = () => {
    goblinService.send("OPEN_TRADING_POST");
    setShowModal(true);
  };

  const handleModalClose = () => {
    const modifiedParams = new URLSearchParams(searchParams);
    modifiedParams.delete("viewListingsForLand");
    setSearchParams(modifiedParams, { replace: true });
    setShowModal(false);
  };

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${GRID_WIDTH_PX * 2.9}px`,
          left: `${GRID_WIDTH_PX * 29.4}px`,
          top: `${GRID_WIDTH_PX * 13.4}px`,
        }}
      >
        <img
          src={goblinBalloon}
          alt="goblin trader"
          className="w-full animate-float"
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

      {goblinState.matches("trading") && (
        <TraderModal
          isOpen={showModal}
          initialTab={
            searchParams.has("viewListingsForLand") ? "buying" : "selling"
          }
          onClose={handleModalClose}
        />
      )}
    </>
  );
};
