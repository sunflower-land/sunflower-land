import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SquareIcon } from "components/ui/SquareIcon";

interface Props {
  id?: string;
  canRemove: boolean;
  onClose: () => void;
}

export const RemoveChickenModal: React.FC<Props> = ({
  id,
  canRemove,
  onClose,
}) => {
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

    if (!canRemove) {
      return (
        <p>
          Your chicken is currently brewing an egg. You will need to collect the
          egg before you can remove this chicken.
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
    <CloseButtonPanel showCloseButton={false} title="Remove this Chicken?">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 items-center justify-center mb-2">
          <SquareIcon icon={ITEM_DETAILS["Rusty Shovel"].image} width={14} />
          <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={28} />
        </div>
        <div className="p-1 mb-2 text-sm">
          <p className="mb-3">
            {`You have the rusty shovel selected which allows you to remove placeable items from your land.`}
          </p>
          {AddedInfo()}
        </div>
        <div className="flex space-x-1 w-full">
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
          {hasRustyShovel && canRemove && (
            <Button className="w-full" onClick={handleRemove}>
              Remove it!
            </Button>
          )}
        </div>
      </div>
    </CloseButtonPanel>
  );
};
