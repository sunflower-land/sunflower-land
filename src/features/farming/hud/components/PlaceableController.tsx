import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import confirm from "assets/icons/confirm.png";
import cancel from "assets/icons/cancel.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BUILDINGS } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import token from "src/assets/icons/token_2.png";
import { ANIMALS } from "features/game/types/craftables";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const { setToast } = useContext(ToastContext);
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

    if (gameService.state.event.type === "building.constructed") {
      const buildingName = gameService.state.event.name;
      const building = BUILDINGS()[buildingName];
      building.ingredients?.forEach((ingredient) => {
        const item = ITEM_DETAILS[ingredient.item];
        setToast({
          icon: item.image,
          content: `-${ingredient.amount}`,
        });
      });

      if (building.sfl.greaterThan(0)) {
        setToast({
          icon: token,
          content: `-${building.sfl}`,
        });
      }

      setToast({
        icon: ITEM_DETAILS[buildingName].image,
        content: "+1",
      });
    } else if (gameService.state.event.type === "chicken.bought") {
      setToast({
        icon: token,
        content: `-${ANIMALS().Chicken.tokenAmount}`,
      });
      setToast({
        icon: ITEM_DETAILS["Chicken"].image,
        content: "+1",
      });
    }
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