import React from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { PlaceableName } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  name: PlaceableName;
  onClose: () => void;
  type: "building" | "collectible";
}

export const RemovePlaceableModal: React.FC<Props> = ({
  name,
  type,
  onClose,
}) => {
  const handleRemove = () => {
    console.log("remove collectible");
    onClose();
  };

  const AddedInfo = () => {
    if (type === "building") {
      return (
        <>
          <p>
            After removing this building you will be able to place it again at
            any time by going back to the buildings menu.
          </p>
        </>
      );
    }

    return (
      <>
        <p className="mb-3">
          Removing this collectible will send it back into your chest.
        </p>
        <p>
          All associated boosts will lose their effect until you place it again.
        </p>
      </>
    );
  };

  return (
    <Panel>
      <div className="flex flex-col items-center">
        <h2 className="text-sm sm:text-base text-center">{`Remove this ${type}?`}</h2>
        <img
          src={ITEM_DETAILS["Rusty Shovel"].image}
          alt="Rusty Shovel"
          className="w-10 my-2"
        />
        <div className="p-1 mb-3 text-xs sm:text-sm">
          <p className="mb-3">
            {`You have the rusty shovel selected which allows you to remove placeable items from your land.`}
          </p>
          {AddedInfo()}
        </div>
        <div className="flex space-x-2 w-full">
          <Button className="text-xs sm:text-sm w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="text-xs sm:text-sm w-full" onClick={handleRemove}>
            Dig it up!
          </Button>
        </div>
      </div>
    </Panel>
  );
};
