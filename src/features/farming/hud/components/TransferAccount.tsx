import React, { useContext, useState } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import alerted from "assets/icons/expression_alerted.png";
import { Button } from "components/ui/Button";
import { transferAccount } from "../actions/transfer";
import { useActor } from "@xstate/react";
import { isAddress } from "web3-utils";
import close from "assets/icons/close.png";
import lightningAnimation from "assets/npcs/human_death.gif";
import transferring from "assets/npcs/minting.gif";
import farmImg from "assets/brand/nft.png";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferAccount: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [wallet, setWallet] = useState({ address: "" });
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );

  const transfer = async () => {
    setState("loading");
    try {
      await transferAccount({
        receiver: wallet.address,
        farmId: authState.context.farmId as number,
        token: authState.context.rawToken as string,
      });
      setState("success");
    } catch {
      setState("error");
    }
  };

  const handleContinue = () => {
    // Kick them back to the main screen
    window.location.href = window.location.pathname;
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center">
        <img
          src={farmImg}
          className="w-64 md-mt-2"
          alt="Sunflower-Land Farm Account NFT Image"
        />
        <span
          style={{
            wordBreak: "break-word",
          }}
          className="text-center mb-2"
        >
          {`Your Account #${
            authState.context.farmId as number
          } has been transferred to: ${wallet.address}`}
          !
        </span>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Something went wrong!</span>
        <img src={lightningAnimation} className="h-20 my-2" />
        <span className="text-xs text-center mt-2 mb-1">
          Looks like we were unable to connect. Please refresh and try again.
        </span>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Transferring your farm!</span>
        <img src={transferring} className="w-1/2 mt-2" />
        <span className="text-xs text-center mt-4 underline mb-1">
          Do not refresh this browser
        </span>
      </div>
    );
  }

  const Content = () => {
    return (
      <div className="p-2">
        <p>Transfer your account</p>
        <p className="text-xs mt-2">Wallet address:</p>
        <input
          type="text"
          name="farmId"
          className="text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2"
          value={wallet.address}
          onChange={(e) => setWallet({ address: e.target.value })}
        />
        <div className="flex items-start">
          <img src={alerted} className="h-6 pt-2 pr-2" />
          <span className="text-xs mt-2">
            Please ensure that the address you provided is on the Polygon
            Blockchain, is correct and is owned by you. There is no recovery
            from incorrect addresses.
          </span>
        </div>
        <Button
          className="mt-2"
          onClick={transfer}
          disabled={!isAddress(wallet.address.toLowerCase())}
        >
          Transfer
        </Button>
        <a
          href="https://docs.sunflower-land.com/support/faq#how-can-i-send-my-account-to-a-new-wallet"
          target="_blank"
          className="underline text-xxs"
          rel="noreferrer"
        >
          Read more
        </a>
        <img
          src={close}
          className="h-6 top-4 right-4 absolute cursor-pointer z-10"
          onClick={onClose}
        />
      </div>
    );
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel className="p-0">{Content()}</Panel>
    </Modal>
  );
};
