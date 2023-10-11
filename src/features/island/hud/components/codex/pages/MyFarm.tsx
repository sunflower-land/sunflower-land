import { useSelector } from "@xstate/react";
import { Requirements as ExpansionRequirements } from "components/ui/layouts/ExpansionRequirements";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Bumpkin } from "features/game/types/game";
import React, { useContext } from "react";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _bumpkin = (state: MachineState) =>
  state.context.state.bumpkin as Bumpkin;
const _expansionRequirements = (state: MachineState) =>
  state.context.state.expansionRequirements;

export const MyFarm: React.FC = () => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const collectibles = useSelector(gameService, _collectibles);
  const bumpkin = useSelector(gameService, _bumpkin);
  const expansionRequirements = useSelector(
    gameService,
    _expansionRequirements
  );

  const currentExpansion = Number(inventory["Basic Land"] ?? new Decimal(0));
  const noAvailableExpansions = expansionRequirements === undefined;

  console.log(expansionRequirements);

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 ml-1.5 divide-brown-600">My Farm</h2>
      <div className="p-1.5">
        <div className="text-xs space-y-2">
          <p>{`Current Expansion: ${currentExpansion} ${
            noAvailableExpansions ? "(max)" : ""
          }`}</p>
          {!noAvailableExpansions && (
            <>
              <p>Next Expansion Requirements:</p>
              <div className="flex flex-wrap gap-2 border-b border-brown-600 pb-2">
                <ExpansionRequirements
                  requirements={expansionRequirements}
                  inventory={inventory}
                  bumpkin={bumpkin}
                />
              </div>
            </>
          )}
        </div>
        {/* <div>
          <h4 className="text-sm">Resources</h4>
          <div className="flex flex-wrap gap-1 space-y-1">
            {getKeys(RESOURCES)
              .filter((name) => name !== "Boulder")
              .map((name) => (
                <div className="flex item-center" key={`resource-${name}`}>
                  <img
                    src={ITEM_DETAILS[name].image}
                    className="mr-1"
                    alt={name}
                  />
                  <p className="text-xs">
                    {Number(inventory[name] ?? new Decimal(0))}
                  </p>
                </div>
              ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};
