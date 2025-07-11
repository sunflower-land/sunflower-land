import React, { useContext, useEffect, useRef, useState } from "react";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import { Context } from "features/game/GameProvider";

import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import {
  DEADLINE_BUFFER_MS,
  DEADLINE_MS,
  FlowerWithdrawnTransaction,
  GameTransaction,
  loadActiveTxHash,
  ONCHAIN_TRANSACTIONS,
  TransactionName,
} from "features/game/types/transactions";
import { GameWallet, WalletAction } from "features/wallet/Wallet";

import walletIcon from "assets/icons/wallet.png";
import lockIcon from "assets/icons/lock.png";

import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { GaslessWidget } from "features/announcements/AnnouncementWidgets";

const _transaction = (state: MachineState) => state.context.state.transaction;
const compareTransaction = (prev?: GameTransaction, next?: GameTransaction) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};
export const TransactionCountdown: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showTransaction, setShowTransaction] = useState(false);
  const hasInitialized = useRef(false);

  const transaction = useSelector(
    gameService,
    _transaction,
    compareTransaction,
  );

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    // Only show transaction modal if we have a transaction and we've initialized
    if (transaction) {
      setShowTransaction(true);
    }
  }, [transaction]);

  if (!transaction) return null;

  return (
    <>
      <Modal show={showTransaction} onHide={() => setShowTransaction(false)}>
        <Panel>
          <Transaction onClose={() => setShowTransaction(false)} />
        </Panel>
        <GaslessWidget />
      </Modal>
      <ButtonPanel onClick={() => setShowTransaction(true)} className="flex">
        <TransactionWidget
          transaction={transaction}
          onOpen={() => setShowTransaction(true)}
        />
      </ButtonPanel>
    </>
  );
};

const TransactionWidget: React.FC<{
  transaction: GameTransaction;
  onOpen: () => void;
}> = ({ transaction, onOpen }) => {
  const { gameService } = useContext(Context);
  const { isConnected } = useAccount();
  const { t } = useAppTranslation();

  const [_, setRender] = useState(0);

  const tx = loadActiveTxHash({
    event: transaction?.event as TransactionName,
    ...(transaction?.event === "transaction.flowerWithdrawn"
      ? { withdrawId: transaction.data.params.withdrawId }
      : { sessionId: gameService.getSnapshot().context.sessionId as string }),
  });

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash: tx?.hash as `0x${string}`,
  });

  useEffect(() => {
    if (isSuccess) {
      onOpen();
    }
  }, [isSuccess]);

  // Keeps widget in sync with transaction changes
  useEffect(() => {
    const interval = setInterval(() => setRender((r) => r + 1), 1000);

    () => clearInterval(interval);
  }, []);

  const timedOut =
    Date.now() >
    (transaction.createdAt ?? 0) + DEADLINE_MS + DEADLINE_BUFFER_MS;

  if (timedOut) {
    return (
      <div id="testing portal">
        <div className="h-6 flex justify-between">
          <Label type={"danger"} className="ml-1 mr-1" icon={walletIcon}>
            {t("transaction")}
          </Label>
        </div>
        <span className="text-sm">{t("transaction.timedOut")}</span>
      </div>
    );
  }

  const isExpired = Date.now() > (transaction.createdAt ?? 0) + DEADLINE_MS;

  if (isExpired) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"danger"} className="ml-1 mr-1" icon={walletIcon}>
            {t("transaction")}
          </Label>
        </div>
        <span className="text-sm">{t("transaction.expired")}</span>
      </div>
    );
  }

  if (!tx) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"default"} className="ml-1 mr-1" icon={walletIcon}>
            {t("transaction")}
          </Label>
        </div>
        <span className="text-sm">{t("transaction.notSubmitted")}</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"default"} className="ml-1 mr-1" icon={walletIcon}>
            {t("transaction")}
          </Label>
        </div>
        <Loading />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"success"} className="ml-1 mr-1" icon={walletIcon}>
            {t("transaction")}
          </Label>
        </div>
        <span>{t("transaction.success")}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"danger"} className="ml-1 mr-1" icon={walletIcon}>
            {t("transaction")}
          </Label>
        </div>
        <span className="text-sm">{t("transaction.error")}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="h-6 flex justify-between">
        <Label type={"default"} className="ml-1 mr-1" icon={walletIcon}>
          {t("transaction")}
        </Label>
      </div>
      <Loading />
    </div>
  );
};

const WALLET_ACTIONS: Record<TransactionName, WalletAction> = {
  "transaction.flowerWithdrawn": "withdrawFlower",
  "transaction.itemsWithdrawn": "withdrawItems",
  "transaction.wearablesWithdrawn": "withdrawItems",
  "transaction.budWithdrawn": "withdrawItems",
  "transaction.bidMinted": "sync",
  "transaction.listingPurchased": "marketplace",
  "transaction.offerAccepted": "marketplace",
  "transaction.progressSynced": "sync",
};

interface Props {
  onClose?: () => void;
  isBlocked?: boolean;
}

const _isTransacting = (state: MachineState) => state.matches("transacting");

export const Transaction: React.FC<Props> = ({ onClose, isBlocked }) => {
  const { gameService } = useContext(Context);
  const isTransacting = useSelector(gameService, _isTransacting);
  const { t } = useAppTranslation();

  const transaction = useSelector(gameService, _transaction);

  if (isTransacting) {
    return (
      <div className="p-2">
        <Label type="default" className="mb-2" icon={walletIcon}>
          {t("transaction.inProgress")}
        </Label>
        <Loading text={t("transaction.preparing")} />
      </div>
    );
  }

  if (!transaction) return null;

  const walletAction = WALLET_ACTIONS[transaction.event];

  return (
    <>
      <GameWallet action={walletAction}>
        <TransactionProgress isBlocked={isBlocked} onClose={onClose} />
      </GameWallet>
    </>
  );
};

const EVENT_TO_NAME: Record<TransactionName, string> = {
  "transaction.bidMinted": "Mint auction item",
  "transaction.budWithdrawn": "Withdraw bud",
  "transaction.itemsWithdrawn": "Withdraw items",
  "transaction.progressSynced": "Store on chain",
  "transaction.wearablesWithdrawn": "Withdraw wearables",
  "transaction.offerAccepted": "Accept offer",
  "transaction.listingPurchased": "Purchase listing",
  "transaction.flowerWithdrawn": "Withdraw flower",
};

const _farmId = (state: MachineState) => state.context.farmId;

export const TransactionProgress: React.FC<Props> = ({
  onClose,
  isBlocked,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [error, setError] = useState<string>();
  const [showError, setShowError] = useState<boolean>();

  const farmId = useSelector(gameService, _farmId);
  const transaction = useSelector(gameService, _transaction);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getExpiringTimes = () => {
    const txType = transaction?.event;

    if (txType === "transaction.flowerWithdrawn") {
      return {
        expiresAt: (transaction?.createdAt ?? 0) + DEADLINE_MS,
        timedOutAt: (transaction?.createdAt ?? 0) + DEADLINE_MS,
      };
    }

    return {
      expiresAt: (transaction?.createdAt ?? 0) + DEADLINE_MS,
      timedOutAt:
        (transaction?.createdAt ?? 0) + DEADLINE_MS + DEADLINE_BUFFER_MS,
    };
  };

  const tx = loadActiveTxHash({
    event: transaction?.event as TransactionName,
    ...(transaction?.event === "transaction.flowerWithdrawn"
      ? { withdrawId: transaction.data.params.withdrawId }
      : { sessionId: gameService.getSnapshot().context.sessionId as string }),
  });

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash: tx?.hash as `0x${string}`,
  });

  const { expiresAt, timedOutAt } = getExpiringTimes();

  const expired = useCountdown(expiresAt);
  const timedOut = useCountdown(timedOutAt);

  if (!transaction) return null;

  const submit = async () => {
    setIsSubmitting(true);

    try {
      const handler = ONCHAIN_TRANSACTIONS[transaction.event];
      await handler(transaction.data as any);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setError((e as any)?.shortMessage ?? "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshWithdraw = () => {
    const flowerTransaction = transaction as FlowerWithdrawnTransaction;

    gameService.send("TRANSACT", {
      transaction: "transaction.flowerWithdrawn",
      request: {
        farmId,
        effect: {
          type: "withdraw.flower",
          amount: flowerTransaction.data.amount,
        },
      },
    });

    onClose?.();
  };

  const reload = () => {
    gameService.send("REFRESH");
    if (onClose) {
      onClose();
    }
  };

  const isFlowerWithdraw = transaction.event === "transaction.flowerWithdrawn";

  if (isSuccess) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={walletIcon} type="success" className="-ml-1">
              {t("transaction.success")}
            </Label>
          </div>
          <p className="text-sm mb-2">{t("transaction.success.message")}</p>
        </div>
        <Button onClick={reload}>{t("continue")}</Button>
      </>
    );
  }

  const isTimedOut =
    Date.now() >
    (transaction?.createdAt ?? 0) + DEADLINE_MS + DEADLINE_BUFFER_MS;

  const isExpired = Date.now() > (transaction?.createdAt ?? 0) + DEADLINE_MS;

  if (isFlowerWithdraw && (isTimedOut || isExpired)) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              {t("transaction.expired")}
            </Label>
          </div>
          <p className="text-sm mb-2">{t("transaction.refresh.message")}</p>
        </div>
        <Button onClick={refreshWithdraw}>{t("refresh")}</Button>
      </>
    );
  }

  if (isTimedOut) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              {t("transaction.cleared")}
            </Label>
          </div>
          <p className="text-sm mb-2">{t("transaction.cleared.message")}</p>
        </div>
        <Button onClick={reload}> {t("continue")}</Button>
      </>
    );
  }

  if (isExpired) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              {t("transaction.expired")}
            </Label>
            <TimerDisplay time={timedOut} />
          </div>
          <p className="text-sm mb-2">{t("transaction.expired.message")}</p>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2 flex-wrap">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              {EVENT_TO_NAME[transaction.event]} {t("error")}
            </Label>
            <TimerDisplay time={expired} />
          </div>
          <p className="text-sm mb-2">{t("transaction.error.message")}</p>
        </div>
        <div className="flex">
          {onClose && (
            <Button className="mr-1" onClick={onClose}>
              {t("close")}
            </Button>
          )}

          <Button onClick={submit} className="relative">
            <span>{t("retry")}</span>
            <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
          </Button>
        </div>
      </>
    );
  }

  if (tx || isSubmitting) {
    return (
      <>
        <div className="p-2">
          <Label icon={lockIcon} type="default" className="mb-2">
            {t("transaction.inProgress")}
          </Label>
          <Loading />
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label
            icon={lockIcon}
            type={error ? "danger" : "default"}
            className="-ml-1"
          >
            {t("transaction.waiting", {
              name: EVENT_TO_NAME[transaction.event],
            })}
          </Label>
          <TimerDisplay time={expired} />
        </div>

        {error && (
          <div className="mb-2">
            <span className="text-sm">
              {t("transaction.somethingWentWrong")}
            </span>
            {showError ? (
              <p className="text-xs mt-2">{error}</p>
            ) : (
              <span
                onClick={() => setShowError(true)}
                className="text-xs cursor-pointer underline ml-2"
              >
                {t("read.more")}
              </span>
            )}
          </div>
        )}

        <p className="text-sm mb-2">
          {isBlocked ? t("transaction.blocked") : t("transaction.ready")}
        </p>
      </div>
      <div className="flex">
        {onClose && (
          <Button className="mr-1" onClick={onClose}>
            {t("close")}
          </Button>
        )}

        <Button onClick={submit} className="relative">
          <span>{t("submit")}</span>
          <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
        </Button>
      </div>
    </>
  );
};
