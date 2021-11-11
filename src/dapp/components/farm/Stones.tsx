import { useService } from "@xstate/react";
import React, { useEffect, useRef } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Toast from "react-bootstrap/Toast";

import rock from "../../images/land/rock.png";
import mining from "../../images/characters/mining.gif";
import waiting from "../../images/characters/waiting.gif";
import questionMark from "../../images/ui/expression_confused.png";
import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import axe from "../../images/ui/wood_pickaxe.png";
import stone from "../../images/ui/rock.png";

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

import { Inventory, items } from "../../types/crafting";

import "./Trees.css";
import { secondsToString } from "../../utils/time";

interface Props {
  inventory: Inventory;
}

export const Stones: React.FC<Props> = ({ inventory }) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const [treeStrength, setTreeStrength] = React.useState(0);
  const [amount, setAmount] = React.useState(1);
  const [choppedCount, setChoppedCount] = React.useState(0);
  const [showChoppedCount, setShowChoppedCount] = React.useState(false);
  const previousInventory = useRef<Inventory | null>(null);

  useEffect(() => {
    const load = async () => {
      // TODO - fetch available food left and how long until it will be available again
      const { strength } =
        await machineState.context.blockChain.getStoneStrength();
      console.log({ strength });
      setTreeStrength(Math.floor(Number(strength)));
      // TODO load axe count
    };

    if (machineState.matches("farming")) {
      load();
    }
  }, [machineState.value]);

  useEffect(() => {
    if (machineState.matches("mining")) {
      previousInventory.current = inventory;
    }

    if (
      previousInventory.current &&
      previousInventory.current.stone !== inventory.stone
    ) {
      const difference = inventory.stone - previousInventory.current.stone;
      setChoppedCount(difference);
      setShowChoppedCount(true);
    }
  }, [machineState.value, inventory]);

  const chop = () => {
    console.log("Chop!");
    service.send("MINE", {
      resource: items.find((item) => item.name === "Stone").address,
      amount: amount,
    });
  };

  const Content = () => {
    if (machineState.matches("mining")) {
      return (
        <>
          {treeStrength === 10 ? (
            <img src={rock} className="tree" alt="tree" />
          ) : (
            <img src={rock} className="tree" alt="tree" />
          )}
          <img src={mining} className="miner" />
          <div className="gathered-resource-feedback">
            <span>+</span>
            <img src={stone} className="wood-chopped" />
          </div>
        </>
      );
    }

    if (treeStrength === 0) {
      return null;
    }

    const limit = Math.min(treeStrength, inventory.pickaxe);
    console.log({ limit });
    return (
      <>
        {treeStrength === 10 ? (
          <img src={rock} className="tree" alt="tree" />
        ) : (
          <img src={rock} className="tree" alt="tree" />
        )}
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="bottom"
          overlay={
            <Popover id="popover-stone">
              <Panel>
                <div className="gather-panel">
                  <div className="gather-materials">
                    <span>1 pickaxe = 2-4</span>
                    <img className="gather-axe" src={stone} />
                  </div>

                  {inventory.pickaxe < amount ? (
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

                      <Button
                        onClick={chop}
                        disabled={inventory.pickaxe < amount}
                      >
                        <span id="craft-button-text">Mine</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Panel>
            </Popover>
          }
        >
          <div>
            <img src={questionMark} className="miner-question" />
            <img src={waiting} className="miner" />
          </div>
        </OverlayTrigger>
      </>
    );
  };

  const Progress = () => {
    if (treeStrength === 10) {
      return <img src={progressFull} className="rock-progress" />;
    }
    if (treeStrength > 10 * (3 / 4)) {
      return <img src={progressAlmost} className="rock-progress" />;
    }

    if (treeStrength > 10 * (1 / 2)) {
      return <img src={progressHalf} className="rock-progress" />;
    }

    if (treeStrength > 10 * (1 / 4)) {
      return <img src={progressQuarter} className="rock-progress" />;
    }

    return <img src={progressStart} className="rock-progress" />;
  };

  // Ever 12 minutes it repairs 1/10th
  const timeLeft = (10 - treeStrength) * 12 * 60;

  return (
    <div style={{ gridColumn: "9/10", gridRow: "11/12" }} className="gatherer">
      <Toast
        onClose={() => setShowChoppedCount(false)}
        show={showChoppedCount}
        delay={3000}
        autohide
        className="wood-toast"
      >
        <div className="wood-toast-body">
          +{choppedCount}
          <img className="gather-axe" src={stone} />
        </div>
      </Toast>
      {Content()}
      {machineState.matches("farming") && (
        <>
          {Progress()}
          {timeLeft > 0 && (
            <span className="rock-progress-text">
              {secondsToString(timeLeft)}
            </span>
          )}
        </>
      )}
    </div>
  );
};
