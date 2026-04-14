import React, { useContext, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Recipe } from "features/game/lib/crafting";
import { padRecipeIngredients } from "./craftingBoxUtils";
import { useSelector } from "@xstate/react";
import { RecipeIngredient } from "features/game/lib/crafting";
import { useSound } from "lib/utils/hooks/useSound";
import { Context } from "features/game/GameProvider";
import { RecipesTab } from "./RecipesTab";
import { CraftTab, CraftTabSelection } from "./CraftTab";
import { CraftingBoxIntro } from "./CraftingBoxIntro";
import { CraftingBoxGuide } from "./CraftingBoxGuide";
import { MachineState } from "features/game/lib/gameMachine";
import { getCraftingBoxCurrent } from "features/game/lib/craftingBox";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `crafting-box-read.${host}-${window.location.pathname}`;
const INTRO_LOCAL_STORAGE_KEY = `crafting-box-intro-read.${host}-${window.location.pathname}`;

function acknowledgeIntroRead() {
  localStorage.setItem(INTRO_LOCAL_STORAGE_KEY, new Date().toString());
}
function hasReadIntro() {
  return !!localStorage.getItem(INTRO_LOCAL_STORAGE_KEY);
}

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

const _craftingBox = (state: MachineState) => state.context.state.craftingBox;
const _craftingBoxRecipes = (state: MachineState) =>
  state.context.state.craftingBox.recipes;

interface Props {
  onClose: () => void;
}

export const CraftingBoxModalContent: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const [showIntro, setShowIntro] = React.useState(!hasReadIntro());
  type Tab = "craft" | "recipes" | "guide";
  const [currentTab, setCurrentTab] = useState<Tab>("craft");
  const [pendingQueueSlot, setPendingQueueSlot] = useState<number | null>(null);
  const [craftTabPersistedSelection, setCraftTabPersistedSelection] =
    useState<CraftTabSelection | null>(null);

  const { gameService } = useContext(Context);

  const switchTab: React.Dispatch<React.SetStateAction<Tab>> = (value) => {
    const nextTab = typeof value === "function" ? value(currentTab) : value;
    if (nextTab !== "craft") setPendingQueueSlot(null);
    setCurrentTab(value);
  };

  const craftingBox = useSelector(gameService, _craftingBox);
  const recipes = useSelector(gameService, _craftingBoxRecipes);
  const craftingItem = getCraftingBoxCurrent(craftingBox).item;

  // Determine the current recipe if any
  const itemName = craftingItem?.collectible;
  const currentRecipe = itemName ? (recipes[itemName] ?? null) : null;
  const paddedIngredients = padRecipeIngredients(currentRecipe);

  const [selectedItems, setSelectedItems] =
    useState<(RecipeIngredient | null)[]>(paddedIngredients);

  const button = useSound("button");

  const handleSetupRecipe = (recipe: Recipe, targetSlot?: number) => {
    selectItems(padRecipeIngredients(recipe));
    setPendingQueueSlot(targetSlot ?? null);
    switchTab("craft");
  };

  const selectItems = (items: (RecipeIngredient | null)[]) => {
    button.play();
    setSelectedItems(items);
  };

  if (showIntro) {
    return (
      <CraftingBoxIntro
        onStartCrafting={() => {
          switchTab("craft");
          acknowledgeIntroRead();
          setShowIntro(false);
        }}
        onViewRecipes={() => {
          switchTab("recipes");
          acknowledgeIntroRead();
          setShowIntro(false);
        }}
        onClose={acknowledgeRead}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        { id: "craft", name: t("craft"), icon: SUNNYSIDE.icons.hammer },
        { id: "recipes", name: t("recipes"), icon: SUNNYSIDE.icons.basket },
        {
          id: "guide",
          name: t("guide"),
          icon: SUNNYSIDE.icons.expression_confused,
        },
      ]}
      currentTab={currentTab}
      setCurrentTab={switchTab}
    >
      {currentTab === "craft" && (
        <CraftTab
          gameService={gameService}
          selectedItems={selectedItems}
          setSelectedItems={selectItems}
          onClose={onClose}
          initialSelection={
            pendingQueueSlot != null
              ? { preparingSlot: pendingQueueSlot }
              : craftTabPersistedSelection
          }
          onQueueSelectionChange={setCraftTabPersistedSelection}
        />
      )}
      {currentTab === "recipes" && (
        <RecipesTab handleSetupRecipe={handleSetupRecipe} />
      )}
      {currentTab === "guide" && (
        <CraftingBoxGuide onClose={() => switchTab("craft")} />
      )}
    </CloseButtonPanel>
  );
};
