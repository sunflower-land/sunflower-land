import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { LAND_BIOMES, LandBiomeName } from "features/island/biomes/biomes";
import React, { useContext, useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";

export const BuyBiomes: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<LandBiomeName>(
    getKeys(LAND_BIOMES)[0],
  );

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

  const buyBiome = () => gameService.send("biome.bought", { biome: selected });
  const biomeCount = state.inventory[selected] ?? new Decimal(0);
  const hasBoughtBiome = biomeCount.gt(0);

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
            <BiomesActionView
              lessFunds={lessFunds}
              lessIngredients={lessIngredients}
              buyBiome={buyBiome}
              hasBoughtBiome={hasBoughtBiome}
            />
          }
        />
      }
    />
  );
};

const BiomesActionView: React.FC<{
  lessFunds: () => boolean;
  lessIngredients: () => boolean;
  buyBiome: () => void;
  hasBoughtBiome: boolean;
}> = ({ lessFunds, lessIngredients, buyBiome, hasBoughtBiome }) => {
  const { t } = useAppTranslation();
  if (hasBoughtBiome) {
    return <Label type="danger">{t("biome.alreadyBought")}</Label>;
  }

  return (
    <Button disabled={lessFunds() || lessIngredients()} onClick={buyBiome}>
      {t("buy")}
    </Button>
  );
};
