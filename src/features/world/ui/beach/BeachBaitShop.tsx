import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  PURCHASEABLE_BAIT,
  PurchaseableBait,
} from "features/game/types/fishing";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const BeachBaitShop: React.FC = () => {
  const { t } = useAppTranslation();

  const [selectedName, setSelectedName] =
    useState<PurchaseableBait>("Fishing Lure");
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const selectedItem = PURCHASEABLE_BAIT[selectedName];

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0),
    );

  const craft = () => {
    gameService.send("tool.crafted", {
      tool: selectedName,
    });

    const blockBucks = selectedItem.ingredients["Block Buck"]?.toNumber() ?? 0;
    if (blockBucks > 0) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: blockBucks,
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
            resources: selectedItem.ingredients,
          }}
          actionView={
            <Button disabled={lessIngredients()} onClick={craft}>
              {t("craft")}
            </Button>
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
