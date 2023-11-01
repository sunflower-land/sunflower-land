import React, { useState, useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import world from "assets/icons/world.png";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { MachineState } from "features/game/lib/gameMachine";
import { TravelModal } from "./TravelModal";
import { hasNewChores } from "features/helios/components/hayseedHank/lib/chores";

const _delivery = (state: MachineState) => state.context.state.delivery;
const _chores = (state: MachineState) => state.context.state.chores;

export const Travel: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const delivery = useSelector(gameService, _delivery);
  const chores = useSelector(gameService, _chores);

  const showExpression =
    hasNewOrders(delivery) || (chores && hasNewChores(chores));

  return (
    <>
      <div className="relative">
        <div
          id="deliveries"
          className="flex relative z-50 justify-center cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 23}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowModal(true);
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={world}
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 5}px`,
              top: `${PIXEL_SCALE * 4}px`,
            }}
            className="absolute"
          />
        </div>
        {showExpression && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute z-50 pointer-events-none animate-float"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `${PIXEL_SCALE * 0}px`,
              right: `${PIXEL_SCALE * 3}px`,
            }}
          />
        )}
      </div>
      <TravelModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export const TravelButton = React.memo(Travel);
