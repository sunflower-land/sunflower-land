import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { FlowerBedGuide } from "./FlowerBedGuide";
import { FlowerBedContent } from "./FlowerBedContent";
import { FlowerBedRecipes } from "./FlowerBedRecipes";
import type {
  FlowerCrossBreedName,
  FlowerSeedName,
} from "features/game/types/flowers";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedModal: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useAppTranslation();
  type Tab = "plant" | "recipes" | "guide";
  const [tab, setTab] = useState<Tab>("plant");
  const [recipe, setRecipe] = useState<{
    seed: FlowerSeedName;
    crossbreed: FlowerCrossBreedName;
  }>();

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
