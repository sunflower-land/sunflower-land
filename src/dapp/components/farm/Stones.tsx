import { useService } from "@xstate/react";
import React from "react";
import rock from "../../images/land/rock.png";
import mining from "../../images/characters/mining.gif";

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

export const Stones: React.FC<Props> = ({
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

  const mine = () => {
    console.log("mine!");
    service.send("MINE", {
      resource: items.find((item) => item.name === "Stone").address,
      amount: 1,
    });
  };

  return (
    <>
      <div style={{ gridColumn: "10/11", gridRow: "11/12" }}>
        <img src={rock} className="available-tree" alt="tree" onClick={mine} />
        {machineState.matches("mining") && (
          <img src={mining} className="miner" />
        )}
      </div>
    </>
  );
};
