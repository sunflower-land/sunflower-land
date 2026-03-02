import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { GameState, Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterTicket } from "features/game/types/chapters";
import {
  STYLIST_WEARABLES,
  StylistWearable,
} from "features/game/types/stylist";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import React, { useState, useContext, useEffect } from "react";
import { getWearableImage } from "features/game/lib/getWearableImage";

function isNotReady(
  name: BumpkinItem,
  state: GameState,
): {
  isNotReady: boolean | undefined;
  hoursUntilReady?: number;
} {
  const wearable = STYLIST_WEARABLES[name] as StylistWearable;

  if (wearable.hoursPlayed) {
    const hoursPlayed = (Date.now() - state.createdAt) / 1000 / 60 / 60;
    const hoursUntilReady = wearable.hoursPlayed - hoursPlayed;

    if (hoursUntilReady > 0) {
      return { isNotReady: true, hoursUntilReady };
    }
  }

  return {
    isNotReady:
      wearable.from &&
      wearable.to &&
      (wearable.from.getTime() > Date.now() ||
        wearable.to.getTime() < Date.now()),
  };
}

export const WardrobeWearables: React.FC = () => {
  const [selected, setSelected] = useState<BumpkinItem>(
    getKeys(STYLIST_WEARABLES)[0],
  );
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { inventory, coins, wardrobe } = state;
  const [isTimeout, setTimeout] = useState(false);
  const now = useNow();
  const ticket = getChapterTicket(now);

  const wearable = STYLIST_WEARABLES[selected] as StylistWearable; // Add type assertion to StylistWearable

  const price = SFLDiscount(state, new Decimal(wearable.coins)).toNumber();

  const lessFunds = () => {
    if (!price) return false;

    return coins < price;
  };

  const lessIngredients = () =>
    getKeys(wearable.ingredients).some((name) =>
      (inventory[name] || new Decimal(0))?.lt(wearable.ingredients[name] ?? 0),
    );

  const buy = () => {
    gameService.send({ type: "wearable.bought", name: selected });

    if (wearable.ingredients["Gem"]) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: wearable.ingredients["Gem"].toNumber() ?? 1,
        item: selected,
        type: "Wearable",
      });
    }

    if (wearable.ingredients[ticket]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: wearable.ingredients[ticket]?.toNumber() ?? 1,
        item: selected,
        type: "Wearable",
      });
    }
    setTimeout(true);
  };

  // Set a 2 second timeout after buying to prevent double buying
  useEffect(() => {
    if (isTimeout) {
      const timer = window.setTimeout(() => {
        setTimeout(false);
      }, 2000);

      return () => window.clearTimeout(timer);
    }
  }, [isTimeout]);
  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            wearable: selected,
            from: wearable.from,
            to: wearable.to,
          }}
          // boost={selectedItem.boost}
          requirements={{
            resources: wearable.ingredients,
            coins: price,
          }}
          actionView={
            <BuyWearableAction
              wearable={wearable}
              inventory={inventory}
              state={state}
              selected={selected}
              handleBuy={buy}
              lessFunds={lessFunds}
              lessIngredients={lessIngredients}
              isTimeout={isTimeout}
            />
          }
        />
      }
      content={
        <>
          <div className="flex flex-wrap">
            {getKeys(STYLIST_WEARABLES).map((item) => {
              const timeLimited = isNotReady(item, state).isNotReady;
              const image = getWearableImage(item);

              return (
                <Box
                  isSelected={selected === item}
                  key={item}
                  onClick={() => setSelected(item)}
                  image={image}
                  count={new Decimal(wardrobe[item] ?? 0)}
                  showOverlay={timeLimited}
                  overlayIcon={
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      id="confirm"
                      alt="confirm"
                      className="object-contain absolute"
                      style={{
                        width: `${PIXEL_SCALE * 8}px`,
                        top: `${PIXEL_SCALE * -4}px`,
                        right: `${PIXEL_SCALE * -4}px`,
                      }}
                    />
                  }
                />
              );
            })}
          </div>
        </>
      }
    />
  );
};

const BuyWearableAction: React.FC<{
  wearable: StylistWearable;
  inventory: Inventory;
  state: GameState;
  selected: BumpkinItem;
  handleBuy: () => void;
  lessFunds: () => boolean;
  lessIngredients: () => boolean;
  isTimeout: boolean;
}> = ({
  wearable,
  inventory,
  state,
  selected,
  handleBuy,
  lessFunds,
  lessIngredients,
  isTimeout,
}) => {
  const { t } = useAppTranslation();
  if (wearable.requiresItem && !inventory[wearable.requiresItem]) {
    return (
      <div className="flex items-center justify-center">
        <img
          src={ITEM_DETAILS[wearable.requiresItem].image}
          className="h-6 mr-1 img-highlight"
        />
        <span className="text-center text-xs">
          {t("requires")}
          {wearable.requiresItem}
        </span>
      </div>
    );
  }

  const { hoursUntilReady } = isNotReady(selected, state);

  return (
    <>
      {hoursUntilReady && (
        <div className="flex items-start sm:items-center sm:justify-center mb-2">
          <Label type="warning" className="text-xs">
            {t("ready.in")}{" "}
            {secondsToString(hoursUntilReady * 60 * 60, {
              length: "short",
            })}
          </Label>
        </div>
      )}
      <Button
        disabled={
          isNotReady(selected, state).isNotReady ||
          lessFunds() ||
          lessIngredients() ||
          isTimeout
        }
        onClick={handleBuy}
      >
        {isTimeout ? `${t("bought")}!` : t("buy")}
      </Button>
    </>
  );
};
