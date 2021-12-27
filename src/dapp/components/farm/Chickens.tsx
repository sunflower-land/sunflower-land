import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";

import { Inventory } from "../../types/crafting";

import {
  Context,
  BlockchainEvent,
  BlockchainState,
  service,
} from "../../machine";

import chickenCoop from "../../images/ui/chicken_barn.png";
import goldEgg from "../../images/ui/gold_egg.png";
import chicken from "../../images/ui/chicken.png";
import eatingChicken from "../../images/characters/white-eating-chicken.gif";
import eatingChickenTwo from "../../images/characters/white-eating-chicken-two.gif";
import walkingChicken from "../../images/characters/white-walking-chicken.gif";
import closeIcon from "../../images/ui/close.png";
import egg from "../../images/ui/egg.png";
import { Panel } from "../ui/Panel";
import { Message } from "../ui/Message";
import { Button } from "../ui/Button";

import "./NFTs.css";
import { useService } from "@xstate/react";
import { secondsToString } from "../../utils/time";

interface Props {
  inventory: Inventory;
}
export const Chickens: React.FC<Props> = ({ inventory }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [timeTillHatch, setTimeTillHatch] = React.useState("");
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const collect = async () => {
    setShowModal(false);

    send("COLLECT_EGGS");

    setTimeTillHatch("");
  };

  useEffect(() => {
    const load = async () => {
      const hatchTime =
        await machineState.context.blockChain.getEggCollectionTime();

      if (hatchTime === 0) {
        setTimeTillHatch("");
        return;
      }

      const difference = Math.floor(Date.now() / 1000) - hatchTime;
      const timeLeft = 60 * 60 * 24 - difference;

      if (timeLeft <= 0) {
        setTimeTillHatch("");
        return;
      }

      setTimeTillHatch(secondsToString(timeLeft));
    };

    if (machineState.matches("farming")) {
      load();
    }
  }, [machineState]);

  return (
    <>
      <div id="chicken-coop" onClick={() => setShowModal(true)}>
        {inventory["Chicken coop"] > 0 && <img src={chickenCoop} alt="coop" />}
        <div>
          {inventory["Golden Egg"] > 0 && (
            <img src={goldEgg} id="gold-egg" alt="goldEgg" />
          )}
          {inventory["Chicken"] > 0 && (
            <>
              {!timeTillHatch && <img id="egg-1" src={egg} alt="egg" />}
              <img
                id="eating-chicken"
                src={eatingChicken}
                alt="eating-chicken"
              />
            </>
          )}
          {inventory["Chicken"] > 1 && (
            <>
              {!timeTillHatch && <img id="egg-2" src={egg} alt="egg" />}
              <img
                id="eating-chicken-two"
                src={eatingChickenTwo}
                alt="eating-chicken"
              />
            </>
          )}
          {inventory["Chicken"] > 2 && (
            <img
              id="walking-chicken"
              src={walkingChicken}
              alt="walking-chicken"
            />
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          centered
          onHide={() => setShowModal(false)}
          backdrop={false}
          dialogClassName="gather-modal"
        >
          <Panel>
            <div className="gather-panel">
              <img
                src={closeIcon}
                className="gather-close-icon"
                onClick={() => setShowModal(false)}
              />

              <div className="resource-details">
                <span className="resource-title">Collect Chicken Eggs</span>
                <img src={egg} className="resource-image" />
                <span
                  className="resource-description"
                  style={{ marginBottom: "1rem" }}
                >
                  Eggs are a valuable resource needed to fuel recipes and your
                  workers. If you have a Chicken Coop you will receive 3x eggs
                </span>
                {!inventory["Chicken"] ? (
                  <Message>
                    You need a <img src={chicken} className="required-tool" />
                  </Message>
                ) : timeTillHatch ? (
                  <Message>Eggs will be ready in {timeTillHatch}</Message>
                ) : (
                  <Button onClick={collect}>
                    <span id="craft-button-text">
                      {" "}
                      <span id="craft-button-text">
                        Collect{" "}
                        {inventory["Chicken"] *
                          (inventory["Chicken coop"] ? 3 : 1)}{" "}
                        eggs
                      </span>
                    </span>
                  </Button>
                )}
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
    </>
  );
};
