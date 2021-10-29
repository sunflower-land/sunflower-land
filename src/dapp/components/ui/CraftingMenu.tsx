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

import { Box } from "./Box";

import "./Crafting.css";

export const CraftingMenu: React.FC = () => {
  const [amount, setAmount] = React.useState(1);
  return (
    <div id="crafting">
      <div id="crafting-left">
        <div id="inventory-header">
          <img src={hammer} />
          <span>Recipes</span>
        </div>
        <div id="crafting-items">
          <Box isSelected>
            <img src={hammer} className="box-item" />
          </Box>
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
          <Box count={2}>
            <img src={stone} className="box-item" />
          </Box>
          <Box count={1}>
            <img src={wood} className="box-item" />
          </Box>
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </div>
      </div>
      <div id="recipe">
        <span id="recipe-type">ERC20</span>
        <span id="recipe-title">Hammer</span>
        <img src={hammer} id="crafting-item" />
        <span id="recipe-description">
          Used for building coups, barns and other structures.
        </span>

        <div id="ingredients">
          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={wood} />
              <span className="ingredient-count">Wood</span>
            </div>
            <span className="ingredient-text">5</span>
          </div>

          <div className="ingredient">
            <div>
              <img className="ingredient-image" src={stone} />
              <span className="ingredient-count">Stone</span>
            </div>
            <span className="ingredient-text">5</span>
          </div>
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
