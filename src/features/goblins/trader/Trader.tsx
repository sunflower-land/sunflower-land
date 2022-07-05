import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { TraderModal } from "./TraderModal";
import { Context } from "features/game/GoblinProvider";

export const Trader: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const openTrader = () => {
    goblinService.send("OPEN_TRADING_POST");
    setShowModal(true);
  };

  return (
    <>
      <div onClick={() => openTrader()}>Goblin Trader</div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <TraderModal onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
