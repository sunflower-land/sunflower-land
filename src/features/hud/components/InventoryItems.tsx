import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import close from "assets/icons/close.png";

interface Props {
  onClose: () => void;
}

export const InventoryItems: React.FC<Props> = ({ onClose }) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter((itemName) => !!inventory[itemName]);

  return (
    <Panel className="relative">
      <div className="flex justify-between sm:hidden">
        <span className="text-sm">Your Items</span>
        <img
          src={close}
          className="text-right h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      <div className="flex" id="inventory">
        <div className="w-3/5 flex flex-wrap  h-fit">
          {validItems.length === 0 && (
            <span className="text-white text-shadow">
              You have no items in your inventory.
            </span>
          )}
          {validItems.map((itemName) => (
            <Box
              count={inventory[itemName]}
              isSelected={selectedItem === itemName}
              key={itemName}
              onClick={() => shortcutItem(itemName)}
              image={ITEM_DETAILS[itemName].image}
            />
          ))}
        </div>
        <OuterPanel className="flex-1">
          {selectedItem && (
            <div className="flex flex-col justify-center items-center p-2">
              <span className="text-base text-center text-shadow">
                {selectedItem}
              </span>
              <img
                src={ITEM_DETAILS[selectedItem].image}
                className="h-12 w-12"
                alt={selectedItem}
              />
              <span className="text-xs text-shadow text-center mt-2">
                {ITEM_DETAILS[selectedItem].description}
              </span>
            </div>
          )}
        </OuterPanel>
      </div>
    </Panel>
  );
};
