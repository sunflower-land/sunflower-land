import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { PlaceableName } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";

type PlaceableType = "building" | "collectible";

interface Props {
  name: PlaceableName;
  placeableId: string;
  onClose: () => void;
  type: PlaceableType;
}

export const RemovePlaceableModal: React.FC<Props> = ({
  name,
  type,
  placeableId,
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
    if (type === "building") {
      gameService.send("building.removed", {
        building: name,
        id: placeableId,
      });
    } else {
      gameService.send("collectible.removed", {
        collectible: name,
        id: placeableId,
      });
    }

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

    if (type === "building") {
      return (
        <>
          <p className="mb-3">
            After removing this building you will be able to place it again at
            any time by going back to the buildings menu.
          </p>
          <p>
            If any items placed on your land are dependent on this building they
            will also be sent back to your inventory.
          </p>
          {name === "Water Well" && (
            <p className="mt-3">
              Any crops planted on plots that were supported by this water well
              will be removed.
            </p>
          )}
        </>
      );
    }

    return (
      <>
        <p className="mb-3">
          Removing this collectible will send it back into your chest.
        </p>
        {name === "Chicken Coop" && (
          <p className="mb-3">
            This will reduce your chicken capacity so chickens may be removed
            and sent back to your inventory.
          </p>
        )}
        <p>
          All associated boosts will lose their effect until you place it again.
        </p>
      </>
    );
  };

  return (
    <CloseButtonPanel showCloseButton={false} title={`Remove this ${type}?`}>
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
              Dig it up!
            </Button>
          )}
        </div>
      </div>
    </CloseButtonPanel>
  );
};
