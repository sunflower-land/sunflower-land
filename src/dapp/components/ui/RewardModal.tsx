import "./UpgradeModal.css";

import { useService } from "@xstate/react";
import React from "react";
import Modal from "react-bootstrap/Modal";

import openTreasure from "../../images/decorations/open_treasure.png";
import cancel from "../../images/ui/cancel.png";
import coin from "../../images/ui/spinning_coin.gif";
import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";
import { Button } from "./Button";
import { Message } from "./Message";
import { Panel } from "./Panel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReceive: () => void;
  reward: number;
}

export const RewardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reward,
  onReceive,
}) => {
  const [machineState] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const isUnsaved = machineState.context.blockChain.isUnsaved();

  if (!reward) {
    return null;
  }

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel>
        <div id="reward-container">
          <span>Collect your reward</span>

          {isUnsaved ? (
            <>
              <div className="upgrade-required">
                <Message>
                  Save your farm first
                  <img src={cancel} className="insufficient-funds-cross" />
                </Message>
              </div>
              <span id="donate-description">
                You must first save your farm to the blockchain before
                attempting to receive your reward.{" "}
              </span>
            </>
          ) : (
            <div>
              <div id="treasure-holder">
                <img src={openTreasure} id="open-treasure" />
                <img src={coin} id="reward-coin" />
              </div>
              <div id="reward-holder">
                <span>{`${reward.toFixed(2)} $SFF`}</span>
              </div>
              <div id="reward-button">
                <Button onClick={onReceive}>Collect</Button>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </Modal>
  );
};

export const UpgradeOverlay = (props) => (
  <div id="tester" {...props}>
    <Message>Upgrade required</Message>
  </div>
);
