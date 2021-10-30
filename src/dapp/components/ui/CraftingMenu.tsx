import React from "react";

import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { Message } from "../ui/Message";

import hammer from "../../images/ui/hammer.png";
import basket from "../../images/ui/basket.png";

import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import wood from "../../images/ui/wood.png";
import stone from "../../images/ui/rock.png";

import { recipes, Recipe } from "../../types/crafting";
import { Box } from "./Box";

import "./Crafting.css";

export const CraftingMenu: React.FC = () => {
  const [amount, setAmount] = React.useState(1);
  const [selectedRecipe, setSelectedRecipe] = React.useState(recipes[0]);

  const changeRecipe = (recipe: Recipe) => {
    setAmount(1);
    setSelectedRecipe(recipe);
  };

  return (
    <div id="crafting">
      <div id="crafting-left">
        <div id="inventory-header">
          <img src={hammer} />
          <span>Recipes</span>
        </div>
        <div id="crafting-items">
          {recipes.map((recipe) => (
            <Box
              isSelected={recipe.name === selectedRecipe.name}
              onClick={() => changeRecipe(recipe)}
            >
              <img src={recipe.image} className="box-item" />
            </Box>
          ))}
          <Box></Box>
          <Box></Box>
          <Box></Box>
          <Box></Box>
          <Box />
          <Box />
        </div>
        <div id="inventory-header">
          <img src={basket} />
          <span>Inventory</span>
        </div>
        <div id="inventory">
          <Box count={2} disabled>
            <img src={stone} className="box-item" />
          </Box>
          <Box count={1} disabled>
            <img src={wood} className="box-item" />
          </Box>
          <Box disabled />
          <Box disabled />
          <Box disabled />
          <Box disabled />
          <Box disabled />
          <Box disabled />
          <Box disabled />
          <Box disabled />
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
          {selectedRecipe.ingredients.map((ingredient) => (
            <div className="ingredient">
              <div>
                <img className="ingredient-image" src={ingredient.image} />
                <span className="ingredient-count">{ingredient.name}</span>
              </div>
              <span className="ingredient-text">
                {ingredient.amount * amount}
              </span>
            </div>
          ))}
        </div>
        <div id="craft-action">
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
          <Button>
            <span id="craft-button-text">Craft</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
