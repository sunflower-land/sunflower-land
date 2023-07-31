import React, { useState, useContext } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import deliveryBoard from "assets/ui/delivery_board_no_shadow.png";
import classNames from "classnames";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { MachineState } from "features/game/lib/gameMachine";
import { DeliveryModal } from "./DeliveryModal";

const _delivery = (state: MachineState) => state.context.state.delivery;

export const Deliveries: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const delivery = useSelector(gameService, _delivery);

  return (
    <div>
      <div
        id="deliveries"
        className="fixed flex z-50 justify-center cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log("click");
          setShowModal(true);
        }}
      >
        <img
          src={SUNNYSIDE.ui.round_button}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 10.5}px`,
            top: `${PIXEL_SCALE * 3.3}px`,
          }}
        >
          <img
            src={deliveryBoard}
            className={classNames("w-full cursor-pointer hover:img-highlight")}
          />
          {hasNewOrders(delivery) && (
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className="absolute top-2.5 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * 3}px`,
              }}
            />
          )}
        </div>
      </div>
      <DeliveryModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export const DeliveryButton = React.memo(Deliveries);
