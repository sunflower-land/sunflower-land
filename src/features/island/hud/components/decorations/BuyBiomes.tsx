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
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { IslandType } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";
import { getObjectEntries } from "features/game/expansion/lib/utils";

export const BuyBiomes: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
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

  const buyBiome = () => {
    gameService.send({ type: "biome.bought", biome: selected });
    gameService.send({ type: "biome.applied", biome: selected });
    onClose();
  };
  const biomeCount = state.inventory[selected] ?? new Decimal(0);
  const hasBiomeOwned = biomeCount.gt(0);
  const hasRequiredIslandExpansionMet = hasRequiredIslandExpansion(
    state.island.type,
    biome.requires,
  );

  return (
    <>
      <SplitScreenView
        content={
          <>
            {getObjectEntries(LAND_BIOMES)
              .filter(([, biome]) => !biome.disabled)
              .map(([biomeName]) => {
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
                hasBiomeOwned={hasBiomeOwned}
                hasRequiredIslandExpansionMet={hasRequiredIslandExpansionMet}
                requiredIslandExpansion={biome.requires}
              />
            }
          />
        }
      />
    </>
  );
};

const BiomesActionView: React.FC<{
  lessFunds: () => boolean;
  lessIngredients: () => boolean;
  buyBiome: () => void;
  hasBiomeOwned: boolean;
  hasRequiredIslandExpansionMet: boolean;
  requiredIslandExpansion?: IslandType;
}> = ({
  lessFunds,
  lessIngredients,
  buyBiome,
  hasBiomeOwned,
  hasRequiredIslandExpansionMet,
  requiredIslandExpansion,
}) => {
  const { t } = useAppTranslation();
  if (hasBiomeOwned) {
    return <Label type="danger">{t("biome.alreadyOwn")}</Label>;
  }

  if (!hasRequiredIslandExpansionMet) {
    return (
      <Label type="danger">
        {t("biome.notInCorrectIslandType", {
          islandType: capitalize(requiredIslandExpansion ?? "Basic"),
        })}
      </Label>
    );
  }

  return (
    <Button disabled={lessFunds() || lessIngredients()} onClick={buyBiome}>
      {t("buy")}
    </Button>
  );
};
