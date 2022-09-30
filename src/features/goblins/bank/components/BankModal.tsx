import React, { useState } from "react";

import close from "assets/icons/close.png";
import token from "assets/icons/token_2.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Withdraw } from "./Withdraw";
import { Deposit } from "./Deposit";

interface Props {
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");

  return (
    <Panel className="pt-5 relative max-w-5xl">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "deposit"} onClick={() => setTab("deposit")}>
            <img src={token} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Deposit</span>
          </Tab>
          <Tab isActive={tab === "withdraw"} onClick={() => setTab("withdraw")}>
            <img src={token} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Withdraw</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      {tab === "deposit" && <Deposit />}
      {tab === "withdraw" && <Withdraw onClose={onClose} />}
    </Panel>
  );
};
