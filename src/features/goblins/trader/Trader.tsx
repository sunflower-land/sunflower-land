import React, { useContext, useState } from "react";

import { Context } from "features/game/GoblinProvider";

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
      {showModal && (
        <TraderModal isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};
