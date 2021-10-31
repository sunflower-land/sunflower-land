import { useService } from "@xstate/react";
import React from "react";
import tree from "../../images/decorations/tree.png";
import chopping from "../../images/characters/chopping.gif";

import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";

import { ActionableItem, Fruit, Square } from "../../types/contract";
import { items } from "../../types/crafting";
import { FruitItem } from "../../types/fruits";

import "./Trees.css";

interface Props {
  land: Square[];
  balance: number;
  onHarvest: (landIndex: number) => void;
  onPlant: (landIndex: number) => void;
  selectedItem: ActionableItem;
  fruits: FruitItem[];
}

export const Trees: React.FC<Props> = ({
  fruits,
  land,
  balance,
  onHarvest,
  onPlant,
  selectedItem,
}) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const chop = () => {
    console.log("Chop!");
    service.send("CHOP", {
      resource: items.find((item) => item.name === "Wood").address,
      amount: 1,
    });
  };

  return (
    <>
      <div style={{ gridColumn: "8/9", gridRow: "11/12" }}>
        <img src={tree} className="available-tree" alt="tree" onClick={chop} />
        {machineState.matches("chopping") && (
          <img src={chopping} className="wood-chopper" />
        )}
      </div>
    </>
  );
};
