import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GoblinProvider";
import { Panel } from "components/ui/Panel";

import { TraderModal } from "./TraderModal";

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
        <Panel>
          <TraderModal onClose={() => setShowModal(false)} />
        </Panel>
      </Modal>
    </>
  );
};
