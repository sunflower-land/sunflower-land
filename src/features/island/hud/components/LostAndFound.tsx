import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React from "react";
import { Modal } from "react-bootstrap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LostAndFound: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal show={isOpen} centered onHide={onClose}>
      <CloseButtonPanel
        title="Lost and Found"
        onClose={onClose}
      ></CloseButtonPanel>
    </Modal>
  );
};
