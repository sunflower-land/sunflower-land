import React, { useContext, useRef, useState } from "react";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getCurrentBiome,
  LAND_BIOMES,
  LandBiomeName,
} from "features/island/biomes/biomes";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/decorations";
import Decimal from "decimal.js-light";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Biomes: React.FC<{
  state: GameState;
}> = ({ state }) => {
  const { t } = useAppTranslation();
  const divRef = useRef<HTMLDivElement>(null);
  const [selectedBiome, setSelectedBiome] =
    useState<LandBiomeName>("Basic Biome");
  const { gameService } = useContext(Context);
  const applyBiome = () => {
    gameService.send({
      type: "biome.applied",
      biome: selectedBiome,
    });
  };
  const currentBiome = getCurrentBiome(state.island);
  const isBiomeAvailable = hasRequiredIslandExpansion(
    state.island.type,
    LAND_BIOMES[selectedBiome].requires,
  );
  const hasBiome = state.inventory[selectedBiome]?.gt(0);
  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent
      wideModal
      content={
        <Content
          state={state}
          selectedBiome={selectedBiome}
          setSelectedBiome={setSelectedBiome}
          divRef={divRef}
        />
      }
      panel={
        <InventoryItemDetails
          game={state}
          details={{ item: selectedBiome }}
          actionView={
            <Button
              disabled={
                !hasBiome ||
                !isBiomeAvailable ||
                (currentBiome === selectedBiome && !state.island.biome)
              }
              onClick={applyBiome}
            >
              {`${t(
                currentBiome === selectedBiome && !!state.island.biome
                  ? "remove"
                  : "apply",
              )}`}
            </Button>
          }
        />
      }
    />
  );
};

const Content: React.FC<{
  state: GameState;
  selectedBiome: LandBiomeName;
  setSelectedBiome: (biome: LandBiomeName) => void;
  divRef: React.RefObject<HTMLDivElement | null>;
}> = ({ state, selectedBiome, setSelectedBiome, divRef }) => {
  return (
    <div className="flex flex-col pl-2 mb-2 w-full">
      <Label
        type="default"
        className="my-1"
        icon={ITEM_DETAILS["Basic Biome"].image}
      >
        {`Biomes`}
      </Label>
      <div className="flex mb-2 flex-wrap -ml-1.5">
        {getKeys(LAND_BIOMES)
          .filter((item) => (state.inventory[item] ?? new Decimal(0)).gt(0))
          .map((item) => {
            return (
              <Box
                count={state.inventory[item]}
                isSelected={selectedBiome === item}
                key={item}
                onClick={() => setSelectedBiome(item as LandBiomeName)}
                image={ITEM_DETAILS[item].image}
                parentDivRef={divRef}
              />
            );
          })}
      </div>
    </div>
  );
};
