import React from "react";

import wood from "../../images/ui/wood.png";
import stone from "../../images/ui/rock.png";

import { FruitItem } from "../../types/fruits";

import { Box, Props as BoxProps } from "./Box";

import { Item, items, Recipe, recipes } from "../../types/crafting";

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
}

export const InventoryItems: React.FC<Props> = ({
  selectedItem,
  onSelectItem,
}) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);
  const [inventory, setInventory] = React.useState({
    axe: 0,
    pickaxe: 0,
    wood: 0,
    stone: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const load = async () => {
      const amount = await machineState.context.blockChain.getInventory();
      setInventory(amount);
      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) {
    return <div id="inventory-loading">Loading...</div>;
  }

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
    const item = items.find((recipe) => recipe.name === "Pickaxe");
    boxes.push({
      count: inventory.pickaxe,
      onClick: onSelectItem ? () => onSelectItem(item) : undefined,
      isSelected: selectedItem?.name === "Pickaxe",
      image: item.image,
      disabled: !onSelectItem,
    });
  }

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
