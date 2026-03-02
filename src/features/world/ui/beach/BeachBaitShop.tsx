import React, { useContext, useState } from "react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  PURCHASEABLE_BAIT,
  PurchaseableBait,
} from "features/game/types/fishing";
import { PurchaseType } from "features/game/types/buyOptionPurchaseItem";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { useSelector } from "@xstate/react";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";

export const BeachBaitShop: React.FC = () => {
  const { t } = useAppTranslation();

  const [selectedName, setSelectedName] =
    useState<PurchaseableBait>("Fishing Lure");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const inventory = state.inventory;

  const selectedItem = PURCHASEABLE_BAIT[selectedName];
  const purchaseOptions = selectedItem.purchaseOptions;
  const purchaseOption = purchaseType
    ? (purchaseOptions[purchaseType] ?? {})
    : {};
  const lessIngredients = (amount: number) => {
    if (!purchaseOption.ingredients) return true;

    return getObjectEntries(purchaseOption.ingredients).some(
      ([item, price]) => {
        const currentAmount =
          inventory[item as keyof typeof inventory] ?? new Decimal(0);
        const ingredientCost = new Decimal(price ?? 0).mul(amount);
        if (currentAmount.lessThan(ingredientCost)) return true;
        return false;
      },
    );
  };

  const craft = (amount: number) => {
    gameService.send({
      type: "optionPurchaseItem.bought",
      item: selectedName,
      purchaseType,
      amount,
    });

    const blockBucks = purchaseType
      ? (selectedItem.purchaseOptions[purchaseType]?.ingredients?.Gem ??
        new Decimal(0))
      : new Decimal(0);
    if (new Decimal(blockBucks).gt(0)) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: new Decimal(blockBucks).toNumber(),
        item: selectedName,
        type: "Consumable",
      });
    }
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
          }}
          requirements={{
            resources: purchaseOption.ingredients,
          }}
          actionView={
            purchaseType ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row sm:flex-col gap-1">
                  <Button
                    disabled={lessIngredients(1)}
                    onClick={() => craft(1)}
                  >
                    {`${t("craft")} 1`}
                  </Button>
                  <Button
                    disabled={lessIngredients(10)}
                    onClick={() => craft(10)}
                  >
                    {`${t("craft")} 10`}
                  </Button>
                </div>
                <Button onClick={() => setPurchaseType(undefined)}>
                  {t("back")}
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs mb-2 px-1 text-center">{`Choose your purchase option:`}</p>
                <div className="flex flex-row sm:flex-col gap-1">
                  {getKeys(purchaseOptions).map((type) => {
                    return (
                      <Button
                        key={type}
                        className="relative"
                        onClick={() => setPurchaseType(type)}
                      >
                        <div className="flex items-center">
                          <p>{type}</p>
                          <img
                            src={ITEM_DETAILS[type].image}
                            className="h-5 absolute right-1 top-1"
                          />
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </>
            )
          }
        />
      }
      content={
        <>
          {getKeys(PURCHASEABLE_BAIT).map((name) => {
            return (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ITEM_DETAILS[name].image}
                count={inventory[name]}
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
        </>
      }
    />
  );
};
