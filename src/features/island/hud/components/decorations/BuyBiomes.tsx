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
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { IslandType } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";

export const BuyBiomes: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<LandBiomeName>(
    getKeys(LAND_BIOMES)[0],
  );
  const [showApplyInstructions, setShowApplyInstructions] = useState(false);

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
    gameService.send("biome.bought", { biome: selected });
    setShowApplyInstructions(true);
  };
  const biomeCount = state.inventory[selected] ?? new Decimal(0);
  const hasBoughtBiome = biomeCount.gt(0);
  const hasRequiredIslandExpansionMet = hasRequiredIslandExpansion(
    state.island.type,
    biome.requires,
  );

  return (
    <>
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
                hasRequiredIslandExpansionMet={hasRequiredIslandExpansionMet}
                requiredIslandExpansion={biome.requires}
              />
            }
          />
        }
      />
      <ApplyInstructions
        show={showApplyInstructions}
        onClose={() => setShowApplyInstructions(false)}
        biome={selected}
      />
    </>
  );
};

const BiomesActionView: React.FC<{
  lessFunds: () => boolean;
  lessIngredients: () => boolean;
  buyBiome: () => void;
  hasBoughtBiome: boolean;
  hasRequiredIslandExpansionMet: boolean;
  requiredIslandExpansion?: IslandType;
}> = ({
  lessFunds,
  lessIngredients,
  buyBiome,
  hasBoughtBiome,
  hasRequiredIslandExpansionMet,
  requiredIslandExpansion,
}) => {
  const { t } = useAppTranslation();
  if (hasBoughtBiome) {
    return <Label type="danger">{t("biome.alreadyBought")}</Label>;
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

const ApplyInstructions: React.FC<{
  show: boolean;
  onClose: () => void;
  biome: LandBiomeName;
}> = ({ show, onClose, biome }) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={show}>
      <Panel>
        <div className="flex flex-col items-center justify-center m-1 gap-1">
          <img src={ITEM_DETAILS[biome].image} className="w-12 h-12" />
          <p className="m-1">{t("biome.applyInstructions")}</p>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </Panel>
    </Modal>
  );
};
