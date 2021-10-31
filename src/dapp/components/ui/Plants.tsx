import React from "react";

import coin from "../../images/ui/sunflower_coin.png";
import stopwatch from "../../images/ui/stopwatch.png";

import { FruitItem, getFruit } from "../../types/fruits";
import { ActionableItem, Fruit, isFruit } from "../../types/contract";

import { Box } from "./Box";

import "./Inventory.css";
import { secondsToString } from "../../utils/time";

interface Props {
  selectedItem: ActionableItem;
  onSelectItem: (item: ActionableItem) => void;
  balance: number;
  land: any[];
  fruits: FruitItem[];
}

export const Plants: React.FC<Props> = ({
  selectedItem,
  onSelectItem,
  balance,
  land,
  fruits,
}) => {
  const plant = isFruit(selectedItem) && selectedItem;

  return (
    <div id="crafting">
      <div id="crafting-left">
        <div id="crafting-items">
          {fruits.map((fruit) => (
            <Box
              isSelected={fruit.fruit === plant.fruit}
              onClick={() => onSelectItem(fruit)}
            >
              <img src={fruit.image} className="box-item" />
            </Box>
          ))}
        </div>
      </div>
      <div id="recipe">
        {plant && (
          <>
            <span id="recipe-title">{plant.name}</span>
            <div id="crafting-item">
              <img src={plant.image} />
            </div>

            <div id="ingredients">
              <div className="ingredient">
                <div>
                  <img className="ingredient-image" src={stopwatch} />
                  <span className="ingredient-count">Time</span>
                </div>
                <span className="ingredient-text">
                  {secondsToString(plant.harvestMinutes * 60)}
                </span>
              </div>
              <div id="plant-to-harvest">
                <img className="ingredient-image" src={coin} />
                <span>Prices</span>
              </div>

              <div className="ingredient">
                <div>
                  <span className="ingredient-count">Plant</span>
                </div>
                <span className="ingredient-text">{`$${plant.buyPrice}`}</span>
              </div>
              <div className="ingredient">
                <div>
                  <span className="ingredient-count">Harvest</span>
                </div>
                <span className="ingredient-text">{`$${plant.sellPrice}`}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
