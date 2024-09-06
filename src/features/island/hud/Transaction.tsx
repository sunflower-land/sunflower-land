import React, { useContext, useEffect, useState } from "react";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import { Context } from "features/game/GameProvider";

import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { useAccount, useWaitForTransactionReceipt, WagmiProvider } from "wagmi";
import {
  DEADLINE_MS,
  GameTransaction,
  loadActiveTxHash,
  ONCHAIN_TRANSACTIONS,
  TransactionName,
} from "features/game/types/transactions";
import { GameWallet, queryClient } from "features/wallet/Wallet";

import walletIcon from "assets/icons/wallet.png";
import lockIcon from "assets/icons/lock.png";

import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { wallet } from "lib/blockchain/wallet";
import { config } from "features/wallet/WalletProvider";
import { QueryClientProvider } from "@tanstack/react-query";

const _transaction = (state: MachineState) => state.context.state.transaction;

export const TransactionCountdown: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showTransaction, setShowTransaction] = useState(false);

  const transaction = useSelector(gameService, _transaction);

  useEffect(() => {
    // Whenever something with transaction changes - pop up
    setShowTransaction(true);
  }, [transaction]);

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
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <TransactionWidget
              transaction={transaction}
              onOpen={() => setShowTransaction(true)}
            />
          </QueryClientProvider>
        </WagmiProvider>
      </ButtonPanel>
    </>
  );
};

const TransactionWidget: React.FC<{
  transaction: GameTransaction;
  onOpen: () => void;
}> = ({ transaction, onOpen }) => {
  const { gameService } = useContext(Context);
  const { isConnected, address } = useAccount();

  console.log({ isConnected });
  const tx = loadActiveTxHash({
    event: transaction?.event as TransactionName,
    sessionId: gameService.state.context.sessionId as string,
  });

  const { isSuccess, isError, isLoading } = useWaitForTransactionReceipt({
    hash: tx?.hash as `0x${string}`,
  });

  useEffect(() => {
    if (isSuccess) {
      onOpen();
    }
  }, [isSuccess]);

  console.log({ isSuccess, isError, isLoading });

  const timedOut = Date.now() > (transaction.createdAt ?? 0) + DEADLINE_MS;

  if (timedOut) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"danger"} className="ml-1 mr-1" icon={walletIcon}>
            {`Transaction`}
          </Label>
        </div>
        <span className="text-sm">Timed out</span>
      </div>
    );
  }

  if (!tx) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"default"} className="ml-1 mr-1" icon={walletIcon}>
            {`Transaction`}
          </Label>
        </div>
        <span className="text-sm">Not submitted</span>
      </div>
    );
  }

  // Is not connected to game wallet?
  const test = wallet.getAccount();
  console.log({ isConnected, address, test });

  if (!isConnected) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"default"} className="ml-1 mr-1" icon={walletIcon}>
            {`Transaction`}
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
            {`Transaction`}
          </Label>
        </div>
        <span>Success</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="h-6 flex justify-between">
          <Label type={"danger"} className="ml-1 mr-1" icon={walletIcon}>
            {`Transaction`}
          </Label>
        </div>
        <span className="text-sm">Error</span>
      </div>
    );
  }

  return (
    <div>
      <div className="h-6 flex justify-between">
        <Label type={"default"} className="ml-1 mr-1" icon={walletIcon}>
          {`Transaction`}
        </Label>
      </div>
      <Loading />
    </div>
  );
};

interface Props {
  onClose?: () => void;
}

const _isTransacting = (state: MachineState) => state.matches("transacting");

export const Transaction: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const isTransacting = useSelector(gameService, _isTransacting);

  if (isTransacting) {
    return (
      <div className="p-2">
        <Label type="default" className="mb-2" icon={walletIcon}>
          Transaction in progress
        </Label>
        <Loading text="Preparing transaction" />
      </div>
    );
  }

  return (
    <>
      <GameWallet action="sync">
        <TransactionProgress onClose={onClose} />
      </GameWallet>
    </>
  );
};

const EVENT_TO_NAME: Record<TransactionName, string> = {
  "transaction.bidMinted": "Mint auction item",
  "transaction.budWithdrawn": "Withdraw bud",
  "transaction.itemsWithdrawn": "Withdraw items",
  "transaction.progressSynced": "Store on chain",
  "transaction.sflWithdrawn": "Withdraw SFL",
  "transaction.wearablesWithdrawn": "Withdraw wearables",
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

  const { isSuccess, isError, isLoading } = useWaitForTransactionReceipt({
    hash: tx?.hash as `0x${string}`,
  });

  const end = useCountdown((transaction?.createdAt ?? 0) + DEADLINE_MS);

  if (!transaction) return null;

  const submit = async () => {
    setIsSubmitting(true);

    try {
      const handler = ONCHAIN_TRANSACTIONS[transaction.event];
      await handler(transaction.data as any);
    } catch (e) {
      console.log({ error: e });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reload = () => {
    gameService.send("REFRESH");
    if (onClose) {
      onClose();
    }
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

  if (Date.now() > (transaction?.createdAt ?? 0) + DEADLINE_MS) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              Transaction timed out
            </Label>
          </div>
          <p className="text-sm mb-2">Looks like your transaction timed out.</p>
        </div>
        <Button onClick={reload}>Continue</Button>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2 flex-wrap">
            <Label icon={lockIcon} type="danger" className="-ml-1">
              {EVENT_TO_NAME[transaction.event]} error
            </Label>
            <TimerDisplay time={end} />
          </div>
          <p className="text-sm mb-2">Looks like something went wrong.</p>
        </div>
        <div className="flex">
          {onClose && (
            <Button className="mr-1" onClick={onClose}>
              Close
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
        <Button onClick={onClose}>Close</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label icon={lockIcon} type="default" className="-ml-1">
            {EVENT_TO_NAME[transaction.event]} in progress
          </Label>
          <TimerDisplay time={end} />
        </div>
        <p className="text-sm mb-2">You have a transaction ready to submit.</p>
      </div>
      <div className="flex">
        {onClose && (
          <Button className="mr-1" onClick={onClose}>
            Close
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
