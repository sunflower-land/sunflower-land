import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  id?: string;
  onClose: () => void;
}

export const RemoveChickenModal: React.FC<Props> = ({ id, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const {
    context: {
      state: { inventory },
    },
  } = gameState;

  const hasRustyShovel = inventory["Rusty Shovel"]?.gt(0);

  const handleRemove = () => {
    gameService.send("chicken.removed", {
      id,
    });

    onClose();
  };

  const AddedInfo = () => {
    if (!hasRustyShovel) {
      return (
        <p>
          {`It doesn't look like you have any of these shovels in your inventory.`}
        </p>
      );
    }

    return (
      <>
        <p className="mb-3">
          After removing this chicken any egg that may have been brewing will be
          lost.
        </p>
        <p>
          You will be able to place it again at any time by going back to the
          Hen House.
        </p>
      </>
    );
  };

  return (
    <CloseButtonPanel showCloseButton={false} title="Remove this chicken?">
      <div className="flex flex-col items-center">
        <img
          src={ITEM_DETAILS["Rusty Shovel"].image}
          alt="Rusty Shovel"
          className="mb-2"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
          }}
        />
        <div className="p-1 mb-3 text-xs sm:text-sm">
          <p className="mb-3">
            {`You have the rusty shovel selected which allows you to remove placeable items from your land.`}
          </p>
          {AddedInfo()}
        </div>
        <div className="flex space-x-2 w-full">
          <Button className="text-xs sm:text-sm w-full" onClick={onClose}>
            Close
          </Button>
          {hasRustyShovel && (
            <Button
              className="text-xs sm:text-sm w-full"
              onClick={handleRemove}
            >
              Remove it!
            </Button>
          )}
        </div>
      </div>
    </CloseButtonPanel>
  );
};
