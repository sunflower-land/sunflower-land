/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Label } from "components/ui/Label";

import token from "assets/icons/token.gif";
import close from "assets/icons/close.png";
import Send from "./components/Send";
import Buy from "./components/Buy";
import Swap from "./components/Swap";

const TOOL_TIP_MESSAGE = "Copy SFL Balance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Wallet: React.FC<Props> = ({ isOpen, onClose }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [tab, setTab] = useState<"balance" | "send" | "buy" | "swap">(
    "balance"
  );
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [showLabel, setShowLabel] = useState(false);

  const sflBalance = goblinState.context.state.balance; //True Balance

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sflBalance.toString());
    setTooltipMessage("Copied!");
    setTimeout(() => {
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setTab("balance");
  };

  const Content = () => {
    return (
      <Panel className="pt-5 relative">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab isActive={tab === "balance"} onClick={() => setTab("balance")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-shadow">
                $SFL
              </span>
            </Tab>
            <Tab isActive={tab === "send"} onClick={() => setTab("send")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-shadow">
                Send
              </span>
            </Tab>
            <Tab isActive={tab === "buy"} onClick={() => setTab("buy")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-shadow">
                Buy
              </span>
            </Tab>
            <Tab isActive={tab === "swap"} onClick={() => setTab("swap")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-shadow">
                Swap
              </span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={handleClose}
          />
        </div>

        {tab === "balance" && (
          <div className="p-2 mb-3">
            <div className="mt-2 mb-3 text-[1rem] text-center">
              <span>Your Actual SFL Token Balance</span>
            </div>
            <div className="flex justify-center items-center break-all select-text text-center">
              <img src={token} className="h-6 md:h-5 lg:h-5" />
              {/* Actual Balance */}
              <span className="text-[14px] sm:text-xs md:text-sm text[1rem] mt-2 text-center justify-center">
                <span>&nbsp;$SFL&nbsp;</span>
                <span>{sflBalance.toString()}</span>
              </span>
            </div>
            <div
              className={`absolute top-12 right-16 mr-5 transition duration-400 pointer-events-none ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label>{tooltipMessage}</Label>
            </div>
          </div>
        )}

        {tab === "send" && <Send />}
        {tab === "buy" && <Buy />}
        {tab === "swap" && <Swap />}
      </Panel>
    );
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered>
      {Content()}
    </Modal>
  );
};
