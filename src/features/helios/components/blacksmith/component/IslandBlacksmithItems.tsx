import React, { useContext, useState } from "react";

import { Box } from "components/ui/Box";

import { Context, useGame } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";
import {
  HELIOS_BLACKSMITH_ITEMS,
  HeliosBlacksmithItem,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { gameAnalytics } from "lib/gameAnalytics";
import { getSeasonalTicket } from "features/game/types/seasons";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

const VALID_EQUIPMENT: HeliosBlacksmithItem[] = [
  "Basic Scarecrow",
  "Scary Mike",
  "Laurie the Chuckle Crow",
  "Immortal Pear",
  "Bale",
  "Stone Beetle",
  "Iron Beetle",
  "Gold Beetle",
  "Fairy Circle",
  "Macaw",
  "Squirrel",
  "Butterfly",
];

export const IslandBlacksmithItems: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedName, setSelectedName] =
    useState<HeliosBlacksmithItem>("Basic Scarecrow");
  const { gameService, shortcutItem } = useContext(Context);
  const { state } = useGame();

  const { inventory, coins } = state;

  const selectedItem = HELIOS_BLACKSMITH_ITEMS(state)[selectedName];
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const lessIngredients = () =>
    getKeys(selectedItem?.ingredients ?? {}).some((name) =>
      (selectedItem?.ingredients ?? {})[name]?.greaterThan(
        inventory[name] || 0,
      ),
    );

  const lessCoins = () => coins < (selectedItem?.coins ?? 0);

  const craft = () => {
    gameService.send("LANDSCAPE", {
      placeable: selectedName,
      action: "collectible.crafted",
      // Not used yet
      requirements: {
        sfl: new Decimal(0),
        ingredients: {},
      },
    });

    const count = state.inventory[selectedName]?.toNumber() ?? 1;
    gameAnalytics.trackMilestone({
      event: `Crafting:Collectible:${selectedName}${count}`,
    });

    if ((selectedItem?.ingredients ?? {})[getSeasonalTicket()]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount:
          (selectedItem?.ingredients ?? {})[getSeasonalTicket()]?.toNumber() ??
          1,
        item: selectedName,
        type: "Collectible",
      });
    }

    shortcutItem(selectedName);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
            from: selectedItem?.from,
            to: selectedItem?.to,
          }}
          boost={COLLECTIBLE_BUFF_LABELS(state)[selectedName]}
          requirements={{
            resources: selectedItem?.ingredients ?? {},
            coins: selectedItem?.coins ?? 0,
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-1 font-secondary">
                {t("alr.crafted")}
              </p>
            ) : (
              <Button
                disabled={lessIngredients() || lessCoins()}
                onClick={craft}
              >
                {t("craft")}
              </Button>
            )
          }
        />
      }
      content={
        <div className="flex flex-col">
          <div className="flex flex-wrap">
            {VALID_EQUIPMENT.map((name: HeliosBlacksmithItem) => {
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
          </div>
        </div>
      }
    />
  );
};
