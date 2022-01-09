import "./Inventory.css";

import React from "react";

import { ActionableItem } from "../../types/contract";
import {
  Inventory as InventorySupply,
  Item,
  items,
} from "../../types/crafting";
import { FruitItem } from "../../types/fruits";
import { InventoryItems } from "./InventoryItems";

interface Props {
  balance: number;
  land: any[];
  fruits: FruitItem[];
  inventory: InventorySupply;
}

export const Inventory: React.FC<Props> = ({ inventory }) => {
  const [selectedItem, onSelectItem] = React.useState<ActionableItem>(
    items[0]
  );

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
          rel="noreferrer"
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
