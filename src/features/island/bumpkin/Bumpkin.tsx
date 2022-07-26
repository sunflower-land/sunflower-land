import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { BumpkinModal } from "./components/BumpkinModal";
import { Character } from "./components/Character";

export const Bumpkin: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div>
      <Character
        body="Farmer Potion"
        wig="Rancher Wig"
        pants="Lumberjack Overalls"
        onClick={() => setShowModal(true)}
      />
      <Modal show={showModal} centered>
        <BumpkinModal onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
};
