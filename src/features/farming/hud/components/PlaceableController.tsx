import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import confirm from "assets/icons/confirm.png";
import cancel from "assets/icons/cancel.png";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const { inventory } = gameService.state.context.state;
  const child = gameService.state.children.editing as MachineInterpreter;

  const [
    {
      context: { collisionDetected, placeable },
    },
    send,
  ] = useActor(child);

  const handleConfirmPlacement = () => {
    if (inventory[placeable]) {
      send("PLACE");
    } else {
      send({ type: "PLACE", isConstruction: true });
    }
  };

  const handleCancelPlacement = () => {
    send("CANCEL");
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2">
      <OuterPanel>
        <div className="flex items-stretch space-x-2 h-9 sm:h-12 w-80 sm:w-[400px]">
          <Button onClick={handleCancelPlacement}>
            <img src={cancel} alt="cancel" className="h-full" />
          </Button>
          <Button disabled={collisionDetected} onClick={handleConfirmPlacement}>
            <img src={confirm} alt="confirm" className="h-full" />
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
