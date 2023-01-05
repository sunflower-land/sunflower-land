import React, { useContext, useState } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";
import heart from "assets/icons/level_up.png";
import lock from "assets/skills/lock.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { secondsToString } from "lib/utils/time";

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
import { Bumpkin, Inventory } from "features/game/types/game";
import { FRUIT, FRUIT_SEEDS } from "features/game/types/fruits";
import { Label } from "components/ui/Label";
import { Delayed } from "features/island/buildings/components/building/market/Delayed";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
}

function isSeedLocked(
  inventory: Inventory,
  bumpkin: Bumpkin | undefined,
  seedName: SeedName
) {
  if (seedName in FRUIT_SEEDS() && !hasFeatureAccess(inventory, "FRUIT")) {
    return true;
  }

  const seed = SEEDS()[seedName];
  return getBumpkinLevel(bumpkin?.experience ?? 0) < seed.bumpkinLevel;
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
    if (isSeedLocked(inventory, state.bumpkin, selectedName)) {
      return (
        <div className="flex items-center justify-center mt-2">
          <img src={heart} className="h-4 mr-1" />
          <span
            className="bg-error border text-xs p-1 rounded-md"
            style={{ lineHeight: "12px", height: "23px" }}
          >
            Lvl {selected.bumpkinLevel ?? 0}
          </span>
          <img src={lock} className="h-4 ml-1" />
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

  const getPlantSeconds = () => {
    const yields = SEEDS()[selectedName].yield;

    if (yields in FRUIT())
      return secondsToString(SEEDS()[selectedName].plantSeconds, {
        length: "medium",
        removeTrailingZeros: true,
      });

    if (yields in CROPS())
      return secondsToString(
        getCropTime(
          yields as CropName,
          inventory,
          collectibles,
          state.bumpkin as Bumpkin
        ),
        {
          length: "medium",
          removeTrailingZeros: true,
        }
      );
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div className="w-full max-h-48 sm:max-h-96 sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap">
        {getKeys(SEEDS()).map((name: SeedName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            showOverlay={isSeedLocked(inventory, state.bumpkin, name)}
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
          <div className="flex space-x-2 items-center mt-1 sm:flex-col-reverse md:space-x-0">
            <img
              src={ITEM_DETAILS[selectedName].image}
              className="w-5 sm:w-8 sm:my-1"
              alt={selectedName}
            />
            <span className="text-center mb-1">{selectedName}</span>
          </div>
          <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col sm:space-y-2 sm:items-center">
            {getPlantSeconds() && (
              <div className="flex space-x-1 items-center sm:justify-center">
                <img src={timer} className="h-4 sm:h-5" />
                <span className="text-xs text-center">{getPlantSeconds()}</span>
              </div>
            )}
            <div className="flex space-x-1 justify-center items-center">
              <img src={token} className="h-4 sm:h-5" />
              <span
                className={classNames("text-xs text-center", {
                  "text-red-500": lessFunds(),
                })}
              >
                {price.equals(0) ? `Free` : `${price}`}
              </span>
            </div>
          </div>
        </div>
        {Action()}
      </OuterPanel>
    </div>
  );
};
