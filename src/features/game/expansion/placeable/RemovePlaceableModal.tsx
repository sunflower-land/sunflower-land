import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { PlaceableName } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SquareIcon } from "components/ui/SquareIcon";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "features/game/types/game";
import {
  areUnsupportedChickensBrewing,
  removeUnsupportedCrops,
} from "features/game/events/landExpansion/removeBuilding";
import { removeItem } from "features/game/events/landExpansion/utils";

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

  const getCanRemove = () => {
    const stateCopy = cloneDeep(gameState.context.state) as GameState;

    if (name === "Hen House" || name === "Water Well") {
      const buildingGroup = stateCopy.buildings[name];
      if (!buildingGroup) {
        return false;
      }

      const buildingIndex = buildingGroup?.findIndex(
        (building) => building.id == placeableId
      );
      if (buildingIndex === -1) {
        return false;
      }

      stateCopy.buildings[name] = removeItem(
        buildingGroup,
        buildingGroup[buildingIndex]
      );

      if (name === "Hen House")
        return !areUnsupportedChickensBrewing(stateCopy);

      const { hasUnsupportedCrops } = removeUnsupportedCrops(stateCopy);
      return !hasUnsupportedCrops;
    }

    if (name === "Chicken Coop") {
      const collectibleGroup = stateCopy.collectibles[name];
      if (!collectibleGroup) {
        return false;
      }

      const buildingIndex = collectibleGroup?.findIndex(
        (collectible) => collectible.id == placeableId
      );
      if (buildingIndex === -1) {
        return false;
      }

      stateCopy.collectibles[name] = removeItem(
        collectibleGroup,
        collectibleGroup[buildingIndex]
      );
      return !areUnsupportedChickensBrewing(stateCopy);
    }

    return true;
  };
  const canRemove = getCanRemove();

  const AddedInfo = () => {
    if (!hasRustyShovel) {
      return (
        <p>
          {`It doesn't look like you have any of these shovels in your inventory.`}
        </p>
      );
    }

    if (!canRemove) {
      if (name === "Chicken Coop") {
        return (
          <p>
            Your Chicken Coop is currently supporting chickens that are
            currently brewing eggs. You will need to collect their eggs before
            you can remove the Chicken Coop.
          </p>
        );
      }
      if (name === "Hen House") {
        return (
          <p>
            Your Hen House is currently supporting chickens that are currently
            brewing eggs. You will need to collect their eggs before you can
            remove the Hen House.
          </p>
        );
      }
      if (name === "Water Well") {
        return (
          <p>
            Your Water Well is currently supporting crops that are currently
            growing. You will need to harvest your crops before you can remove
            the Water Well.
          </p>
        );
      }
      return <p>{`Your cannot remove this ${type} yet.`}</p>;
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
        </>
      );
    }

    return (
      <>
        <p className="mb-3">
          Removing this collectible will send it back into your chest.
        </p>
        {name === "Chicken Coop" ||
          (name === "Hen House" && (
            <p className="mb-3">
              This will reduce your chicken capacity so chickens may be removed
              and sent back to your inventory.
            </p>
          ))}
        <p>
          All associated boosts will lose their effect until you place it again.
        </p>
      </>
    );
  };

  return (
    <CloseButtonPanel showCloseButton={false} title={`Remove this ${name}?`}>
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 items-center justify-center mb-2">
          <SquareIcon icon={ITEM_DETAILS["Rusty Shovel"].image} width={14} />
          <SquareIcon icon={ITEM_DETAILS[name].image} width={28} />
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
              Dig it up!
            </Button>
          )}
        </div>
      </div>
    </CloseButtonPanel>
  );
};
