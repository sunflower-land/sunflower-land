import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import classnames from "classnames";

import closeIcon from "../../images/ui/close.png";
import tree from "../../images/decorations/tree.png";
import stump from "../../images/decorations/stump.png";
import chopping from "../../images/characters/chopping.gif";
import waiting from "../../images/characters/waiting.gif";
import questionMark from "../../images/ui/expression_confused.png";
import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import axe from "../../images/ui/axe.png";
import wood from "../../images/ui/wood.png";
import timer from "../../images/ui/timer.png";

import { Panel } from "../ui/Panel";
import { Message } from "../ui/Message";
import { Button } from "../ui/Button";

import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";

import { Inventory, items } from "../../types/crafting";

import "./Trees.css";

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
  const [treeStrength, setTreeStrength] = React.useState(10);
  const [amount, setAmount] = React.useState(0);
  const [choppedCount, setChoppedCount] = React.useState(0);
  const [showChoppedCount, setShowChoppedCount] = React.useState(false);

  useEffect(() => {
    const load = async () => {
      const strength = await machineState.context.blockChain.getTreeStrength();
      setTreeStrength(Math.floor(Number(strength)));
    };

    if (machineState.matches("farming")) {
      load();
      setAmount(0);
    }
  }, [machineState.value]);

  useEffect(() => {
    const change = machineState.context.blockChain.getInventoryChange();

    if (change.Wood > 0) {
      setChoppedCount(change.Wood);
      setShowChoppedCount(true);
      setTimeout(() => setShowChoppedCount(false), 3000);
    }
  }, [machineState.value, inventory]);

  const chop = () => {
    send("CHOP", {
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

  const limit = Math.min(treeStrength, inventory.Axe);

  return (
    <>
      {TREES.map((gridPosition, index) => {
        const choppedTreeCount = 10 - treeStrength;
        if (choppedTreeCount > index || machineState.matches("onboarding")) {
          return (
            <div style={gridPosition}>
              <img src={stump} className="wood-stump gather-tree" alt="tree" />
            </div>
          );
        }

        const isNextToChop = choppedTreeCount === index;
        const isHighlighted = amount + choppedTreeCount >= index + 1;
        const showWaiting =
          !machineState.matches("onboarding") &&
          !machineState.matches("chopping") &&
          (isNextToChop || isHighlighted);

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
              <>
                <img src={chopping} className="wood-chopper" />
                <div className="gathered-resource-feedback">
                  <span>+</span>
                  <img src={wood} className="wood-chopped" />
                </div>
              </>
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

              <div className="resource-materials">
                <div>
                  <div className="resource-material">
                    <span>Requires</span>
                    <img src={axe} />
                  </div>
                  <div className="resource-material">
                    <span>Chops</span>
                    <div>
                      <span>3-5</span>
                      <img src={wood} />
                    </div>
                  </div>
                  <div className="resource-material">
                    <span>Regrows every hour</span>
                    <div>
                      <img id="resource-timer" src={timer} />
                    </div>
                  </div>
                </div>
                {inventory.Axe < amount ? (
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

                    <Button onClick={chop} disabled={inventory.Axe < amount}>
                      <span id="craft-button-text">Chop</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="resource-details">
                <span className="resource-title">Tree</span>
                <img src={tree} className="resource-image" />
                <span className="resource-description">
                  A bountiful resource that can be chopped for wood.
                </span>
                <a
                  href="https://docs.sunflower-farmers.com/resources"
                  target="_blank"
                >
                  <h3 className="current-price-supply-demand">Read more</h3>
                </a>
              </div>
            </div>
          </Panel>
        </Modal>
      )}
      <div
        id="resource-increase-panel"
        style={{
          opacity: showChoppedCount ? 1 : 0,
        }}
      >
        <Panel>
          <div className="wood-toast-body">
            +{choppedCount}
            <img className="gather-axe" src={wood} />
          </div>
        </Panel>
      </div>
    </>
  );
};
