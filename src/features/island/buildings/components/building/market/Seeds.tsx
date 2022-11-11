import React, { useContext, useState, useEffect } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import token from "assets/icons/token_2.png";
import tokenStatic from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";
import lightning from "assets/icons/lightning.png";
import heart from "assets/icons/heart.png";
import lock from "assets/skills/lock.png";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { secondsToMidString } from "lib/utils/time";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { CropName, CROPS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Decimal } from "decimal.js-light";
import { Stock } from "components/ui/Stock";
import { hasBoost } from "features/game/expansion/lib/boosts";
import { getBuyPrice } from "features/game/events/landExpansion/seedBought";
import { getCropTime } from "features/game/events/plant";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { makeBulkSeedBuyAmount } from "./lib/makeBulkSeedBuyAmount";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { getBumpkinLevel } from "features/game/lib/level";
import { SeedName, SEEDS } from "features/game/types/seeds";

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
  const [isTimeBoosted, setIsTimeBoosted] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const inventory = state.inventory;
  const collectibles = state.collectibles;

  const price = getBuyPrice(selectedName, selected, inventory, collectibles);

  const buy = (amount = 1) => {
    gameService.send("seed.bought", {
      item: selectedName,
      amount,
    });

    setToast({
      icon: tokenStatic,
      content: `-$${price?.mul(amount).toString()}`,
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
  const Action = () => {
    const userBumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);
    const requiredLevel = selected.bumpkinLevel ?? 0;
    if (userBumpkinLevel < requiredLevel) {
      return (
        <div className="flex items-center mt-2">
          <img src={heart} className="h-4 ml-0.5 mr-1" />
          <span
            className="bg-error border text-xs p-1 rounded-md"
            style={{ lineHeight: "10px" }}
          >
            Lvl {requiredLevel}
          </span>
          <img src={lock} className="h-4 ml-0.5 mr-2" />
        </div>
      );
    }

    if (stock?.equals(0)) {
      return (
        <div>
          <p className="text-xxs no-wrap text-center my-1 underline">
            Sold out
          </p>
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
        <span className="text-xs mt-1 text-shadow text-center">
          No space left
        </span>
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
    <div className="flex">
      <div className="w-3/5 flex flex-wrap h-fit">
        {getKeys(SEEDS()).map((name: SeedName) => (
          <Box
            isSelected={selectedName === name}
            key={name}
            onClick={() => setSelectedName(name)}
            image={ITEM_DETAILS[name].image}
            count={inventory[name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/3">
        <div className="flex flex-col justify-center items-center p-2 relative">
          <Stock item={{ name: selectedName }} />
          <span className="text-shadow text-center">{selectedName}</span>
          <img
            src={ITEM_DETAILS[selectedName].image}
            className="w-8 sm:w-12 img-highlight mt-1"
            alt={selectedName}
          />
          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center items-center scale-75 sm:scale-100">
              <img src={timer} className="h-5 me-2" />
              {isTimeBoosted && <img src={lightning} className="h-6 me-2" />}
              <span className="text-xs text-shadow text-center mt-2">
                {secondsToMidString(getCropTime(crop?.name, inventory))}
              </span>
            </div>
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2", {
                  "text-red-500": lessFunds(),
                })}
              >
                {`$${price}`}
              </span>
            </div>
          </div>
          {Action()}
        </div>
      </OuterPanel>
    </div>
  );
};
