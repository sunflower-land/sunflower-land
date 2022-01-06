import React from "react";

import { MarketModal } from "../ui/MarketModal";
import { Modal } from "react-bootstrap";
import { Panel } from "./Panel";
import { Button } from "./Button";
import closeIcon from "../../images/ui/close.png";

import "./ExploreFarmModal.css";

interface Props {
  value: string;
  showModal: boolean;
  setValue: (modalValue: string) => void;
  closeModal: () => void;
  callback: (modalValue: string) => void;
}

export const ExploreFarmModal: React.FC<Props> = ({
  showModal,
  callback,
  closeModal,
  value,
  setValue,
}) => {
  const render = showModal && (
    <Modal show={showModal} centered onHide={closeModal} backdrop={false}>
      <Panel>
        <div className="gather-panel">
          <img
            src={closeIcon}
            className="gather-close-icon"
            onClick={closeModal}
            alt="close"
          />
          Enter wallet address
        </div>
        <div id="explore-input-container">
          <input
            type="text"
            step="Address id"
            id="explore-farm-input"
            placeholder="Ex: 0x6e5fa679211d7f6b54e14e187d34ba547c5d3fe0"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button disabled={!value} onClick={() => callback(value)}>
            Search
          </Button>
        </div>
      </Panel>
    </Modal>
  );

  return render;
};
