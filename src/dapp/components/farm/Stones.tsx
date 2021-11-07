import { useService } from "@xstate/react";
import React, { useEffect } from "react";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import rock from "../../images/land/rock.png";
import stump from "../../images/decorations/stump.png";
import mining from "../../images/characters/mining.gif";
import waiting from "../../images/characters/waiting.gif";
import questionMark from "../../images/ui/expression_confused.png";
import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import axe from "../../images/ui/wood_pickaxe.png";
import stone from "../../images/ui/rock.png";

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

interface Props {
  inventory: Inventory;
}

export const Stones: React.FC<Props> = ({ inventory }) => {
  const [machineState] = useService<Context, BlockchainEvent, BlockchainState>(
    service
  );

  const [strength, setStrength] = React.useState(10);
  const [amount, setAmount] = React.useState(1);

  useEffect(() => {
    const load = async () => {
      // TODO - fetch available food left and how long until it will be available again
      const { strength } =
        await machineState.context.blockChain.getStoneStrength();
      console.log({ strength });
      setStrength(Math.floor(Number(strength)));
      // TODO load axe count
    };

    if (machineState.matches("farming")) {
      load();
    }
  }, [machineState.value]);

  const mine = () => {
    console.log("Chop!");
    service.send("MINE", {
      resource: items.find((item) => item.name === "Stone").address,
      amount: amount,
    });
  };

  if (strength === 0) {
    return (
      <div style={{ gridColumn: "9/10", gridRow: "11/12" }}>
        {/* TODO - empty stone placeholder */}
      </div>
    );
  }

  if (machineState.matches("mining")) {
    return (
      <div
        style={{ gridColumn: "9/10", gridRow: "11/12" }}
        className="gatherer"
      >
        <img src={rock} className="tree" alt="tree" />
        <img src={mining} className="miner" />
      </div>
    );
  }

  return (
    <div style={{ gridColumn: "9/10", gridRow: "11/12" }} className="gatherer">
      <img src={rock} className="tree" alt="tree" />
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
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
                    <img className="gather-axe" src={axe} />
                    <Message>{amount}</Message>
                    <div id="arrow-container">
                      {amount < strength ? (
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

                  <Button onClick={mine} disabled={inventory.pickaxe < amount}>
                    <span id="craft-button-text">Mine</span>
                  </Button>
                </div>
                {inventory.pickaxe < amount && (
                  <Message>
                    You need {amount - inventory.pickaxe} more <img src={axe} />
                  </Message>
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
    </div>
  );
};
