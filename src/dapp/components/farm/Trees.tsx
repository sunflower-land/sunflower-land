import { useService } from "@xstate/react";
import React from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import tree from "../../images/decorations/tree.png";
import chopping from "../../images/characters/chopping.gif";
import waiting from "../../images/characters/waiting.gif";
import questionMark from "../../images/ui/expression_confused.png";
import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import axe from "../../images/ui/axe.png";
import wood from "../../images/ui/wood.png";

import { Panel } from "../ui/Panel";
import { Message } from "../ui/Message";
import { Button } from "../ui/Button";

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

  const [amount, setAmount] = React.useState(1);

  const chop = () => {
    console.log("Chop!");
    service.send("CHOP", {
      resource: items.find((item) => item.name === "Wood").address,
      amount: amount,
    });
  };

  return (
    <>
      <div style={{ gridColumn: "9/10", gridRow: "3/4" }} className="gatherer">
        <img src={tree} className="available-tree" alt="tree" />
        {machineState.matches("chopping") ? (
          <img src={chopping} className="wood-chopper" />
        ) : (
          <OverlayTrigger
            trigger="click"
            rootClose
            placement="top"
            overlay={
              <Popover id="popover-wood">
                <Panel>
                  <div className="gather-panel">
                    <div className="gather-materials">
                      <span>{`Chop ${amount} wood`}</span>
                      <img className="gather-axe" src={wood} />
                    </div>
                    <div className="gather-resources">
                      <div id="craft-count">
                        <img className="gather-axe" src={axe} />
                        <Message>{amount}</Message>
                        <div id="arrow-container">
                          <img
                            className="craft-arrow"
                            alt="Step up donation value"
                            src={arrowUp}
                            onClick={() => setAmount((r) => r + 1)}
                          />
                          <img
                            className="craft-arrow"
                            alt="Step down donation value"
                            src={arrowDown}
                            onClick={() => setAmount((r) => r - 1)}
                          />
                        </div>
                      </div>

                      <Button onClick={chop}>
                        <span id="craft-button-text">Chop</span>
                      </Button>
                    </div>
                  </div>
                </Panel>
              </Popover>
            }
          >
            <div>
              <img src={questionMark} className="chopper-question" />
              <img src={waiting} className="wood-chopper" />
            </div>
          </OverlayTrigger>
        )}
      </div>
    </>
  );
};
