import React from "react";

import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { Message } from "../ui/Message";
import { InventoryItems } from "../ui/InventoryItems";

import hammer from "../../images/ui/hammer.png";
import basket from "../../images/ui/basket.png";

import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import wood from "../../images/ui/wood.png";
import stone from "../../images/ui/rock.png";

import {
  recipes,
  Recipe,
  Inventory,
  getItemAmount,
} from "../../types/crafting";
import { service } from "../../machine";
import { Box, BoxProps } from "./Box";

import "./Crafting.css";

interface Props {
  onClose: () => void;
  inventory: Inventory;
}
export const CraftingMenu: React.FC<Props> = ({ onClose, inventory }) => {
  const [amount, setAmount] = React.useState(1);
  const [selectedRecipe, setSelectedRecipe] = React.useState(recipes[0]);

  const changeRecipe = (recipe: Recipe) => {
    setAmount(1);
    setSelectedRecipe(recipe);
  };

  const craft = () => {
    service.send("CRAFT", {
      recipe: selectedRecipe,
      amount,
    });
    onClose();
  };

  const boxes: BoxProps[] = recipes.map((recipe) => ({
    isSelected: recipe.name === selectedRecipe.name,
    onClick: () => changeRecipe(recipe),
    image: recipe.image,
  }));

  // Pad array with empty boxes
  for (let i = boxes.length; i < 10; i++) {
    boxes.push({ disabled: true });
  }

  const ingredientList = selectedRecipe.ingredients.map((ingredient) => {
    const inventoryCount = getItemAmount(inventory, ingredient.name);
    const price = ingredient.amount * amount;
    return {
      name: ingredient.name,
      image: ingredient.image,
      price,
      canAfford: inventoryCount >= price,
    };
  });

  const canAfford = ingredientList.every((ingredient) => ingredient.canAfford);

  return (
    <div id="crafting">
      <div id="crafting-left">
        <div id="inventory-header">
          <img src={hammer} />
          <span>Recipes</span>
        </div>
        <div id="crafting-items">
          {boxes.map((box) => (
            <Box
              count={box.count}
              onClick={box.onClick}
              image={box.image}
              isSelected={box.isSelected}
              disabled={box.disabled}
            />
          ))}
        </div>
        <div id="inventory-header">
          <img src={basket} />
          <span>Inventory</span>
        </div>
        <div id="inventory">
          <InventoryItems inventory={inventory} />
        </div>
      </div>
      <div id="recipe">
        <span id="recipe-type">{selectedRecipe.type}</span>
        <span id="recipe-title">{selectedRecipe.name}</span>
        <div id="crafting-item">
          <img src={selectedRecipe.image} />
        </div>
        <span id="recipe-description">{selectedRecipe.description}</span>

        <div id="ingredients">
          {ingredientList.map((ingredient) => (
            <div className="ingredient">
              <div>
                <img className="ingredient-image" src={ingredient.image} />
                <span className="ingredient-count">{ingredient.name}</span>
              </div>
              <span
                className={`ingredient-text ${
                  !ingredient.canAfford && "ingredient-insufficient"
                }`}
              >
                {ingredient.price}
              </span>
            </div>
          ))}
        </div>
        <div id="craft-action">
          {selectedRecipe.isLocked ? (
            <span id="recipe-description">Coming soon...</span>
          ) : (
            <>
              <div id="craft-count">
                <Message>{amount}</Message>
                <div id="arrow-container">
                  <img
                    className="craft-arrow"
                    alt="Step up donation value"
                    src={arrowUp}
                    onClick={() => setAmount((r) => r + 1)}
                  />
                  <img
                    className="craft-arrow"
                    alt="Step down donation value"
                    src={arrowDown}
                    onClick={() => setAmount((r) => r - 1)}
                  />
                </div>
              </div>
              <Button onClick={craft} disabled={!canAfford}>
                <span id="craft-button-text">Craft</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
