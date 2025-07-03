import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { LAND_BIOMES, LandBiomes } from "features/island/biomes/biomes";
import React, { useContext, useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Biomes: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<LandBiomes>(getKeys(LAND_BIOMES)[0]);

  const biome = LAND_BIOMES[selected];
  const { coins: coinPrice, ingredients } = biome;

  const lessFunds = () => {
    if (coinPrice) {
      return state.coins < coinPrice;
    }

    return false;
  };

  const lessIngredients = () =>
    getKeys(ingredients).some((name) =>
      ingredients[name]?.greaterThan(state.inventory[name] || 0),
    );

  return (
    <SplitScreenView
      content={
        <>
          {getKeys(LAND_BIOMES).map((biomeName) => {
            return (
              <Box
                isSelected={selected === biomeName}
                key={biomeName}
                onClick={() => setSelected(biomeName)}
                image={ITEM_DETAILS[biomeName].image}
              />
            );
          })}
        </>
      }
      panel={
        <CraftingRequirements
          gameState={state}
          details={{ item: selected }}
          requirements={{ resources: ingredients, coins: coinPrice }}
          actionView={
            <Button disabled={lessFunds() || lessIngredients()}>
              {t("buy")}
            </Button>
          }
        />
      }
    />
  );
};
