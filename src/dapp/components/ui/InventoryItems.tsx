import React from "react";

import wood from "../../images/ui/wood.png";
import stone from "../../images/ui/rock.png";

import { FruitItem } from "../../types/fruits";

import { Box, Props as BoxProps } from "./Box";

import { Inventory, Item, items, Recipe, recipes } from "../../types/crafting";

import "./Inventory.css";
import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";
import { useService } from "@xstate/react";
import { ActionableItem, isFruit } from "../../types/contract";

interface Props {
  selectedItem?: ActionableItem;
  onSelectItem?: (item: ActionableItem) => void;
  inventory: Inventory;
}

export const InventoryItems: React.FC<Props> = ({
  selectedItem,
  onSelectItem,
  inventory,
}) => {
  console.log({ items: inventory });
  const boxes: BoxProps[] = [];

  if (inventory.axe > 0) {
    const item = items.find((recipe) => recipe.name === "Axe");
    boxes.push({
      count: inventory.axe,
      onClick: onSelectItem ? () => onSelectItem(item) : undefined,
      isSelected: selectedItem?.name === "Axe",
      image: item.image,
      disabled: !onSelectItem,
    });
  }

  if (inventory.pickaxe > 0) {
    const item = items.find((recipe) => recipe.name === "Wood pickaxe");
    boxes.push({
      count: inventory.pickaxe,
      onClick: onSelectItem ? () => onSelectItem(item) : undefined,
      isSelected: selectedItem?.name === "Wood pickaxe",
      image: item.image,
      disabled: !onSelectItem,
    });
  }

  // if (inventory.pickaxe > 0) {
  //   const item = items.find((recipe) => recipe.name === "Wood pickaxe");
  //   boxes.push({
  //     count: inventory.pickaxe,
  //     onClick: onSelectItem ? () => onSelectItem(item) : undefined,
  //     isSelected: selectedItem?.name === "Wood pickaxe",
  //     image: item.image,
  //     disabled: !onSelectItem,
  //   });
  // }

  if (inventory.stone > 0) {
    const item = items.find((recipe) => recipe.name === "Stone");
    boxes.push({
      count: inventory.stone,
      onClick: onSelectItem ? () => onSelectItem(item) : undefined,
      isSelected: selectedItem?.name === "Stone",
      image: item.image,
      disabled: !onSelectItem,
    });
  }

  console.log("Is disbaled: ", !onSelectItem);

  if (inventory.wood > 0) {
    const item = items.find((recipe) => recipe.name === "Wood");
    boxes.push({
      count: inventory.wood,
      onClick: onSelectItem ? () => onSelectItem(item) : undefined,
      isSelected: selectedItem?.name === "Wood",
      image: item.image,
      disabled: !onSelectItem,
    });
  }

  // Pad array with empty boxes
  for (let i = boxes.length; i < 10; i++) {
    boxes.push({ disabled: true });
  }

  return (
    <div id="inventory">
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
  );
};
