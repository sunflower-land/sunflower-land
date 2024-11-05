import React from "react";
import { Transition } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { RecipeIngredient } from "features/game/lib/crafting";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  show: boolean;
  ingredients: RecipeIngredient[];
  onClick: () => void;
}

export const IngredientsInfoPanel: React.FC<Props> = ({
  show,
  ingredients,
  onClick,
}) => {
  const { t } = useAppTranslation();

  if (!ingredients) return null;

  function organizedIngredients(ingredients: RecipeIngredient[]) {
    return ingredients.reduce(
      (acc, ingredient) => {
        if (ingredient.collectible) {
          if (!acc.collectibles.includes(ingredient.collectible)) {
            acc.collectibles.push(ingredient.collectible);
          }
        } else if (ingredient.wearable) {
          if (!acc.wearables.includes(ingredient.wearable)) {
            acc.wearables.push(ingredient.wearable);
          }
        }
        return acc;
      },
      {
        collectibles: [] as InventoryItemName[],
        wearables: [] as BumpkinItem[],
      },
    );
  }

  return (
    <Transition
      appear={true}
      id="ingredients-info-panel"
      show={show}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="flex top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 absolute z-40"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <InnerPanel className="drop-shadow-lg cursor-pointer max-w-md">
        <div className="flex flex-col mb-1">
          <div className="flex space-x-1 mb-1">
            <span className="text-xs whitespace-nowrap">
              {`${t("ingredients")}:`}
            </span>
          </div>
          <div className="space-y-1">
            {organizedIngredients(ingredients).collectibles.map(
              (ingredient) => (
                <div
                  key={String(ingredient)}
                  className="capitalize space-x-1 text-xs flex items-center"
                >
                  <img
                    src={ITEM_DETAILS[ingredient].image}
                    alt={ingredient}
                    className="w-3"
                  />
                  <span className="text-xs">{ingredient}</span>
                </div>
              ),
            )}
          </div>
          <div className="space-y-1">
            {organizedIngredients(ingredients).wearables.map((ingredient) => (
              <div
                key={String(ingredient)}
                className="capitalize space-x-1 text-xs flex items-center"
              >
                <img
                  src={SUNNYSIDE.icons.player_small}
                  alt={ingredient}
                  className="w-3"
                />
                <span className="text-xs">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      </InnerPanel>
    </Transition>
  );
};
