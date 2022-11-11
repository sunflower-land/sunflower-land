import React from "react";
import { CollectibleName } from "features/game/types/craftables";
import { OuterPanel, Panel } from "components/ui/Panel";
import { ITEM_CARD_MIN_HEIGHT } from "features/island/hud/components/inventory/Basket";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";

interface Props {
  name: CollectibleName;
  onClose: () => void;
}

export const RemoveCollectibleModal: React.FC<Props> = ({ name, onClose }) => {
  const handleRemove = () => {
    console.log("remove collectible");
    onClose();
  };

  return (
    <Panel>
      <OuterPanel className="flex-1 mb-3">
        <div
          style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
          className="flex flex-col justify-evenly items-center p-2"
        >
          <span className="text-center text-shadow">{name}</span>
          <img src={ITEM_DETAILS[name].image} className="h-12" alt={name} />
          <span className="text-xs text-shadow text-center mt-2 w-80">
            {ITEM_DETAILS[name].description}
          </span>
        </div>
      </OuterPanel>
      <div className="p-1 mb-3 text-sm">
        <p className="mb-2">
          Removing this collectible from your land will send it back into your
          chest.
        </p>
        <p className="">
          All associated boosts will lose their effect until you place this item
          again.
        </p>
      </div>
      <div className="flex space-x-2">
        <Button className="text-xs sm:text-sm w-full" onClick={onClose}>
          Cancel
        </Button>
        <Button className="text-xs sm:text-sm w-full" onClick={handleRemove}>
          Dig it up!
        </Button>
      </div>
    </Panel>
  );
};
