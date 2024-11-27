import React, { useContext, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Recipe } from "features/game/lib/crafting";
import { useSelector } from "@xstate/react";
import { RecipeIngredient } from "features/game/lib/crafting";
import { useSound } from "lib/utils/hooks/useSound";
import { Context } from "features/game/GameProvider";
import { RecipesTab } from "./RecipesTab";
import { CraftTab } from "./CraftTab";
import { MachineState } from "features/game/lib/gameMachine";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { CraftingBoxGuide } from "./CraftingBoxGuide";

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

const _craftingItem = (state: MachineState) =>
  state.context.state.craftingBox.item;
const _craftingBoxRecipes = (state: MachineState) =>
  state.context.state.craftingBox.recipes;

interface Props {
  onClose: () => void;
}

export const CraftingBoxModalContent: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const [showIntro, setShowIntro] = React.useState(!hasReadIntro());
  const [currentTab, setCurrentTab] = useState(0);

  const { gameService } = useContext(Context);

  const craftingItem = useSelector(gameService, _craftingItem);
  const recipes = useSelector(gameService, _craftingBoxRecipes);

  // Determine the current recipe if any
  const itemName = craftingItem?.collectible ?? craftingItem?.wearable;
  const currentRecipe = itemName ? recipes[itemName] ?? null : null;
  const paddedIngredients = [
    ...(currentRecipe?.ingredients ?? []),
    ...Array(9).fill(null),
  ].slice(0, 9);

  const [selectedItems, setSelectedItems] =
    useState<(RecipeIngredient | null)[]>(paddedIngredients);

  const button = useSound("button");

  const handleSetupRecipe = (recipe: Recipe) => {
    const paddedIngredients = [
      ...recipe.ingredients,
      ...Array(9).fill(null),
    ].slice(0, 9);
    selectItems(paddedIngredients);
    setCurrentTab(0); // Switch to the craft tab
  };

  const selectItems = (items: (RecipeIngredient | null)[]) => {
    button.play();
    setSelectedItems(items);
  };

  if (showIntro) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.blacksmith}>
        <SpeakingText
          message={[
            {
              text: t("craftingBox.welcome.1"),
            },
            {
              text: t("craftingBox.welcome.2"),
            },
            {
              text: t("craftingBox.welcome.3"),
              actions: [
                {
                  text: t("craftingBox.startCrafting"),
                  cb: () => {
                    setCurrentTab(0);
                    acknowledgeIntroRead();
                    setShowIntro(false);
                  },
                },
                {
                  text: t("craftingBox.viewRecipes"),
                  cb: () => {
                    setCurrentTab(1);
                    acknowledgeIntroRead();
                    setShowIntro(false);
                  },
                },
              ],
            },
          ]}
          onClose={() => {
            acknowledgeRead();
          }}
        />
      </Panel>
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        { name: t("craft"), icon: SUNNYSIDE.icons.hammer },
        { name: t("recipes"), icon: SUNNYSIDE.icons.basket },
        { name: t("guide"), icon: SUNNYSIDE.icons.expression_confused },
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === 0 && (
        <CraftTab
          gameService={gameService}
          selectedItems={selectedItems}
          setSelectedItems={selectItems}
        />
      )}
      {currentTab === 1 && (
        <RecipesTab
          gameService={gameService}
          handleSetupRecipe={handleSetupRecipe}
        />
      )}
      {currentTab === 2 && (
        <CraftingBoxGuide onClose={() => setCurrentTab(0)} />
      )}
    </CloseButtonPanel>
  );
};
