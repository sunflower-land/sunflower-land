import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import {
  TREASURE_COLLECTIBLE_ITEM,
  TreasureCollectibleItem,
} from "features/game/types/collectibles";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

export const TreasureShopCraft: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedName, setSelectedName] =
    useState<TreasureCollectibleItem>("Treasure Map");
  const selected = TREASURE_COLLECTIBLE_ITEM[selectedName];
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0),
    );
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const craft = () => {
    gameService.send("collectible.crafted", {
      name: selectedName,
    });

    const count = inventory[selectedName]?.toNumber() ?? 1;
    gameAnalytics.trackMilestone({
      event: `Crafting:Collectible:${selectedName}${count}`,
    });

    shortcutItem(selectedName);
  };

  const TreasureCraftables = getKeys(TREASURE_COLLECTIBLE_ITEM);

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
          }}
          boost={selected.boost}
          requirements={{
            resources: selected.ingredients,
            coins: selected.coins,
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-1 font-secondary">
                {t("alr.crafted")}
              </p>
            ) : (
              <Button disabled={lessIngredients()} onClick={craft}>
                {t("craft")}
              </Button>
            )
          }
        />
      }
      content={
        <div className="flex flex-col">
          <div className="flex flex-wrap">
            {TreasureCraftables.map((name: TreasureCollectibleItem) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  count={inventory[name]}
                  image={ITEM_DETAILS[name].image}
                />
              );
            })}
          </div>
        </div>
      }
    />
  );
};
