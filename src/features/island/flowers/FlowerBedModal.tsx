import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { FlowerBedGuide } from "./FlowerBedGuide";
import { FlowerBedContent } from "./FlowerBedContent";
import { FlowerBedRecipes } from "./FlowerBedRecipes";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWER_SEEDS,
  type FlowerCrossBreedName,
  type FlowerSeedName,
} from "features/game/types/flowers";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import type { Inventory, TemperateSeasonName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useLocalStorage } from "lib/utils/hooks/useLocalStorage";

type Recipe = { seed: FlowerSeedName; crossbreed: FlowerCrossBreedName };

// The last recipe picked on the Recipes tab, kept so every flower bed opens
// with it filled in and players can replant a row of beds quickly.
const LAST_RECIPE_KEY = "flowerBedLastRecipe";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _season = (state: MachineState) => state.context.state.season.season;

// Same check as an enabled row on the Recipes tab: a saved recipe only fills
// the bed when it can be planted now (in season, a seed, enough crossbreed).
const isPlantable = (
  recipe: Recipe | null,
  inventory: Inventory,
  season: TemperateSeasonName,
): recipe is Recipe => {
  if (!recipe || !(recipe.seed in FLOWER_SEEDS)) return false;

  const amount = FLOWER_CROSS_BREED_AMOUNTS[recipe.seed]?.[recipe.crossbreed];
  if (amount === undefined) return false;

  return (
    SEASONAL_SEEDS[season].includes(recipe.seed) &&
    !!inventory[recipe.seed]?.gte(1) &&
    !!inventory[recipe.crossbreed]?.gte(amount)
  );
};

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedModal: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useAppTranslation();
  type Tab = "plant" | "recipes" | "guide";
  const [tab, setTab] = useState<Tab>("plant");
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const season = useSelector(gameService, _season);
  const [stored, setStored] = useLocalStorage<Recipe | null>(
    LAST_RECIPE_KEY,
    null,
  );
  // Decided once when the bed opens, so the Plant tab doesn't reset while the
  // modal is open if inventory changes.
  const [recipe, setRecipe] = useState<Recipe | undefined>(() =>
    isPlantable(stored, inventory, season) ? stored : undefined,
  );

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["poppy"]}
      tabs={[
        { id: "plant", icon: SUNNYSIDE.icons.seedling, name: t("plant") },
        { id: "recipes", icon: SUNNYSIDE.icons.basket, name: t("recipes") },
        {
          id: "guide",
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === "plant" && (
        <FlowerBedContent
          // Remount when a recipe is picked so both slots start filled.
          key={recipe ? `${recipe.seed}-${recipe.crossbreed}` : "empty"}
          id={id}
          onClose={onClose}
          initialSeed={recipe?.seed}
          initialCrossbreed={recipe?.crossbreed}
        />
      )}

      {tab === "recipes" && (
        <FlowerBedRecipes
          onSelect={(seed, crossbreed) => {
            setRecipe({ seed, crossbreed });
            setStored({ seed, crossbreed });
            setTab("plant");
          }}
        />
      )}

      {tab === "guide" && <FlowerBedGuide onClose={() => setTab("plant")} />}
    </CloseButtonPanel>
  );
};
