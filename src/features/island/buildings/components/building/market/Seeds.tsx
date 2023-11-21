import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import lock from "assets/skills/lock.png";
import orange from "assets/resources/orange.png";
import token from "assets/icons/token_2.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { makeBulkBuyAmount } from "./lib/makeBulkBuyAmount";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { Bumpkin } from "features/game/types/game";
import { FRUIT, FRUIT_SEEDS, FruitSeedName } from "features/game/types/fruits";
import { Restock } from "features/island/buildings/components/building/market/Restock";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { getFruitTime } from "features/game/events/landExpansion/fruitPlanted";
import { hasFeatureAccess } from "lib/flags";
import { gameAnalytics } from "lib/gameAnalytics";
import { Label } from "components/ui/Label";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

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
  const { t } = useAppTranslation();

  const { inventory, collectibles } = state;

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
    const state = gameService.send("seed.bought", {
      item: selectedName,
      amount,
    });

    shortcutItem(selectedName);

    if (
      state.context.state.bumpkin?.activity?.["Sunflower Seed Bought"] === 1
    ) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerSeedBought:Completed",
      });
    }
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
        INVENTORY_LIMIT(state)[selectedName] ?? new Decimal(0)
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

    return getCropTime({
      crop: yields as CropName,
      inventory,
      collectibles,
      bumpkin: state.bumpkin as Bumpkin,
      buds: state.buds ?? {},
    });
  };

  const getHarvestCount = () => {
    if (!(yields in FRUIT())) return undefined;

    return getFruitHarvests(state);
  };

  const harvestCount = getHarvestCount();
  const seeds = getKeys(SEEDS())
    .filter((seed) => !SEEDS()[seed].disabled)
    .filter(
      (seed) => hasFeatureAccess(state, "BANANA") || seed !== "Banana Plant"
    );

  return (
    <SplitScreenView
      panel={
        <>
          <div className="hidden sm:block">
            <div>
              <p className="text-center mb-2">{selected.yield}</p>
              <div className="flex justify-center">
                <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
                  1 min
                </Label>
              </div>
              <div className="flex items-center justify-center mb-2">
                <img
                  src={ITEM_DETAILS[selectedName].image}
                  className="h-6 mr-1"
                />
                <img src={SUNNYSIDE.icons.chevron_right} className="h-3 mr-1" />
                <img
                  src={CROP_LIFECYCLE[selected.yield as CropName].seedling}
                  className="h-10 mr-1"
                />
                <img src={SUNNYSIDE.icons.chevron_right} className="h-3 mr-1" />
                <img
                  src={CROP_LIFECYCLE[selected.yield as CropName].crop}
                  className="h-10 mr-1"
                />
              </div>
            </div>
            <div className="flex justify-center items-center mt-2">
              <span className="text-xs mr-3">Buy</span>
              <Label type="warning" icon={token}>
                0.0625 SFL
              </Label>
            </div>
            <div className="flex items-center">
              <Box
                image={ITEM_DETAILS[selectedName].image}
                count={inventory[selectedName]}
              />
              <Button className="mr-1" onClick={() => buy(1)}>
                1
              </Button>
              <Button onClick={() => buy(10)}>10</Button>
            </div>
            <div className="flex justify-center items-center mt-2">
              <span className="text-xs mr-3">Sell</span>
              <Label type="warning" icon={token}>
                0.1225 SFL
              </Label>
            </div>
            <div className="flex items-center">
              <Box
                image={ITEM_DETAILS[selected.yield].image}
                count={inventory[selected.yield]}
              />
              <Button className="mr-1" onClick={() => buy(1)}>
                1
              </Button>
              <Button onClick={() => buy(10)}>10</Button>
            </div>
          </div>
          <div className="block sm:hidden p-1">
            <div className="flex justify-between">
              <div>
                <p className=" mb-2">{selected.yield}</p>
                <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
                  1 min
                </Label>
              </div>
              <div className="flex items-center justify-center mb-2">
                <img
                  src={ITEM_DETAILS[selectedName].image}
                  className="h-6 mr-1"
                />
                <img src={SUNNYSIDE.icons.chevron_right} className="h-3 mr-1" />
                <img
                  src={CROP_LIFECYCLE[selected.yield as CropName].seedling}
                  className="h-10 mr-1"
                />
                <img src={SUNNYSIDE.icons.chevron_right} className="h-3 mr-1" />
                <img
                  src={CROP_LIFECYCLE[selected.yield as CropName].crop}
                  className="h-10 mr-1"
                />
              </div>
            </div>
            <div className="flex mt-1">
              <div className="w-1/2">
                <div className="flex">
                  <img src={token} className="h-4 mr-1" />
                  <span className="text-xs">0.0625</span>
                </div>
                {/* <Label type="warning" icon={token}>
                  0.0625
                </Label> */}
                <div className="flex items-center">
                  <Box
                    image={ITEM_DETAILS[selectedName].image}
                    count={inventory[selectedName]}
                    className="-ml-2"
                  />
                  <Button className="mr-1" onClick={() => buy(1)}>
                    1
                  </Button>
                  <Button onClick={() => buy(10)}>10</Button>
                </div>
              </div>
              <div className="w-1/2">
                <Label type="warning" icon={token}>
                  0.1225
                </Label>
                <div className="flex items-center">
                  <Box
                    image={ITEM_DETAILS[selected.yield].image}
                    count={inventory[selected.yield]}
                  />
                  <Button className="mr-1" onClick={() => buy(1)}>
                    1
                  </Button>
                  <Button onClick={() => buy(10)}>10</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      content={
        <div className="pl-1">
          <Label
            icon={CROP_LIFECYCLE.Sunflower.crop}
            type="default"
            className="ml-1 mb-1"
          >
            {t("crops")}
          </Label>
          <div className="flex flex-wrap mb-2">
            {seeds
              .filter((name) => !(name in FRUIT_SEEDS()))
              .map((name: SeedName) => (
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
          </div>
          <Label icon={orange} type="default" className="ml-2 mb-1">
            {t("fruits")}
          </Label>
          <div className="flex flex-wrap mb-2">
            {seeds
              .filter((name) => name in FRUIT_SEEDS())
              .map((name: SeedName) => (
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
          </div>
        </div>
      }
    />
  );
};
