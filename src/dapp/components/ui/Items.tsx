import React from "react";

import wood from "../../images/ui/wood.png";
import stone from "../../images/ui/rock.png";

import { FruitItem } from "../../types/fruits";

import { Box } from "./Box";

import { Recipe } from "../../types/crafting";

import "./Inventory.css";

interface Props {
  selectedItem: Recipe;
  onSelectItem: (item: Recipe) => void;
  balance: number;
  land: any[];
  fruits: FruitItem[];
}

export const Items: React.FC<Props> = ({
  selectedItem,
  onSelectItem,
  balance,
  land,
  fruits,
}) => {
  return (
    <div id="crafting">
      <div id="crafting-left">
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
        <span id="recipe-type">{selectedItem.type}</span>
        <span id="recipe-title">{selectedItem.name}</span>
        <div id="crafting-item">
          <img src={selectedItem.image} />
        </div>

        <span id="recipe-description">{selectedItem.description}</span>
      </div>
    </div>
  );
};
