import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import lock from "assets/skills/lock.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { makeBulkBuyAmount } from "./lib/makeBulkBuyAmount";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { Bumpkin } from "features/game/types/game";
import { FRUIT, FruitSeedName } from "features/game/types/fruits";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { getFruitTime } from "features/game/events/landExpansion/fruitPlanted";

interface Props {
  onClose: () => void;
}

export const Seeds: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] = useState<SeedName>("Sunflower Seed");

  const selected = SEEDS()[selectedName];
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { inventory, collectibles, buildings } = state;

  const price = getBuyPrice(
    selectedName,
    selected,
    inventory,
    collectibles,
    state.bumpkin as Bumpkin
  );

  const onSeedClick = (seedName: SeedName) => {
    setSelectedName(seedName);
    shortcutItem(seedName);
  };

  const buy = (amount = 1) => {
    gameService.send("seed.bought", {
      item: selectedName,
      amount,
    });

    shortcutItem(selectedName);
  };

  const lessFunds = (amount = 1) => {
    return state.balance.lessThan(price.mul(amount));
  };

  const stock = state.stock[selectedName] || new Decimal(0);
  const bulkSeedBuyAmount = makeBulkBuyAmount(stock);

  const isSeedLocked = (seedName: SeedName) => {
    const seed = SEEDS()[seedName];
    return getBumpkinLevel(state.bumpkin?.experience ?? 0) < seed.bumpkinLevel;
  };

  const Action = () => {
    // return nothing if requirement not met
    if (isSeedLocked(selectedName)) {
      return <></>;
    }

    // return delayed sync when no stock
    if (stock.lessThanOrEqualTo(0)) {
      return <Restock onClose={onClose} />;
    }

    // return message if inventory is full
    if (
      (inventory[selectedName] ?? new Decimal(0)).greaterThan(
        INITIAL_STOCK(state)[selectedName] ?? new Decimal(0)
      )
    ) {
      return (
        <p className="text-xxs text-center mb-1">
          You have too many seeds in your basket!
        </p>
      );
    }

    // return buy buttons otherwise
    return (
      <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
        <Button
          disabled={lessFunds() || stock.lessThan(1)}
          onClick={() => buy(1)}
        >
          Buy 1
        </Button>
        {bulkSeedBuyAmount > 1 && (
          <Button
            disabled={lessFunds(bulkSeedBuyAmount)}
            onClick={() => buy(bulkSeedBuyAmount)}
          >
            Buy {bulkSeedBuyAmount}
          </Button>
        )}
      </div>
    );
  };

  const yields = SEEDS()[selectedName].yield;

  const getPlantSeconds = () => {
    if (yields in FRUIT())
      return getFruitTime(selectedName as FruitSeedName, collectibles);

    return getCropTime(
      yields as CropName,
      inventory,
      collectibles,
      buildings,
      state.bumpkin as Bumpkin,
      state.buds ?? {}
    );
  };

  const getHarvestCount = () => {
    if (!(yields in FRUIT())) return undefined;

    return getFruitHarvests(state);
  };

  const harvestCount = getHarvestCount();
  const seeds = getKeys(SEEDS()).filter((seed) => !SEEDS()[seed].disabled);

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          stock={stock}
          details={{
            item: selectedName,
          }}
          requirements={{
            sfl: price,
            showSflIfFree: true,
            level: isSeedLocked(selectedName)
              ? selected.bumpkinLevel
              : undefined,
            harvests: harvestCount
              ? {
                  minHarvest: harvestCount[0],
                  maxHarvest: harvestCount[1],
                }
              : undefined,
            timeSeconds: getPlantSeconds(),
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          {seeds.map((name: SeedName) => (
            <Box
              isSelected={selectedName === name}
              key={name}
              onClick={() => onSeedClick(name)}
              image={ITEM_DETAILS[name].image}
              showOverlay={isSeedLocked(name)}
              secondaryImage={isSeedLocked(name) ? lock : undefined}
              count={inventory[name]}
            />
          ))}
        </>
      }
    />
  );
};
