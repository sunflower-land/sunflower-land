import React from "react";

import { FruitItem } from "../../types/fruits";

import { ActionableItem, isFruit } from "../../types/contract";

import { InventoryItems } from "./InventoryItems";
import "./Inventory.css";

interface Props {
  selectedItem: ActionableItem;
  onSelectItem: (item: ActionableItem) => void;
  balance: number;
  land: any[];
  fruits: FruitItem[];
}

export const Inventory: React.FC<Props> = ({
  selectedItem,
  onSelectItem,
  balance,
  land,
  fruits,
}) => {
  const inventoryItem = !isFruit(selectedItem) && selectedItem;

  return (
    <div id="crafting">
      <div id="crafting-left">
        <InventoryItems
          onSelectItem={onSelectItem}
          selectedItem={selectedItem}
        />
      </div>
      <div id="recipe">
        {inventoryItem && (
          <>
            <span id="recipe-type">{selectedItem.type}</span>
            <span id="recipe-title">{selectedItem.name}</span>
            <div id="crafting-item">
              <img src={selectedItem.image} />
            </div>

            <span id="recipe-description">{selectedItem.description}</span>
          </>
        )}
      </div>
    </div>
  );
};
