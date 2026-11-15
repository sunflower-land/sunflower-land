import React, { useState } from "react";

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
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useLocalStorage } from "lib/utils/hooks/useLocalStorage";

type Recipe = { seed: FlowerSeedName; crossbreed: FlowerCrossBreedName };

// The last recipe picked on the Recipes tab, kept so every flower bed opens
// with it filled in and players can replant a row of beds quickly.
const LAST_RECIPE_KEY = "flowerBedLastRecipe";

const isValidRecipe = (recipe: Recipe | null): recipe is Recipe =>
  !!recipe &&
  recipe.seed in FLOWER_SEEDS &&
  recipe.crossbreed in (FLOWER_CROSS_BREED_AMOUNTS[recipe.seed] ?? {});

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedModal: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useAppTranslation();
  type Tab = "plant" | "recipes" | "guide";
  const [tab, setTab] = useState<Tab>("plant");
  const [stored, setRecipe] = useLocalStorage<Recipe | null>(
    LAST_RECIPE_KEY,
    null,
  );
  const recipe = isValidRecipe(stored) ? stored : undefined;

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
            setTab("plant");
          }}
        />
      )}

      {tab === "guide" && <FlowerBedGuide onClose={() => setTab("plant")} />}
    </CloseButtonPanel>
  );
};
