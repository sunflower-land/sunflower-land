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
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
import { FarmSprite } from "features/game/expansion/FarmSprite";

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

export const RecipeStack: React.FC<{ recipes: RecipeItemName[] }> = ({
  recipes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { gameService } = useContext(Context);

  const { t } = useTranslation();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    recipes.forEach((recipe) => {
      gameService.send("recipe.discovered", { recipe });
    });
    handleClose();
  };

  return (
    <>
      <FarmSprite
        image={page}
        width={PIXEL_SCALE * 16}
        onClick={() => setIsModalOpen(true)}
      />

      <Modal show={isModalOpen} onHide={handleClose}>
        <Panel>
          <div className="flex flex-wrap justify-center items-center space-y-2">
            {recipes.map((recipe) => {
              const recipeImage = getRecipeImage(recipe);
              const recipeDescription = getRecipeDescription(recipe);

              return (
                <div
                  className="flex flex-col justify-center items-center"
                  key={recipe}
                >
                  <Label type="warning" icon={page}>
                    {t("craftingBox.newRecipeDiscovered")}
                  </Label>
                  <span className="text-sm mb-2 mt-1">{recipe}</span>
                  <img src={recipeImage} className="h-12 mb-2" />
                  <span className="text-xs text-center mb-2">
                    {recipeDescription}
                  </span>
                  <span className="text-xs text-center mb-2">
                    {t("craftingBox.craftThisItem")}
                  </span>
                </div>
              );
            })}
          </div>
          <Button onClick={handleAccept}>{t("confirm")}</Button>
        </Panel>
      </Modal>
    </>
  );
};
