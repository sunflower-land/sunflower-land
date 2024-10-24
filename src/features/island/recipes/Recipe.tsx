import React, { useContext, useState } from "react";
import page from "assets/decorations/page.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { RecipeItemName, RECIPES } from "features/game/lib/crafting";
import { Button } from "components/ui/Button";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";

const _recipes = (state: MachineState) =>
  state.context.state.craftingBox.recipes;

const getRecipeImage = (recipe: RecipeItemName) => {
  const recipeDetails = RECIPES[recipe];

  if (!recipeDetails) return "";

  return recipeDetails.type === "collectible"
    ? ITEM_DETAILS[recipeDetails.name].image
    : getImageUrl(ITEM_IDS[recipeDetails.name]);
};

const getRecipeDescription = (recipe: RecipeItemName) => {
  const recipeDetails = RECIPES[recipe];

  if (!recipeDetails) return "";

  return recipeDetails.type === "collectible"
    ? ITEM_DETAILS[recipeDetails.name].description
    : "";
};

export const Recipe: React.FC<{ recipe: RecipeItemName }> = ({ recipe }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { gameService } = useContext(Context);
  const recipes = useSelector(gameService, _recipes);

  const recipeImage = getRecipeImage(recipe);
  const recipeDescription = getRecipeDescription(recipe);

  const { t } = useTranslation();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    gameService.send("recipe.discovered", { recipe });
    handleClose();
  };

  return (
    <>
      <img
        className="cursor-pointer animate-float hover:img-highlight "
        onClick={() => setIsModalOpen(true)}
        src={page}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      />

      <Modal show={isModalOpen} onHide={handleClose}>
        <Panel>
          <div className="flex flex-col justify-center items-center space-y-2">
            <div className="flex flex-col justify-center items-center">
              <Label type="warning" icon={page}>
                {t("craftingBox.newRecipeDiscovered")}
              </Label>
              <span className="text-sm mb-2">{recipe}</span>
              <img src={recipeImage} className="h-12 mb-2" />
              <span className="text-xs text-center mb-2">
                {recipeDescription}
              </span>
              <span className="text-xs text-center mb-2">
                {t("craftingBox.craftThisItem")}
              </span>
            </div>
          </div>
          <Button onClick={handleAccept}>{t("confirm")}</Button>
        </Panel>
      </Modal>
    </>
  );
};
