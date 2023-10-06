import React, { useState, useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import world from "assets/icons/world.png";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { MachineState } from "features/game/lib/gameMachine";
import { TravelModal } from "./TravelModal";

const _delivery = (state: MachineState) => state.context.state.delivery;

export const Travel: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const delivery = useSelector(gameService, _delivery);

  return (
    <>
      <div>
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
        {hasNewOrders(delivery) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute z-50 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `${PIXEL_SCALE * 1}px`,
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
