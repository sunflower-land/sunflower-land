import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GoblinProvider";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

import { Box } from "components/ui/Box";

import { getDeliverableItems } from "../lib/storageItems";

export const TreasuryItems: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [inventory, setInventory] = useState<Inventory>({});

  useEffect(() => {
    // Only grab the deliverable items
    const resourceInventory = getDeliverableItems(goblinState.context.treasury);
    setInventory(resourceInventory);
  }, []);

  return (
    <>
      <div className="mt-3">
        <div className="flex flex-wrap h-fit -ml-1.5 mb-2">
          {Object.keys(inventory).map((itemName) => {
            const details = ITEM_DETAILS[itemName as InventoryItemName];

            const totalCountOfItemType =
              inventory[itemName as InventoryItemName] || new Decimal(0);

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

      <span className="text-xs mt-2">
        <span>Goblins keep their delivery cut here. View them also on </span>
        <a
          href="https://opensea.io/Goblin_Treasury"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Opensea
        </a>
      </span>
    </>
  );
};
