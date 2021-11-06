import { useService } from "@xstate/react";
import React from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import rock from "../../images/land/rock.png";
import mining from "../../images/characters/mining.gif";
import waiting from "../../images/characters/waiting.gif";
import questionMark from "../../images/ui/expression_confused.png";
import pickaxe from "../../images/ui/pickaxe.png";
import stone from "../../images/ui/rock.png";
import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";

import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";

import { Panel } from "../ui/Panel";
import { Message } from "../ui/Message";
import { Button } from "../ui/Button";

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
  const [amount, setAmount] = React.useState(1);
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
      <div
        style={{ gridColumn: "10/11", gridRow: "11/12" }}
        className="gatherer"
      >
        <img src={rock} className="available-tree" alt="tree" />
        {machineState.matches("mining") ? (
          <img src={mining} className="miner" />
        ) : (
          <OverlayTrigger
            trigger="click"
            rootClose
            overlay={
              <Popover id="popover-stone">
                <Panel>
                  <div className="gather-panel">
                    <div className="gather-materials">
                      <span>{`Mine ${amount} stone`}</span>
                      <img className="gather-axe" src={stone} />
                    </div>
                    <div className="gather-resources">
                      <div id="craft-count">
                        <img className="gather-axe" src={pickaxe} />
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

                      <Button onClick={mine}>
                        <span id="craft-button-text">Mine</span>
                      </Button>
                    </div>
                  </div>
                </Panel>
              </Popover>
            }
          >
            <div className="gatherer">
              <img src={questionMark} className="miner-question" />
              <img src={waiting} className="miner" />
            </div>
          </OverlayTrigger>
        )}
      </div>
    </>
  );
};
