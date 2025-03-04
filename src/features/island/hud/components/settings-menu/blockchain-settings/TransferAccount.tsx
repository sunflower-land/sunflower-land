import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { isAddress } from "web3-utils";

import farmImg from "assets/brand/nft.png";

import * as AuthProvider from "features/auth/lib/Provider";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import { transferAccount } from "features/farming/hud/actions/transfer";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { wallet } from "lib/blockchain/wallet";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
const transferring = SUNNYSIDE.npcs.minting;
const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;
const _nftId = (state: MachineState) => state.context.nftId;
export const TransferAccount: React.FC = () => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);
  const rawToken = useSelector(authService, _rawToken);
  const { gameService } = useContext(Context);
  const nftId = useSelector(gameService, _nftId);

  const [receiver, setReceiver] = useState({ address: "" });
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle",
  );

  if (!nftId) {
    return null;
  }

  const transfer = async () => {
    setState("loading");
    try {
      await transferAccount({
        receiver: receiver.address,
        farmId: gameService.state.context.farmId,
        token: rawToken as string,
        account: wallet.getAccount() as string,
        nftId,
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
          {t("transfer.Account", {
            farmID: gameService.state.context.farmId,
            receivingAddress: receiver.address,
          })}
        </span>
        <Button onClick={handleContinue}>{t("continue")}</Button>
      </div>
    );
  }

  if (state === "error") {
    return <SomethingWentWrong />;
  }

  if (state === "loading") {
    return (
      <div className="flex flex-col text-center items-center p-2">
        <span>{t("transfer.Farm")}</span>
        <img src={transferring} className="w-1/2 mt-2" />
        <span className="text-xs mt-4 underline mb-1">
          {t("transfer.Refresh")}
        </span>
      </div>
    );
  }

  return (
    <div className="p-2">
      <p>{t("transfer.account")}</p>
      <p className="text-xs mt-2">{t("transfer.address")}</p>
      <input
        type="text"
        name="farmId"
        className="text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2"
        value={receiver.address}
        onChange={(e) => setReceiver({ address: e.target.value })}
      />
      <div className="flex items-start">
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          className="h-6 pt-2 pr-2"
        />
        <span className="text-xs mt-2">{t("transfer.sure.address")}</span>
      </div>
      <Button
        className="mt-2"
        onClick={transfer}
        disabled={!isAddress(receiver.address.toLowerCase())}
      >
        {t("transfer")}
      </Button>
      <a
        href="https://docs.sunflower-land.com/support/faq#how-can-i-send-my-account-to-a-new-wallet"
        className="underline text-xxs"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("read.more")}
      </a>
    </div>
  );
};
