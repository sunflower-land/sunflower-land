import React, { useContext, useState } from "react";
import { InventoryItemName } from "features/game/types/game";
import { BaseInformation, mutants, MutantType } from "../types";
import Decimal from "decimal.js-light";
import { ResizableBar } from "components/ui/ProgressBar";
import { ItemCounts, getTotalMutantCounts } from "../utils";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CollectibleItemDetail } from "./CollectibleItemDetail";
import { SimpleBox } from "../SimpleBox";

const _inventory = (state: MachineState) => state.context.state.inventory;

export const Mutants: React.FC = () => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const [{ available, owned }] = useState<ItemCounts>(
    getTotalMutantCounts(mutants, inventory)
  );
  const [selected, setSelected] = useState<BaseInformation>();

  if (selected) {
    return (
      <CollectibleItemDetail
        onBack={() => setSelected(undefined)}
        item={selected}
      />
    );
  }

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

      {getKeys(mutants).map((mutantType) => {
        const type = mutantType as MutantType;

        return (
          <div key={`mutants-${type}-codex`}>
            <h3 className="ml-1.5 capitalize text-sm">{type}</h3>
            <div className="flex mb-2 flex-wrap overflow-y-auto scrollable">
              {getKeys(mutants[type]).map((name, index) => {
                const itemName = name as InventoryItemName;
                const itemCount = inventory[itemName] ?? new Decimal(0);

                return (
                  <SimpleBox
                    key={index}
                    image={ITEM_DETAILS[itemName].image}
                    hasItem={itemCount.gt(0)}
                    onClick={() => setSelected(mutants[type][name])}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
