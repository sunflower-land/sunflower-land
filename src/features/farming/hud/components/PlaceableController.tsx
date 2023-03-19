import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import token from "assets/icons/token_2.png";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

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
        <div className="flex justify-center pb-1">
          {child.state.context?.requirements.sfl && (
            <div className="flex">
              <img src={token} className="h-6 mr-1" />
              <span className="text-sm">
                {child.state.context?.requirements.sfl.toNumber()}
              </span>
            </div>
          )}
          {child.state.context?.requirements.ingredients &&
            getKeys(child.state.context?.requirements.ingredients).map(
              (name) => (
                <div className="flex ml-3">
                  <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
                  <span className="text-sm">
                    {child.state.context?.requirements.ingredients[
                      name
                    ]?.toNumber()}
                  </span>
                </div>
              )
            )}
        </div>
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
          <Button disabled={collisionDetected} onClick={handleConfirmPlacement}>
            <img
              src={SUNNYSIDE.icons.confirm}
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
