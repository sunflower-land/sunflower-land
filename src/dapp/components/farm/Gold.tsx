import "./Trees.css";
import "./Gold.css";

import { useService } from "@xstate/react";
import classnames from "classnames";
import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";

import mining from "../../images/characters/mining.gif";
import waiting from "../../images/characters/waiting.gif";
import smallRock from "../../images/decorations/rock2.png";
import rock from "../../images/land/gold.png";
import arrowDown from "../../images/ui/arrow_down.png";
import arrowUp from "../../images/ui/arrow_up.png";
import closeIcon from "../../images/ui/close.png";
import questionMark from "../../images/ui/expression_confused.png";
import stone from "../../images/ui/gold_ore.png";
import pickaxe from "../../images/ui/iron_pickaxe.png";
import timer from "../../images/ui/timer.png";
import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";
import { Inventory, items } from "../../types/crafting";
import { Button } from "../ui/Button";
import { Message } from "../ui/Message";
import { Panel } from "../ui/Panel";

const ROCKS: React.CSSProperties[] = [
  {
    gridColumn: "13/14",
    gridRow: "111/12",
  },
  {
    gridColumn: "11/12",
    gridRow: "10/11",
  },
];

interface Props {
  inventory: Inventory;
}

export const Gold: React.FC<Props> = ({ inventory }) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const [showModal, setShowModal] = React.useState(false);
  const [treeStrength, setTreeStrength] = React.useState(2);
  const [amount, setAmount] = React.useState(0);
  const [choppedCount, setChoppedCount] = React.useState(0);
  const [showChoppedCount, setShowChoppedCount] = React.useState(false);

  useEffect(() => {
    const load = async () => {
      const strength =
        await machineState.context.blockChain.getGoldStrength();
      setTreeStrength(Math.floor(Number(strength)));
    };

    if (machineState.matches("farming")) {
      load();
      setAmount(0);
    }
  }, [machineState, machineState.value]);

  useEffect(() => {
    const change = machineState.context.blockChain.getInventoryChange();

    if (change.Gold > 0) {
      setChoppedCount(change.Gold);
      setShowChoppedCount(true);
      setTimeout(() => setShowChoppedCount(false), 3000);
    }
  }, [machineState.value, inventory, machineState.context.blockChain]);

  const chop = () => {
    send("MINE", {
      resource: items.find((item) => item.name === "Gold").address,
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

  const limit = Math.min(treeStrength, inventory["Iron Pickaxe"]);

  return (
    <>
      {ROCKS.map((gridPosition, index) => {
        const choppedTreeCount = 2 - treeStrength;
        if (
          choppedTreeCount > index ||
          machineState.matches("onboarding")
        ) {
          return (
            <div style={gridPosition}>
              <img
                src={smallRock}
                className="mined-rock gather-tree"
                alt="tree"
              />
            </div>
          );
        }

        const isNextToChop = choppedTreeCount === index;
        const isHighlighted = amount + choppedTreeCount >= index + 1;
        const showWaiting =
          !machineState.matches("onboarding") &&
          !machineState.matches("mining") &&
          (isNextToChop || isHighlighted);

        return (
          <div
            style={gridPosition}
            className={classnames("gather-tree", "game-object", "gold", {
              "gatherer-selected": isHighlighted,
              gatherer: isNextToChop,
            })}
            onClick={isNextToChop ? open : undefined}
          >
            <img src={rock} className="rock-mine ore" alt="tree" />
            {isHighlighted && machineState.matches("mining") && (
              <div className="boundary show-overflow">
                <img src={mining} className="miner" />
                <div className="gathered-resource-feedback">
                  <span>+</span>
                  <img src={stone} className="wood-chopped" />
                </div>
              </div>
            )}
            {showWaiting && (
              <div className="boundary">
                <img src={waiting} className="miner" />
                <img src={questionMark} className="miner-question" />
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
                    <img src={pickaxe} />
                  </div>
                  <div className="resource-material">
                    <span>Mines</span>
                    <div>
                      <span>1-2</span>
                      <img src={stone} />
                    </div>
                  </div>
                  <div className="resource-material">
                    <span>Regrows every 12 hours</span>
                    <div>
                      <img id="resource-timer" src={timer} />
                    </div>
                  </div>
                </div>
                {inventory["Iron Pickaxe"] < amount ? (
                  <Message>
                    You need a{" "}
                    <img src={pickaxe} className="required-tool" />
                  </Message>
                ) : (
                  <div className="gather-resources">
                    <div id="craft-count">
                      <img className="gather-axe" src={pickaxe} />
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

                    <Button
                      onClick={chop}
                      disabled={inventory["Iron Pickaxe"] < amount}
                    >
                      <span id="craft-button-text">Mine</span>
                    </Button>
                  </div>
                )}
              </div>
              <div className="resource-details">
                <span className="resource-title">Gold mine</span>
                <img src={rock} className="resource-image" />
                <span className="resource-description">
                  A scarce resource that can be mined for gold.
                </span>
                <a
                  href="https://docs.sunflower-farmers.com/resources"
                  target="_blank"
                >
                  <h3 className="current-price-supply-demand">
                    Read more
                  </h3>
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
            <img className="gather-axe" src={stone} />
          </div>
        </Panel>
      </div>
    </>
  );
};
