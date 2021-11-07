import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

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

interface Props {
  inventory: Inventory;
}

export const Trees: React.FC<Props> = ({ inventory }) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const [treeStrength, setTreeStrength] = React.useState(10);
  const [amount, setAmount] = React.useState(1);

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
    }
  }, [machineState.value]);

  const chop = () => {
    console.log("Chop!");
    service.send("CHOP", {
      resource: items.find((item) => item.name === "Wood").address,
      amount: amount,
    });
  };

  if (machineState.matches("chopping")) {
    return (
      <div style={{ gridColumn: "9/10", gridRow: "3/4" }} className="gatherer">
        {treeStrength === 10 ? (
          <img src={tree} className="tree" alt="tree" />
        ) : (
          <img src={trunk} className="tree" alt="tree" />
        )}
        <img src={chopping} className="wood-chopper" />
        <div className="gathered-resource-feedback">
          <span>+</span>
          <img src={wood} className="wood-chopped" />
        </div>
      </div>
    );
  }

  if (treeStrength === 0) {
    return (
      <div style={{ gridColumn: "9/10", gridRow: "3/4" }}>
        <img src={stump} className="stump" alt="tree" />
      </div>
    );
  }

  const limit = Math.min(treeStrength, inventory.axe);

  return (
    <div style={{ gridColumn: "9/10", gridRow: "3/4" }} className="gatherer">
      {treeStrength === 10 ? (
        <img src={tree} className="tree" alt="tree" />
      ) : (
        <img src={trunk} className="tree" alt="tree" />
      )}
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
        overlay={
          <Popover id="popover-wood">
            <Panel>
              <div className="gather-panel">
                <div className="gather-materials">
                  <span>{`Chop ${amount} wood`}</span>
                  <img className="gather-axe" src={wood} />
                </div>
                {inventory.axe < amount ? (
                  <Message>
                    You need a <img src={axe} />
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
          </Popover>
        }
      >
        <div>
          <img src={questionMark} className="chopper-question" />
          <img src={waiting} className="wood-chopper" />
        </div>
      </OverlayTrigger>
    </div>
  );
};
