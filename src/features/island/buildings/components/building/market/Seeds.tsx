import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import tokenStatic from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { CropName, CROPS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import { Stock } from "components/ui/Stock";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { INITIAL_STOCK, PIXEL_SCALE } from "features/game/lib/constants";
import { makeBulkSeedBuyAmount } from "./lib/makeBulkSeedBuyAmount";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { Bumpkin } from "features/game/types/game";
import { FRUIT } from "features/game/types/fruits";
import { Label } from "components/ui/Label";
import { Delayed } from "features/island/buildings/components/building/market/Delayed";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { RequirementLabel } from "components/ui/RequirementLabel";
import { SquareIcon } from "components/ui/SquareIcon";

interface Props {
  onClose: () => void;
}

const getRequiredLevel = (seed: SeedName) => {
  return SEEDS()[seed].bumpkinLevel;
};

const isSeedLocked = (currentLevel: number, seed: SeedName) => {
  return currentLevel < getRequiredLevel(seed);
};

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

  const currentLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);

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

    setToast({
      icon: tokenStatic,
      content: `-${price?.mul(amount).toString()}`,
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
    if (!price) return false;

    return state.balance.lessThan(price.mul(amount).toString());
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

  const labelState = () => {
    const max = INITIAL_STOCK[selectedName];
    const inventoryCount = inventory[selectedName] ?? new Decimal(0);
    const inventoryFull = max ? inventoryCount.gt(max) : true;

    if (stock?.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }
    return (
      <Stock item={{ name: selectedName }} inventoryFull={inventoryFull} />
    );
  };

  const Action = () => {
    if (isSeedLocked(currentLevel, selectedName)) {
      return (
        <div className="flex items-center justify-center my-1">
          <RequirementLabel
            className="mr-1"
            type="level"
            currentLevel={currentLevel}
            requirement={getRequiredLevel(selectedName)}
          />
          <SquareIcon icon={lock} width={7} />
        </div>
      );
    }

    if (stock?.equals(0)) {
      return <Delayed restock={restock}></Delayed>;
    }

    const max = INITIAL_STOCK[selectedName];

    if (max && inventory[selectedName]?.gt(max)) {
      return (
        <div className="my-1">
          <p className="text-xxs text-center">
            You have too many seeds in your basket!
          </p>
        </div>
      );
    }

    return (
      <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
        <Button
          disabled={lessFunds() || stock?.lessThan(1)}
          className="text-xxs sm:text-xs"
          onClick={() => buy(1)}
        >
          Buy 1
        </Button>
        {bulkSeedBuyAmount > 1 && (
          <Button
            disabled={lessFunds(bulkSeedBuyAmount)}
            className="text-xxs sm:text-xs"
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

    if (yields in CROPS())
      return getCropTime(
        yields as CropName,
        inventory,
        collectibles,
        state.bumpkin as Bumpkin
      );
  };
  const plantSeconds = getPlantSeconds();

  const getHarvestRequirements = () => {
    if (!(yields in FRUIT())) {
      return null;
    }

    if (isCollectibleBuilt("Immortal Pear", collectibles)) {
      return { min: 4, max: 6 };
    }

    return { min: 3, max: 5 };
  };
  const harvestRequirements = getHarvestRequirements();

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {getKeys(SEEDS()).map((name: SeedName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            showOverlay={isSeedLocked(currentLevel, name)}
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
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
          {labelState()}
          <div className="flex space-x-1 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <SquareIcon icon={ITEM_DETAILS[selectedName].image} width={14} />
            <span className="text-center mb-1">{selectedName}</span>
          </div>
          <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
            {plantSeconds && (
              <RequirementLabel type="time" waitSeconds={plantSeconds} />
            )}
            {harvestRequirements && (
              <RequirementLabel
                type="harvests"
                minHarvest={harvestRequirements.min}
                maxHarvest={harvestRequirements.max}
              />
            )}
            <RequirementLabel
              type="sfl"
              balance={state.balance}
              requirement={price}
            />
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
