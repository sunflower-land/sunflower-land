import React, { useContext, useState } from "react";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

import {
  getCurrentSeason,
  getSeasonalBanner,
  SEASONS,
} from "features/game/types/seasons";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import { getBumpkinLevel } from "features/game/lib/level";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { syncProgress } from "lib/blockchain/Game";
import { useWaitForTransactionReceipt } from "wagmi";
import {
  DEADLINE_MS,
  loadActiveTxHash,
  TransactionName,
} from "features/game/types/transactions";
import { GameWallet } from "features/wallet/Wallet";
import { ResizableBar } from "components/ui/ProgressBar";

import walletIcon from "assets/icons/wallet.png";
import lockIcon from "assets/icons/lock.png";

import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TransactionCountdown: React.FC = () => {
  const { gameService } = useContext(Context);

  const [showTransaction, setShowTransaction] = useState(false);

  const transaction = gameService.state.context.state.transaction;

  // Show expired = Button to refresh

  const tx = loadActiveTxHash({
    event: transaction?.event as TransactionName,
    sessionId: gameService.state.context.sessionId as string,
  });

  if (!transaction) return null;

  return (
    <>
      <Modal show={showTransaction} onHide={() => setShowTransaction(false)}>
        <Panel>
          <Transaction onClose={() => setShowTransaction(false)} />
        </Panel>
      </Modal>
      <ButtonPanel
        onClick={() => setShowTransaction(true)}
        className="flex justify-center"
        id="emblem-airdrop"
      >
        <div>
          <div className="h-6 flex justify-between">
            <Label
              type={!tx ? "danger" : "default"}
              className="ml-1 mr-1"
              icon={walletIcon}
            >
              {`Transaction`}
            </Label>
          </div>
          {!tx && <span className="text-sm">Not submitted</span>}
          {tx && <Loading />}
        </div>
      </ButtonPanel>
    </>
  );
};

interface Props {
  onClose: () => void;
}

export const Transaction: React.FC<Props> = ({ onClose }) => {
  return (
    <>
      <GameWallet action="sync">
        <TransactionProgress onClose={onClose} />
      </GameWallet>
    </>
  );
};

export const TransactionProgress: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const transaction = gameService.state.context.state.transaction;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const tx = loadActiveTxHash({
    event: transaction?.event as TransactionName,
    sessionId: gameService.state.context.sessionId as string,
  });

  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: tx?.hash as `0x${string}`,
  });

  const end = useCountdown((transaction?.createdAt ?? 0) + DEADLINE_MS);

  if (!transaction) return null;

  const submit = async () => {
    setIsSubmitting(true);

    try {
      if (transaction.event === "transaction.progressSynced") {
        await syncProgress(transaction.data.params);
      }
    } catch (e) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const reload = () => {
    gameService.send("REFRESH");
    onClose();
  };

  if (isSuccess) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={walletIcon} type="success" className="-ml-1">
              Success
            </Label>
          </div>
          <p className="text-sm mb-2">
            Congratulations, your transaction was secured
          </p>
        </div>
        <Button onClick={reload}>Continue</Button>
      </>
    );
  }

  if (tx || isSubmitting) {
    return (
      <>
        <div className="p-2">
          <Label icon={lockIcon} type="default" className="mb-2">
            Transaction in progress
          </Label>
          <Loading />
          {/* <p>{tx?.hash}</p>
          <p>
            {JSON.stringify({
              isLoading,
              isSuccess,
              isError,
            })}
          </p> */}
          {/* <Button onClick={submit}>Submit</Button> */}
        </div>
      </>
    );
  }

  if (Date.now() > (transaction?.createdAt ?? 0) + DEADLINE_MS) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              Transaction failed
            </Label>
          </div>
          <p className="text-sm mb-2">
            Looks like there was an issue with your previous transaction.
          </p>
        </div>
        <Button onClick={reload}>Continue</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <Label icon={lockIcon} type="danger" className="-ml-1">
            Transaction in progress
          </Label>
          <TimerDisplay time={end} />
        </div>
        <p className="text-sm mb-2">
          You have a transaction which was already initiated. It looks like
          there was an issue.
        </p>
        <p>{transaction.event}</p>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Close
        </Button>
        <Button onClick={submit} className="relative">
          <span>{t("retry")}</span>
          <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
        </Button>
      </div>
    </>
  );
};
