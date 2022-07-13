import { useActor } from "@xstate/react";
import React, { useContext } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GoblinProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";

import { getDeliverableItems } from "../lib/storageItems";

export const StorageItems: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const resourceInventory = getDeliverableItems(
    goblinState.context.state.inventory
  );

  const items = Object.keys(resourceInventory) as InventoryItemName[];

  return (
    <>
      <div className="mt-3 lf">
        <div
          className="flex flex-wrap h-fit -ml-1.5 mb-2"
          style={{ minHeight: "150px" }}
        >
          {items.map((itemName) => {
            const details = ITEM_DETAILS[itemName];

            const totalCountOfItemType =
              resourceInventory[itemName] || new Decimal(0);

            return (
              <Box
                count={totalCountOfItemType}
                key={itemName}
                image={details.image}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
