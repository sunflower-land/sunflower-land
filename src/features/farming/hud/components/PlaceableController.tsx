import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import confirm from "assets/icons/confirm.png";
import cancel from "assets/icons/cancel.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const child = gameService.state.children.editing as MachineInterpreter;

  const [
    {
      context: { collisionDetected },
    },
    send,
  ] = useActor(child);

  const handleConfirmPlacement = () => {
    // prevents multiple toasts while spam clicking place button
    if (!child.state.matches("idle")) {
      return;
    }

    send("PLACE");
  };

  const handleCancelPlacement = () => {
    send("CANCEL");
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2">
      <OuterPanel>
        <div
          className="flex items-stretch space-x-2 sm:h-12 w-80 sm:w-[400px]"
          style={{
            height: `${PIXEL_SCALE * 17}px`,
          }}
        >
          <Button onClick={handleCancelPlacement}>
            <img
              src={cancel}
              alt="cancel"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </Button>
          <Button disabled={collisionDetected} onClick={handleConfirmPlacement}>
            <img
              src={confirm}
              alt="confirm"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            />
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
