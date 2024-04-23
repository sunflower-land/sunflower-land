import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DepositModal } from "features/goblins/bank/components/Deposit";
import { useSelector } from "@xstate/react";
import { getBumpkinLevel } from "features/game/lib/level";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { DepositArgs } from "lib/blockchain/Deposit";
import { Modal } from "components/ui/Modal";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { AddSFLOptions } from "../../AddSFL";
import { DequipBumpkin } from "./DequipBumpkin";
import { Panel } from "components/ui/Panel";
import { GameWallet } from "features/wallet/Wallet";
import { TransferAccount } from "./TransferAccount";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";
import { PIXEL_SCALE } from "features/game/lib/constants";

const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _xp = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

export const BlockchainSettings: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(GameContext);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const [view, setView] = useState<
    "settings" | "transfer" | "dequip" | "swapSFL"
  >("settings");
  const { openModal } = useContext(ModalContext);

  const farmAddress = useSelector(gameService, _farmAddress);
  const isFullUser = farmAddress !== undefined;
  const xp = useSelector(gameService, _xp);

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleDepositModal = () => {
    setShowDepositModal(true);
  };

  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
  };

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha, blockBucks: 0 });
    setShowCaptcha(false);
  };

  const Content = () => {
    if (view === "dequip") {
      return (
        <GameWallet action="dequip">
          <div
            className="grow mb-3 text-lg"
            style={{ margin: "0 auto", display: "table" }}
          >
            {t("dequipper.dequip")}
          </div>
          <DequipBumpkin />
        </GameWallet>
      );
    }

    if (view === "transfer") {
      return (
        <GameWallet action="transferAccount">
          <TransferAccount />
        </GameWallet>
      );
    }

    if (view === "swapSFL") {
      return (
        <GameWallet action="purchase">
          <AddSFLOptions />
        </GameWallet>
      );
    }

    return (
      <>
        <Button onClick={handleDepositModal} className="mb-2">
          <span>{t("deposit")}</span>
        </Button>
        <Button onClick={storeOnChain} className="mb-2">
          <span>{t("gameOptions.blockchainSettings.storeOnChain")}</span>
        </Button>
        <Button onClick={() => setView("swapSFL")} className="mb-2">
          <span>{t("gameOptions.blockchainSettings.swapMaticForSFL")}</span>
        </Button>
        <Button className="mb-2 capitalize" onClick={() => setView("dequip")}>
          {t("dequipper.dequip")}
        </Button>
        {isFullUser && (
          <>
            <Button className="mb-2" onClick={() => setView("transfer")}>
              {t("gameOptions.blockchainSettings.transferOwnership")}
            </Button>
          </>
        )}
        <DepositModal
          farmAddress={farmAddress}
          canDeposit={getBumpkinLevel(xp) >= 3}
          handleClose={() => setShowDepositModal(false)}
          handleDeposit={handleDeposit}
          showDepositModal={showDepositModal}
        />
      </>
    );
  };

  {
    showCaptcha && (
      <Modal show={showCaptcha} onHide={() => setShowCaptcha(false)}>
        <Panel>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            alt="Close Logout Confirmation Modal"
            onClick={() => setShowCaptcha(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />

          <CloudFlareCaptcha onDone={onCaptchaSolved} action="sync" />
        </Panel>
      </Modal>
    );
  }

  return Content();
};
