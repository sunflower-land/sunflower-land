import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { isAddress } from "web3-utils";
import { Modal } from "react-bootstrap";

import transferring from "assets/npcs/minting.gif";
import farmImg from "assets/brand/nft.png";

import * as AuthProvider from "features/auth/lib/Provider";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { transferAccount } from "features/farming/hud/actions/transfer";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { wallet } from "lib/blockchain/wallet";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferAccount: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);

  const [receiver, setReceiver] = useState({ address: "" });
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );

  const { t } = useAppTranslation();

  const transfer = async () => {
    setState("loading");
    try {
      await transferAccount({
        receiver: receiver.address,
        farmId: gameService.state.context.farmId,
        token: authState.context.user.rawToken as string,
        account: wallet.myAccount as string,
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
          {`Your Account #${gameService.state.context.farmId} has been transferred to: ${receiver.address}`}
          !
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
        <span>Transferring your farm!</span>
        <img src={transferring} className="w-1/2 mt-2" />
        <span className="text-xs mt-4 underline mb-1">
          Do not refresh this browser
        </span>
      </div>
    );
  }

  const Content = () => {
    const { t } = useAppTranslation();
    return (
      <div className="p-2">
        <p>Transfer your account</p>
        <p className="text-xs mt-2">Wallet address:</p>
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
          <span className="text-xs mt-2">
            Please ensure that the address you provided is on the Polygon
            Blockchain, is correct and is owned by you. There is no recovery
            from incorrect addresses.
          </span>
        </div>
        <Button
          className="mt-2"
          onClick={transfer}
          disabled={!isAddress(receiver.address.toLowerCase())}
        >
          Transfer
        </Button>
        <a
          href="https://docs.sunflower-land.com/support/faq#how-can-i-send-my-account-to-a-new-wallet"
          className="underline text-xxs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("readMore")}
        </a>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
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
