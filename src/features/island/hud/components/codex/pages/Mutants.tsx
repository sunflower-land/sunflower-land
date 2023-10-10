import React, { useContext, useState } from "react";
import { InventoryItemName } from "features/game/types/game";
import { mutants, MutantType } from "../types";
import { Box } from "components/ui/Box";
import { getKeys } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { ResizableBar } from "components/ui/ProgressBar";
import { ItemCounts, getTotalMutantCounts } from "../utils";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

const _inventory = (state: MachineState) => state.context.state.inventory;

export const Mutants: React.FC = () => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const [{ available, owned }] = useState<ItemCounts>(
    getTotalMutantCounts(mutants, inventory)
  );

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 ml-1.5 divide-brown-600">Mutants</h2>
      <div className="ml-1.5 mb-3 flex items-center">
        <ResizableBar
          percentage={(owned / available) * 100}
          type="progress"
          outerDimensions={{
            width: 70,
            height: 8,
          }}
        />
        <span className="text-sm ml-1">{`${owned}/${available}`}</span>
      </div>

      {getKeys(mutants).map((mutantType: MutantType) => (
        <div key={`mutants-${mutantType}-codex`}>
          <h3 className="ml-1.5 capitalize text-sm">{mutantType}</h3>
          <div className="flex mb-2 flex-wrap overflow-y-auto scrollable">
            {getKeys(mutants[mutantType]).map((name, index) => {
              const itemName = name as InventoryItemName;
              const { image } = mutants[mutantType][name];
              const itemCount = inventory[itemName] ?? new Decimal(0);

              return (
                <Box
                  key={index}
                  image={image}
                  count={itemCount}
                  disabled={itemCount.eq(0)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
