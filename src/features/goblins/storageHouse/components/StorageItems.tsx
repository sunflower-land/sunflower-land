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

  const treasuryInventory = getDeliverableItems(goblinState.context.treasury);

  const resourceItems = Object.keys(resourceInventory) as InventoryItemName[];
  const treasuryItems = Object.keys(treasuryInventory) as InventoryItemName[];

  return (
    <>
      <div className="mt-3 lf">
        <p className="mb-2 underline">Farm Storage</p>
        <div
          className="flex flex-wrap h-fit -ml-1.5 mb-2"
          style={{ minHeight: "150px" }}
        >
          {resourceItems.map((itemName) => {
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

        <p className="mb-2 underline">Goblin Community Treasury</p>
        <div
          className="flex flex-wrap h-fit -ml-1.5 mb-2"
          style={{ minHeight: "150px" }}
        >
          {treasuryItems.map((itemName) => {
            const details = ITEM_DETAILS[itemName];

            const totalCountOfItemType =
              treasuryInventory[itemName] || new Decimal(0);

            return (
              <Box
                count={totalCountOfItemType}
                key={itemName}
                image={details.image}
              />
            );
          })}
        </div>
        <div className="text-xs mb-2">
          <span>
            Goblins keep their delivery cut in the treasury. View them also on{" "}
          </span>
          <a
            href="https://opensea.io/Goblin_Treasury"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Opensea.
          </a>
        </div>
      </div>
    </>
  );
};
