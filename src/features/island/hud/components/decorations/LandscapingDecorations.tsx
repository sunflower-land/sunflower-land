import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import {
  LandscapingDecorationName,
  LANDSCAPING_DECORATIONS,
  getKeys,
} from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { ITEM_ICONS } from "../inventory/Chest";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { getCurrentBiome } from "features/island/biomes/biomes";

interface Props {
  onClose: () => void;
}

export const LandscapingDecorations: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [selectedName, setSelectedName] = useState<LandscapingDecorationName>(
    getKeys(LANDSCAPING_DECORATIONS)[0],
  );

  const selected = LANDSCAPING_DECORATIONS[selectedName];

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const coins = useSelector(gameService, (state) => state.context.state.coins);
  const islandType = useSelector(
    gameService,
    (state) => state.context.state.island.type,
  );
  const season = useSelector(
    gameService,
    (state) => state.context.state.season.season,
  );

  const price = selected.coins ?? 0;

  const landscapingMachine = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const buy = () => {
    landscapingMachine.send("SELECT", {
      action: "decoration.bought",
      placeable: selected.name,
      requirements: { coins: price, ingredients: selected.ingredients },
      multiple: true,
    });

    if (selected.ingredients["Gem"]) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: selected.ingredients["Gem"].toNumber() ?? 1,
        item: selected.name,
        type: "Collectible",
      });
    }

    onClose();
  };

  const lessFunds = () => {
    if (!price) return false;

    return coins < price;
  };

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0),
    );

  const biome = getCurrentBiome(state.island);

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{ item: selected.name }}
          requirements={{ resources: selected.ingredients, coins: price }}
          actionView={
            <Button disabled={lessFunds() || lessIngredients()} onClick={buy}>
              {t("buy")}
            </Button>
          }
        />
      }
      content={
        <>
          {getKeys(LANDSCAPING_DECORATIONS)
            .filter(
              (name) =>
                ![
                  "Crimson Cap",
                  "Toadstool Seat",
                  "Chestnut Fungi Stool",
                  "Mahogany Cap",
                  "Field Maple",
                  "Red Maple",
                  "Golden Maple",
                ].includes(name),
            )
            .map((name) => (
              <Box
                isSelected={selected.name === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={
                  ITEM_ICONS(state.season.season, biome)[name] ??
                  ITEM_DETAILS[name].image
                }
              />
            ))}
        </>
      }
    />
  );
};
