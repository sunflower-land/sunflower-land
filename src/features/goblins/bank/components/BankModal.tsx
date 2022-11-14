import React, { useState } from "react";

import close from "assets/icons/close.png";
import token from "assets/icons/token_2.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Withdraw } from "./Withdraw";
import { Deposit } from "./Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "deposit"} onClick={() => setTab("deposit")}>
          <img src={token} className="h-5 mr-2" />
          <span className="text-sm">Deposit</span>
        </Tab>
        <Tab isActive={tab === "withdraw"} onClick={() => setTab("withdraw")}>
          <img src={token} className="h-5 mr-2" />
          <span className="text-sm">Withdraw</span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      {tab === "deposit" && <Deposit />}
      {tab === "withdraw" && <Withdraw onClose={onClose} />}
    </Panel>
  );
};
