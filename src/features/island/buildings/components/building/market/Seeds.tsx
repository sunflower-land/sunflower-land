import React, { useContext, useState, useEffect } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";
import lightning from "assets/icons/lightning.png";
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
import { hasBoost } from "features/game/expansion/lib/boosts";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropTime } from "features/game/events/landExpansion/plant";
import { INITIAL_STOCK, PIXEL_SCALE } from "features/game/lib/constants";
import { makeBulkSeedBuyAmount } from "./lib/makeBulkSeedBuyAmount";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";
import { Bumpkin } from "features/game/types/game";
import { FRUIT_SEEDS } from "features/game/types/fruits";
import { Label } from "components/ui/Label";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

interface Props {
  onClose: () => void;
}

function isSeedLocked(bumpkin: Bumpkin | undefined, seedName: SeedName) {
  if (seedName in FRUIT_SEEDS()) {
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
  const [isTimeBoosted, setIsTimeBoosted] = useState(false);
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

  useEffect(
    () =>
      setIsTimeBoosted(
        hasBoost({
          item: selectedName,
          collectibles,
        })
      ),
    [inventory, selectedName, state.inventory]
  );

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

    if (stock?.equals(0)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          Sold out
        </Label>
      );
    }
    if (!stock?.equals(0) && max && inventory[selectedName]?.gt(max)) {
      return (
        <Label type="danger" className="-mt-2 mb-1">
          No space left
        </Label>
      );
    }
    return <Stock item={{ name: selectedName }} />;
  };

  const Action = () => {
    if (isSeedLocked(state.bumpkin, selectedName)) {
      return (
        <div className="flex items-center mt-2">
          <img src={heart} className="h-4 ml-0.5 mr-1" />
          <span
            className="bg-error border text-xs p-1 rounded-md"
            style={{ lineHeight: "12px", height: "23px" }}
          >
            Lvl {selected.bumpkinLevel ?? 0}
          </span>
          <img src={lock} className="h-4 ml-0.5 mr-2" />
        </div>
      );
    }

    if (stock?.equals(0)) {
      return (
        <div className="my-1">
          <p className="text-xxs text-center">
            Sync your farm to the Blockchain to restock
          </p>
          <Button className="text-xs mt-1" onClick={restock}>
            Sync
          </Button>
        </div>
      );
    }

    const max = INITIAL_STOCK[selectedName];

    if (max && inventory[selectedName]?.gt(max)) {
      return (
        <div className="my-1">
          <p className="text-xxs text-center">
            You have too many seeds on your basket!
          </p>
        </div>
      );
    }

    return (
      <>
        <Button
          disabled={lessFunds() || stock?.lessThan(1)}
          className="text-xs mt-1"
          onClick={() => buy(1)}
        >
          Buy 1
        </Button>
        {bulkSeedBuyAmount > 1 && (
          <Button
            disabled={lessFunds(bulkSeedBuyAmount)}
            className="text-xs mt-1"
            onClick={() => buy(bulkSeedBuyAmount)}
          >
            Buy {bulkSeedBuyAmount}
          </Button>
        )}
      </>
    );
  };

  const cropName = selectedName.split(" ")[0] as CropName;
  const crop = CROPS()[cropName];

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
      >
        {getKeys(SEEDS()).map((name: SeedName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            showOverlay={isSeedLocked(state.bumpkin, name)}
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
        <div className="flex flex-col justify-center items-center p-2 relative">
          {labelState()}
          <span className="text-center mb-1">{selectedName}</span>
          <img
            src={ITEM_DETAILS[selectedName].image}
            className="w-8 sm:w-12 img-highlight mt-1"
            alt={selectedName}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-center scale-75 sm:scale-100">
              <img src={timer} className="h-5 me-2" />
              {isTimeBoosted && <img src={lightning} className="h-6 me-2" />}
              <span className="text-xs text-center mt-2">
                {secondsToString(
                  getCropTime(
                    crop?.name,
                    inventory,
                    collectibles,
                    state.bumpkin as Bumpkin
                  ),
                  {
                    length: "medium",
                    removeTrailingZeros: true,
                  }
                )}
              </span>
            </div>
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-center mt-2", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`${price}`}
              </span>
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
