import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Deposit } from "features/goblins/bank/components/Deposit";

interface Props {
  balance: Decimal;
}

export const Balance: React.FC<Props> = ({ balance }) => {
  const [showFullBalance, setShowFullBalance] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <InnerPanel
        className="fixed z-50 flex items-center cursor-pointer gap-2 p-1"
        style={{
          top: `${PIXEL_SCALE * 3}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
        onMouseEnter={() => setShowFullBalance(true)}
        onMouseLeave={() => setShowFullBalance(false)}
        onClick={() => setShowDepositModal(true)}
      >
        <img
          src={token}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
        <span className="text-white text-sm">
          {showFullBalance
            ? balance.toString()
            : setPrecision(balance).toString()}
        </span>
      </InnerPanel>
      <Modal
        show={showDepositModal}
        centered
        onHide={() => setShowDepositModal(false)}
      >
        <CloseButtonPanel
          title="How to deposit"
          onClose={() => setShowDepositModal(false)}
        >
          <div className="w-full flex justify-center">
            <img
              src={token}
              className="mb-3"
              style={{
                width: `${PIXEL_SCALE * 10}px`,
                margin: `${PIXEL_SCALE * 1}px`,
              }}
            />
          </div>
          <Deposit />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
