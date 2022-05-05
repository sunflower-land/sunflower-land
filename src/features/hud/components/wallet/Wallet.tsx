/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Label } from "components/ui/Label";

import token from "assets/icons/token.gif";
import close from "assets/icons/close.png";

const TOOL_TIP_MESSAGE = "Copy SFL Balance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Wallet: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [tab, setTab] = useState<"balance" | "send" | "buy" | "swap">(
    "balance"
  );
  const [tooltipMessage, setTooltipMessage] = useState(TOOL_TIP_MESSAGE);
  const [showLabel, setShowLabel] = useState(false);

  const sflBalance = game.context.state.balance; //True Balance

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sflBalance.toString());
    setTooltipMessage("Copied!");
    setTimeout(() => {
      setTooltipMessage(TOOL_TIP_MESSAGE);
    }, 2000);
  };

  const Content = () => {
    return (
      <Panel className="pt-5 relative">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab isActive={tab === "balance"} onClick={() => setTab("balance")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs sm:text-sm md:text-sm lg:text-sm text-shadow">
                $
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
            onClick={onClose}
          />
        </div>

        {tab === "balance" && (
          <div>
            <div className="mt-2 mb-3 text-[1rem] text-center">
              <span>Your True SFL Token Balance</span>
            </div>
            <div className="flex justify-center items-center break-all select-text text-center">
              <img src={token} className="h-6 md:h-5 lg:h-5" />
              {/* True Balance */}
              <span className="text-[14px] sm:text-xs md:text-sm text[1rem] mt-2 text-center justify-center">
                <span>&nbsp;$SFL&nbsp;</span>
                <span>
                  {/*sflBalance.toString()*/ `17500.098765432123456789`}
                </span>
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

        {tab === "send" && (
          <div>
            <div className="mt-2 mb-3 text-[1rem] text-center">
              <span>
                Transfer or Send SFL Tokens to your fellow farmer friends
              </span>
            </div>
            <div className="flex justify-between items-center">
              <img src={token} className="h-8" />
              <span className="text-[14px] sm:text-xs mt-2 break-all select-text">
                Coming Soon... Q4&apos;22 ;)
              </span>
            </div>
          </div>
        )}

        {tab === "buy" && (
          <div>
            <div className="mt-2 mb-3 text-[1rem] text-center">
              <span>Buy SFL Tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <img src={token} className="h-8" />
              <span className="text-[14px] sm:text-xs mt-2 break-all select-text">
                Coming Soon... Q4&apos;22 :)
              </span>
            </div>
          </div>
        )}

        {tab === "swap" && (
          <div>
            <div className="mt-2 mb-3 text-[1rem] text-center">
              <span>Swap SFL Tokens with other ERC20 Tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <img src={token} className="h-8" />
              <span className="text-[14px] sm:text-xs mt-2 break-all select-text">
                Coming Soon... Q4&apos;22 :)
              </span>
            </div>
          </div>
        )}
      </Panel>
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      {Content()}
    </Modal>
  );
};
