import React from "react";
import Modal from "react-bootstrap/Modal";

import { Inventory } from "../../types/crafting";

import {
  Context,
  BlockchainEvent,
  BlockchainState,
  service,
} from "../../machine";

import chickenCoop from "../../images/ui/chicken_barn.png";
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

interface Props {
  inventory: Inventory;
}
export const Chickens: React.FC<Props> = ({ inventory }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [collecting, setCollecting] = React.useState(false);
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const collect = async () => {
    setShowModal(false);
    setCollecting(true);

    await machineState.context.blockChain.collectEggs();

    setCollecting(false);
  };

  return (
    <>
      <div id="chicken-coop" onClick={() => setShowModal(true)}>
        {true && (
          <div>
            <img src={chickenCoop} alt="coop" />
            {inventory["Chicken"] > 1 && (
              <img
                id="eating-chicken"
                src={eatingChicken}
                alt="eating-chicken"
              />
            )}
            {inventory["Chicken"] > 2 && (
              <img
                id="walking-chicken"
                src={walkingChicken}
                alt="walking-chicken"
              />
            )}
            {inventory["Chicken"] > 3 && (
              <img
                id="eating-chicken-two"
                src={eatingChickenTwo}
                alt="eating-chicken"
              />
            )}
          </div>
        )}
        {collecting && (
          <span
            style={{
              position: "absolute",
              fontSize: "12px",
            }}
          >
            Collecting...
          </span>
        )}
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
                  Eggs are a valuable resource needed to fuel a farm.
                </span>
                {!inventory["Chicken"] ? (
                  <Message>
                    You need a <img src={chicken} className="required-tool" />
                  </Message>
                ) : (
                  <Button onClick={collect}>
                    <span id="craft-button-text">Collect</span>
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
