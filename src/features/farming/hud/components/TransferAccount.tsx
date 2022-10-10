import React, { useContext, useState } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import alerted from "assets/icons/expression_alerted.png";
import { Button } from "components/ui/Button";
import { transferAccount } from "../actions/transfer";
import { useActor } from "@xstate/react";
import { isAddress } from "web3-utils";

export const TransferAccount: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [wallet, setWallet] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );

  const transfer = async () => {
    setState("loading");
    try {
      await transferAccount({
        receiver: wallet,
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
      <div>
        <span
          style={{
            wordBreak: "break-word",
          }}
        >{`Your farm has been transferred to: ${wallet}`}</span>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    );
  }

  if (state === "error") {
    return <span>Something went wrong</span>;
  }

  if (state === "loading") {
    return <span className="loading">Transferring</span>;
  }

  return (
    <div className="p-2">
      <p>Transfer your account</p>
      <p className="text-xs mt-2">Wallet address:</p>
      <input
        type="text"
        name="farmId"
        className="text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />
      <div className="flex items-start">
        <img src={alerted} className="h-6 pt-2 pr-2" />
        <span className="text-xs mt-2">
          Please ensure that the address you provided is on the Polygon
          Blockchain, is correct and is owned by you. There is no recovery from
          incorrect addresses.
        </span>
      </div>
      <Button className="mt-2" onClick={transfer} disabled={!isAddress(wallet)}>
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
    </div>
  );
};
