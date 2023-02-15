import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";
import { Modal } from "react-bootstrap";
import { Deposit } from "features/goblins/bank/components/Deposit";
import { DepositArgs } from "lib/blockchain/Deposit";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  balance: Decimal;
  onDeposit?: (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => void;
}

export const Balance: React.FC<Props> = ({ balance, onDeposit }) => {
  const [showFullBalance, setShowFullBalance] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const handleClose = () => {
    setShowDepositModal(false);
  };

  return (
    <>
      <InnerPanel
        className="fixed z-50 flex items-center cursor-pointer p-1"
        style={{
          top: `${PIXEL_SCALE * 3}px`,
          right: `${PIXEL_SCALE * 3}px`,
        }}
        onMouseEnter={() => setShowFullBalance(true)}
        onMouseLeave={() => setShowFullBalance(false)}
        onClick={onDeposit ? () => setShowDepositModal(true) : undefined}
      >
        <img
          src={token}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
        <span className="text-sm ml-1.5 mb-0.5">
          {showFullBalance
            ? balance.toString()
            : setPrecision(balance).toString()}
        </span>
      </InnerPanel>
      {onDeposit && (
        <Modal show={showDepositModal} centered>
          <CloseButtonPanel
            title={depositDataLoaded ? "Deposit" : undefined}
            onClose={depositDataLoaded ? handleClose : undefined}
          >
            <Deposit
              onDeposit={onDeposit}
              onLoaded={(loaded) => setDepositDataLoaded(loaded)}
              onClose={handleClose}
            />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
