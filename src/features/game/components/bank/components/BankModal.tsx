import React from "react";

import { Panel } from "components/ui/Panel";

import { Withdraw } from "./Withdraw";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameWallet } from "features/wallet/Wallet";

interface Props {
  farmAddress: string;
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose, farmAddress }) => {
  return (
    <Panel className="relative">
      <GameWallet action="withdraw">
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <Withdraw onClose={onClose} />
      </GameWallet>
    </Panel>
  );
};
