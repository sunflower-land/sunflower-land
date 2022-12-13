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
  const [isShown, setIsShown] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <>
      <InnerPanel
        className="fixed z-50 flex items-center cursor-pointer"
        style={{
          top: `${PIXEL_SCALE * 3}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
      >
        <img
          src={token}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            margin: `${PIXEL_SCALE * 1}px`,
          }}
        />
        <span
          className="text-white text-base h-7 mx-1"
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
          onClick={() => setShowDepositModal(true)}
        >
          {isShown === false ? (
            <small>{setPrecision(balance).toString()}</small>
          ) : (
            <small>{balance.toString()}</small>
          )}
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
