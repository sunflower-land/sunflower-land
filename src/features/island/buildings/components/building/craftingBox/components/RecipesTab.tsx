import React, { useState, useMemo } from "react";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { useTranslation } from "react-i18next";
import { TextInput } from "components/ui/TextInput";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { ButtonPanel } from "components/ui/Panel";
import classNames from "classnames";
import { SquareIcon } from "components/ui/SquareIcon";
import { Recipe, RecipeItemName, Recipes } from "features/game/lib/crafting";
import { InventoryItemName } from "features/game/types/game";

const _craftingBoxRecipes = (state: MachineState) =>
  state.context.state.craftingBox.recipes;

interface Props {
  gameService: MachineInterpreter;
  handleSetupRecipe: (recipe: Recipe) => void;
}

export const RecipesTab: React.FC<Props> = ({
  gameService,
  handleSetupRecipe,
}) => {
  const { t } = useTranslation();

  const recipes = useSelector(gameService, _craftingBoxRecipes);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;
    return Object.entries(recipes || {}).reduce((acc, [name, recipe]) => {
      if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[name as RecipeItemName] = recipe;
      }
      return acc;
    }, {} as Recipes);
  }, [recipes, searchTerm]);

  return (
    <div className="flex flex-col">
      <Label type="default" className="mb-2">
        {t("recipes")}
      </Label>
      <TextInput
        placeholder={t("search.recipes")}
        value={searchTerm}
        onValueChange={(value) => setSearchTerm(value)}
        className="mb-2"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-96">
        {Object.entries(filteredRecipes || {}).map(([recipeName, recipe]) => (
          <div
            key={recipeName}
            className="flex flex-col p-2 bg-brown-200 rounded-lg border border-brown-400"
          >
            <div className="flex justify-between">
              <Label type="transparent" className="mb-1">
                {recipeName}
              </Label>
              <div>
                <ButtonPanel
                  className={classNames(
                    "flex items-center relative mb-1 cursor-pointer !p-0",
                  )}
                  onClick={() => handleSetupRecipe(recipe)}
                >
                  <SquareIcon icon={SUNNYSIDE.icons.hammer} width={5} />
                </ButtonPanel>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col mr-2">
                <div className="flex">
                  <ButtonPanel onClick={() => handleSetupRecipe(recipe)}>
                    <img
                      src={ITEM_DETAILS[recipeName as InventoryItemName]?.image}
                      alt={recipeName}
                      className="w-5 h-5 object-contain"
                    />
                  </ButtonPanel>
                </div>
                <div className="flex mt-1">
                  <img
                    src={SUNNYSIDE.icons.stopwatch}
                    className="w-3 h-3 mr-1"
                    alt="Crafting time"
                  />
                  <span className="text-xxs">
                    {recipe.time
                      ? secondsToString(recipe.time / 1000, {
                          length: "short",
                          isShortFormat: true,
                        })
                      : "Instant"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-0.5">
                {Array(9)
                  .fill(null)
                  .map((_, index) => {
                    const ingredient = recipe.ingredients[index];
                    return (
                      <div
                        key={index}
                        className="w-6 h-6 bg-brown-600 rounded border border-brown-700 flex items-center justify-center"
                      >
                        {ingredient && (
                          <img
                            src={ITEM_DETAILS[ingredient]?.image}
                            alt={ingredient}
                            className="w-5 h-5 object-contain"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
