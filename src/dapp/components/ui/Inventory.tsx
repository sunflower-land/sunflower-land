import React from "react";

import { FruitItem } from "../../types/fruits";

import { ActionableItem, isFruit } from "../../types/contract";
import {
  Inventory as InventorySupply,
  Item,
  items,
  Recipe,
  recipes,
} from "../../types/crafting";

import { InventoryItems } from "./InventoryItems";
import "./Inventory.css";

interface Props {
  balance: number;
  land: any[];
  fruits: FruitItem[];
  inventory: InventorySupply;
}

export const Inventory: React.FC<Props> = ({
  balance,
  land,
  fruits,
  inventory,
}) => {
  const [selectedItem, onSelectItem] = React.useState<ActionableItem>(items[0]);

  const item = selectedItem as Item;

  return (
    <div id="crafting">
      <div id="crafting-left">
        <InventoryItems
          onSelectItem={onSelectItem}
          selectedItem={selectedItem}
          inventory={inventory}
        />
        <a
          href="https://docs.sunflower-farmers.com/crafting-guide"
          target="_blank"
        >
          <h3 className="current-price-supply-demand">Read more</h3>
        </a>
      </div>
      <div id="recipe">
        <>
          <span className="recipe-type">{item.type}</span>
          <span id="recipe-title">{item.name}</span>
          <div id="crafting-item">
            <img src={item.image} />
          </div>

          <span id="recipe-description">{item.description}</span>
        </>
      </div>
    </div>
  );
};
