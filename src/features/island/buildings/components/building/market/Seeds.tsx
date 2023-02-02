import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import token from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { INITIAL_STOCK, PIXEL_SCALE } from "features/game/lib/constants";
import { makeBulkSeedBuyAmount } from "./lib/makeBulkSeedBuyAmount";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { Bumpkin } from "features/game/types/game";
import { FRUIT } from "features/game/types/fruits";
import { Delayed } from "features/island/buildings/components/building/market/Delayed";
import { getFruitHarvests } from "features/game/events/landExpansion/utils";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";

interface Props {
  onClose: () => void;
}

export const Seeds: React.FC<Props> = ({ onClose }) => {
  const [selectedName, setSelectedName] = useState<SeedName>("Sunflower Seed");

  const selected = SEEDS()[selectedName];
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const inventory = state.inventory;
  const collectibles = state.collectibles;

  const price = getBuyPrice(
    selectedName,
    selected,
    inventory,
    collectibles,
    state.bumpkin as Bumpkin
  );

  const buy = (amount = 1) => {
    gameService.send("seed.bought", {
      item: selectedName,
      amount,
    });

    if (price.greaterThan(0)) {
      setToast({
        icon: token,
        content: `-${price.mul(amount)}`,
      });
    }
    setToast({
      icon: ITEM_DETAILS[selectedName].image,
      content: `+${amount}`,
    });

    shortcutItem(selectedName);
  };

  const restock = () => {
    sync();
  };

  const sync = () => {
    gameService.send("SYNC", { captcha: "" });

    onClose();
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });

    onClose();
  };

  const lessFunds = (amount = 1) => {
    return state.balance.lessThan(price.mul(amount));
  };

  const stock = state.stock[selectedName] || new Decimal(0);
  const bulkSeedBuyAmount = makeBulkSeedBuyAmount(stock);

  if (showCaptcha) {
    return (
      <CloudFlareCaptcha
        action="seeds-sync"
        onDone={onCaptchaSolved}
        onExpire={() => setShowCaptcha(false)}
        onError={() => setShowCaptcha(false)}
      />
    );
  }

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
      return <Delayed restock={restock}></Delayed>;
    }

    // return message if inventory is full
    if (
      (inventory[selectedName] ?? new Decimal(0)).greaterThan(
        INITIAL_STOCK[selectedName] ?? new Decimal(0)
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
    if (yields in FRUIT()) return SEEDS()[selectedName].plantSeconds;

    return getCropTime(
      yields as CropName,
      inventory,
      collectibles,
      state.bumpkin as Bumpkin
    );
  };

  const getHarvestCount = () => {
    if (!(yields in FRUIT())) {
      return undefined;
    }

    return getFruitHarvests(state);
  };
  const harvestCount = getHarvestCount();

  return (
    <SplitScreenView
      header={
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
          {getKeys(SEEDS()).map((name: SeedName) => (
            <Box
              isSelected={selectedName === name}
              key={name}
              onClick={() => setSelectedName(name)}
              image={ITEM_DETAILS[name].image}
              showOverlay={isSeedLocked(name)}
              overlayIcon={
                <img
                  src={lock}
                  alt="locked"
                  className="relative object-contain"
                  style={{
                    width: `${PIXEL_SCALE * 12}px`,
                  }}
                />
              }
              count={inventory[name]}
            />
          ))}
        </>
      }
    />
  );
};
