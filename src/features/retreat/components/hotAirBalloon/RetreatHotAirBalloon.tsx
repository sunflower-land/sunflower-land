import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Context as GameContext } from "features/game/GameProvider";
import { Context as GoblinContext } from "features/game/GoblinProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import goblinBalloon from "assets/npcs/goblin_balloon.png";
import icon from "assets/icons/sfl.webp";
import { useActor } from "@xstate/react";
import { TraderModal } from "features/goblins/trader/tradingPost/TraderModal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const RetreatHotAirBalloon: React.FC = () => {
  const { showAnimations } = useContext(GameContext);
  const { goblinService } = useContext(GoblinContext);
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
    <MapPlacement x={0} y={13} height={7} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openTrader}
      >
        <img
          src={goblinBalloon}
          alt="goblin trader"
          className={"absolute" + (showAnimations ? " animate-float" : "")}
          style={{
            width: `${PIXEL_SCALE * 51}px`,
            left: `${PIXEL_SCALE * 6}px`,
            bottom: `${PIXEL_SCALE * 23}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action className="pointer-events-none" text="Trade" icon={icon} />
        </div>
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
    </MapPlacement>
  );
};
