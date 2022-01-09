import "./Inventory.css";

import React from "react";

import coin from "../../images/ui/icon.png";
import stopwatch from "../../images/ui/stopwatch.png";
import { ActionableItem, isFruit } from "../../types/contract";
import { FruitItem } from "../../types/fruits";
import { secondsToString } from "../../utils/time";
import { Box } from "./Box";

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
  land,
  fruits,
}) => {
  let plant = isFruit(selectedItem) && selectedItem;

  // Grab the market price plant
  if (plant) {
    plant = fruits.find((f) => f.fruit === plant.fruit);
  }

  return (
    <div id="crafting">
      <div id="crafting-left">
        <div id="crafting-items">
          {fruits.map((fruit) =>
            fruit.landRequired > land.length ? (
              <Box disabled />
            ) : (
              <Box
                isSelected={fruit.fruit === plant.fruit}
                onClick={() => onSelectItem(fruit)}
              >
                <img src={fruit.image} className="box-item" />
              </Box>
            )
          )}
        </div>
        <a
          href="https://docs.sunflower-farmers.com/plant-guide"
          target="_blank"
          rel="noreferrer"
        >
          <h3 className="current-price-supply-demand">Read more</h3>
        </a>
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
                <span className="ingredient-text">{`${plant.buyPrice} $SFF`}</span>
              </div>
              <div className="ingredient">
                <div>
                  <span className="ingredient-count">Harvest</span>
                </div>
                <span className="ingredient-text">{`${plant.sellPrice} $SFF `}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
