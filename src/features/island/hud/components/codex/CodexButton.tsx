import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import deliveryAlert from "assets/ui/delivery_alert.png";

import { Codex } from "./Codex";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";

const _hasNewDeliveries = (state: MachineState) =>
  hasNewOrders(state.context.state.delivery) &&
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 2;

export const CodexButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { gameService } = useContext(Context);
  const hasDeliveries = useSelector(gameService, _hasNewDeliveries);

  return (
    <div className="relative">
      <div
        className="relative flex cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(true);
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
          src={SUNNYSIDE.icons.search}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />

        {hasDeliveries && (
          <div
            className="absolute "
            style={{
              width: `${PIXEL_SCALE * 68}px`,
              left: `${PIXEL_SCALE * 18}px`,
              top: `${PIXEL_SCALE * -6}px`,
            }}
          >
            <img src={deliveryAlert} className="w-full" />
          </div>
        )}
      </div>

      <Codex show={isOpen} onHide={() => setIsOpen(false)} />
    </div>
  );
};
