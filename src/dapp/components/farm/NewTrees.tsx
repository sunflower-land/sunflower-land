import { useService } from "@xstate/react";
import React, { useEffect, useRef } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Toast from "react-bootstrap/Toast";
import Modal from "react-bootstrap/Modal";
import classnames from "classnames";

import closeIcon from "../../images/ui/close.png";
import tree from "../../images/decorations/tree.png";
import trunk from "../../images/decorations/trunk.png";
import stump from "../../images/decorations/stump.png";
import chopping from "../../images/characters/chopping.gif";
import waiting from "../../images/characters/waiting.gif";
import questionMark from "../../images/ui/expression_confused.png";
import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import axe from "../../images/ui/axe.png";
import wood from "../../images/ui/wood.png";
import timer from "../../images/ui/timer.png";

import progressStart from "../../images/ui/progress/start.png";
import progressQuarter from "../../images/ui/progress/quarter.png";
import progressHalf from "../../images/ui/progress/half.png";
import progressAlmost from "../../images/ui/progress/almost.png";
import progressFull from "../../images/ui/progress/full.png";

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
import { Inventory, items } from "../../types/crafting";
import { FruitItem } from "../../types/fruits";

import "./Trees.css";
import { secondsToString } from "../../utils/time";

const TREES: React.CSSProperties[] = [
  {
    gridColumn: "9/10",
    gridRow: "3/4",
  },
  {
    gridColumn: "5/6",
    gridRow: "3/4",
  },
  {
    gridColumn: "2/3",
    gridRow: "2/3",
  },
  {
    gridColumn: "3/4",
    gridRow: "6/7",
  },
  {
    gridColumn: "1/2",
    gridRow: "8/9",
  },
  {
    gridColumn: "3/4",
    gridRow: "11/12",
  },
  {
    gridColumn: "7/8",
    gridRow: "11/12",
  },
  {
    gridColumn: "12/13",
    gridRow: "11/12",
  },
  {
    gridColumn: "15/16",
    gridRow: "3/4",
  },
  {
    gridColumn: "12/13",
    gridRow: "1/2",
  },
];

interface Props {
  inventory: Inventory;
}

export const Trees: React.FC<Props> = ({ inventory }) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const [showModal, setShowModal] = React.useState(false);
  const [treeStrength, setTreeStrength] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [choppedCount, setChoppedCount] = React.useState(0);
  const [showChoppedCount, setShowChoppedCount] = React.useState(false);
  const previousInventory = useRef<Inventory | null>(null);

  useEffect(() => {
    const load = async () => {
      // TODO - fetch available food left and how long until it will be available again
      const { strength } =
        await machineState.context.blockChain.getTreeStrength();
      console.log({ strength });
      setTreeStrength(Math.floor(Number(strength)));
      // TODO load axe count
    };

    if (machineState.matches("farming")) {
      load();
      setAmount(0);
    }
  }, [machineState.value]);

  useEffect(() => {
    if (machineState.matches("chopping")) {
      previousInventory.current = inventory;
    }

    if (
      previousInventory.current &&
      previousInventory.current.wood !== inventory.wood
    ) {
      const difference = inventory.wood - previousInventory.current.wood;
      setChoppedCount(difference);
      setShowChoppedCount(true);
    }
  }, [machineState.value, inventory]);

  const chop = () => {
    console.log("Chop!");
    service.send("CHOP", {
      resource: items.find((item) => item.name === "Wood").address,
      amount: amount,
    });

    setShowModal(false);
  };

  const open = () => {
    setShowModal(true);
    setAmount(1);
  };

  const close = () => {
    setShowModal(false);
    setAmount(0);
  };

  const limit = Math.min(treeStrength, inventory.axe);

  return (
    <>
      {TREES.map((gridPosition, index) => {
        const choppedTreeCount = 10 - treeStrength;
        if (choppedTreeCount > index) {
          return (
            <div style={gridPosition}>
              <img src={stump} className="wood-stump gather-tree" alt="tree" />
            </div>
          );
        }

        const isNextToChop = choppedTreeCount === index;
        const isHighlighted = amount + choppedTreeCount >= index + 1;
        const showWaiting =
          machineState.matches("farming") && (isNextToChop || isHighlighted);

        console.log({ treeStrength, index });
        return (
          <div
            style={gridPosition}
            className={classnames("gather-tree", {
              "gatherer-selected": isHighlighted,
              gatherer: isNextToChop,
            })}
            onClick={isNextToChop ? open : undefined}
          >
            <img src={tree} className="tree" alt="tree" />
            {isHighlighted && machineState.matches("chopping") && (
              <img src={chopping} className="wood-chopper" />
            )}
            {showWaiting && (
              <div>
                <img src={waiting} className="wood-chopper" />
                <img src={questionMark} className="chopper-question" />
              </div>
            )}
          </div>
        );
      })}

      {showModal && (
        <Modal
          show={showModal}
          centered
          onHide={close}
          backdrop={false}
          dialogClassName="gather-modal"
        >
          <Panel>
            <div className="gather-panel">
              <img
                src={closeIcon}
                className="gather-close-icon"
                onClick={close}
              />

              <div className="gather-materials">
                <span>1 axe = 3-5</span>
                <img className="gather-axe" src={wood} />
              </div>

              {inventory.axe < amount ? (
                <Message>
                  You need a <img src={axe} className="required-tool" />
                </Message>
              ) : (
                <div className="gather-resources">
                  <div id="craft-count">
                    <img className="gather-axe" src={axe} />
                    <Message>{amount}</Message>
                    <div id="arrow-container">
                      {amount < limit ? (
                        <img
                          className="craft-arrow"
                          alt="Step up donation value"
                          src={arrowUp}
                          onClick={() => setAmount((r) => r + 1)}
                        />
                      ) : (
                        <div />
                      )}

                      {amount > 1 && (
                        <img
                          className="craft-arrow"
                          alt="Step down donation value"
                          src={arrowDown}
                          onClick={() => setAmount((r) => r - 1)}
                        />
                      )}
                    </div>
                  </div>

                  <Button onClick={chop} disabled={inventory.axe < amount}>
                    <span id="craft-button-text">Chop</span>
                  </Button>
                </div>
              )}
            </div>
          </Panel>
        </Modal>
      )}
    </>
  );
};
