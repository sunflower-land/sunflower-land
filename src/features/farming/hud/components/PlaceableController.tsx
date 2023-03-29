import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const child = gameService.state.children.editing as MachineInterpreter;

  const [
    {
      context: { collisionDetected, id: placeableId, action },
    },
    send,
  ] = useActor(child);

  const itemSelected = child.state.matches("placeableSelected");

  const handleConfirmPlacement = () => {
    // prevents multiple toasts while spam clicking place button
    if (!itemSelected) {
      return;
    }

    if (placeableId) {
      send("MOVE");
    } else {
      send("PLACE");
    }
  };

  const handleRemoveItem = () => {
    send("REMOVE", {
      action:
        action === "building.moved"
          ? "building.removed"
          : "collectible.removed",
    });
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
              src={SUNNYSIDE.icons.cancel}
              alt="cancel"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </Button>
          <Button
            disabled={!itemSelected || collisionDetected}
            onClick={handleConfirmPlacement}
          >
            <img
              src={SUNNYSIDE.icons.confirm}
              alt="confirm"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            />
          </Button>
          <Button
            disabled={child.state.matches("idle")}
            onClick={handleRemoveItem}
          >
            <img
              src={SUNNYSIDE.icons.hammer}
              alt="remove"
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
