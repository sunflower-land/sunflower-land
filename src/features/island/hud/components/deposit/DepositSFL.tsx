/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";
import sflIcon from "assets/icons/sfl.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "lib/config";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { polygon, polygonAmoy } from "viem/chains";
import { Button } from "components/ui/Button";
import {
  POLYGON_MAINNET_NETWORK,
  POLYGON_TESTNET_NETWORK,
} from "features/game/expansion/components/dailyReward/DailyReward";
import { ButtonPanel } from "components/ui/Panel";
import { formatEther, parseEther } from "viem";
import { GameWallet } from "features/wallet/Wallet";
import { NumberInput } from "components/ui/NumberInput";
import Decimal from "decimal.js-light";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { shortAddress } from "lib/utils/shortAddress";
import { getSFLBalance } from "lib/blockchain/DepositSFL";
import withdrawIcon from "assets/icons/withdraw.png";
import { hasFeatureAccess } from "lib/flags";

const POLYGON_NETWORK =
  CONFIG.NETWORK === "mainnet"
    ? POLYGON_MAINNET_NETWORK
    : POLYGON_TESTNET_NETWORK;

export type NetworkOption = {
  value: NetworkName;
  icon: string;
  chainId: number;
};

const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingSFL"]?.depositAddress;

const _success = (state: MachineState) => state.matches("depositingSFLSuccess");
const _failed = (state: MachineState) => state.matches("depositingSFLFailed");
const _authToken = (state: AuthMachineState) => state.context.user.rawToken;
const _linkedWallet = (state: MachineState) =>
  state.context.linkedWallet ?? "0xc23Ea4b3fFA70DF89874ff657500000000000000";
const _depositingSFLToLinkedWallet = (state: MachineState) =>
  state.matches("depositingSFLFromLinkedWallet");
const _loadingDeposits = (state: MachineState) =>
  state.matches("depositingSFL");
const _pending = (state: MachineState) => state.matches("depositingSFL");
const _deposits = (state: MachineState): ProcessedDeposit[] =>
  state.context.data["depositingSFL"]?.deposits ?? [];

const AcknowledgeConditions: React.FC<{
  depositAddress?: string;
  setAcknowledged: (acknowledged: boolean) => void;
}> = ({ depositAddress, setAcknowledged }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex mb-2 flex-col p-2 pt-0 mt-1 text-xs space-y-2">
        <div className="w-full flex gap-1 ">
          <div className="w-6 flex items-center justify-center">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className="object-contain h-5"
            />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("transaction.migrate.sfl.description")}</span>
          </div>
        </div>
        <div className="w-full flex gap-1">
          <div className="w-6 flex items-center justify-center">
            <img
              src={SUNNYSIDE.icons.arrow_up}
              className="object-contain h-5"
            />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("transaction.migrate.sfl.limit")}</span>
          </div>
        </div>
        <div className="w-full flex gap-1">
          <div className="w-6 flex items-center justify-center">
            <img src={withdrawIcon} className="object-contain w-5" />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("transaction.migrate.sfl.taxFree")}</span>
          </div>
        </div>
        <div className="w-full flex gap-1">
          <div className="w-6 flex items-center justify-center">
            <img
              src={SUNNYSIDE.icons.stopwatch}
              className="object-contain w-5"
            />
          </div>
          <div className="w-[90%] flex items-center">
            <span>{t("deposit.flower.processingTimes")}</span>
          </div>
        </div>
      </div>

      <ButtonPanel
        disabled={!depositAddress}
        className="w-full text-center"
        onClick={() => setAcknowledged(true)}
      >
        <div className="mb-1">
          {!depositAddress
            ? t("deposit.flower.loading")
            : t("deposit.flower.iUnderstand")}
        </div>
      </ButtonPanel>
    </>
  );
};

type ProcessedDeposit = {
  from: string | null;
  value: string;
  transactionHash: string;
  createdAt: number;
};

const DepositHistory: React.FC<{
  selectedNetwork: NetworkOption | undefined;
  refreshDeposits: () => void;
  firstLoadComplete: boolean;
}> = ({ selectedNetwork, firstLoadComplete, refreshDeposits }) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();

  const deposits = useSelector(gameService, _deposits);
  const pending = useSelector(gameService, _pending);

  return (
    <>
      {/* Deposits history */}
      {selectedNetwork?.value && (
        <div className="flex flex-col mt-2">
          <div className="h-[120px] scrollable overflow-y-auto">
            <div className="text-sm pb-2 border-b border-white -px-2">
              <span className="text-sm ml-1">{t("sfl.migrated")}</span>
            </div>
            {firstLoadComplete && deposits.length === 0 && (
              <div className="flex items-center gap-1 border-b border-white -px-2 py-1.5">
                <span className="text-xxs ml-1">
                  {t("deposit.flower.noDeposits")}
                </span>
              </div>
            )}
            {deposits.map((deposit) => (
              <div
                key={deposit.transactionHash}
                className="flex items-center gap-1 border-b border-white -px-2 py-1.5"
              >
                <div>
                  <img
                    src={selectedNetwork.icon}
                    alt="chain logo"
                    className="w-6"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xxs">
                    {new Date(deposit.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xxs">
                    {shortAddress(deposit.from ?? "")}
                  </span>
                </div>
                <div className="flex-col space-y-1">
                  <div className="flex gap-1 mr-2">
                    <span className="text-xxs">{`-${deposit.value}`}</span>
                    <img src={sflIcon} alt="sfl icon" className="w-4" />
                  </div>
                  <div className="flex gap-1 mr-2">
                    <span className="text-xxs">{`+${deposit.value}`}</span>
                    <img src={flowerIcon} alt="flower icon" className="w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        disabled={pending || !selectedNetwork}
        className="w-full text-center mt-2"
        onClick={refreshDeposits}
      >
        {pending ? t("deposit.flower.refreshing") : t("refresh")}
      </Button>
    </>
  );
};

const START_DATE =
  CONFIG.NETWORK === "mainnet"
    ? Date.UTC(2025, 7, 27) // 27 August 2025 (First 1000 available on 28th)
    : Date.UTC(2025, 7, 25); // 25 August 2025 (First 1000 available on 26th)

const DepositFromLinkedWallet: React.FC<{
  depositAddress: string;
  linkedWallet: string;
  selectedNetwork: NetworkOption;
  linkedWalletBalance: bigint;
  balanceState: "loading" | "loaded" | "error";
  fetchBalance: (selectedNetwork: NetworkOption) => Promise<void>;
  refreshDeposits: () => void;
  firstLoadComplete: boolean;
}> = ({
  depositAddress,
  linkedWallet,
  selectedNetwork,
  linkedWalletBalance,
  balanceState,
  fetchBalance,
  refreshDeposits,
  firstLoadComplete,
}) => {
  const { t } = useTranslation();
  const { gameService } = useContext(Context);
  const [amount, setAmount] = useState<Decimal>(new Decimal(0));
  const deposits = useSelector(gameService, _deposits);

  const daysElapsed = Math.max(
    Math.floor((Date.now() - START_DATE) / (1000 * 60 * 60 * 24)),
    0,
  );

  const previousDeposits = deposits.reduce((acc, deposit) => {
    return acc.plus(new Decimal(deposit.value));
  }, new Decimal(0));

  // Day 1 is 1000, day 2 is 3000, day 3 is 6000, etc.
  let limit = new Decimal((1000 * (daysElapsed * (daysElapsed + 1))) / 2);
  // Limit used for testing
  if (
    limit.lte(0) &&
    hasFeatureAccess(gameService.getSnapshot().context.state, "DEPOSIT_SFL")
  ) {
    limit = new Decimal(50);
  }

  let maxAmount = limit.minus(new Decimal(previousDeposits));
  if (maxAmount.lt(0)) maxAmount = new Decimal(0);

  const depositingSFLFromLinkedWallet = useSelector(
    gameService,
    _depositingSFLToLinkedWallet,
  );
  const loadingDeposits = useSelector(gameService, _loadingDeposits);

  useOnMachineTransition(
    gameService,
    "depositingSFLFromLinkedWallet",
    "playing",
    async () => {
      setAmount(new Decimal(0));
      await fetchBalance(selectedNetwork);
    },
  );

  const handleAmountChange = (value: Decimal) => {
    setAmount(value);
  };

  const handleDeposit = async () => {
    gameService.send("DEPOSIT_SFL_FROM_LINKED_WALLET", {
      amount: BigInt(parseEther(amount.toString())),
      depositAddress: depositAddress as `0x${string}`,
      selectedNetwork,
    });
  };

  const getButtonText = () => {
    if (depositingSFLFromLinkedWallet) {
      return t("deposit.flower.sendingTransaction");
    }
    if (loadingDeposits) {
      return t("deposit.flower.refreshing");
    }

    return t("transaction.migrate.sfl");
  };

  return (
    <div className="flex flex-col mt-1">
      <GameWallet action="depositSFL">
        <div className="flex flex-col my-3 justify-center">
          {balanceState === "loading" && (
            <div className="flex justify-between w-full p-2 pt-0">
              <span>{`${t("deposit.loadingBalance")}`}</span>
            </div>
          )}
          {balanceState === "error" && (
            <div className="flex justify-between w-full p-2 pt-0">
              <span>{`${t("deposit.balanceLoadingError")}`}</span>
            </div>
          )}
          {balanceState === "loaded" && (
            <div className="flex justify-between w-full p-2 pt-0">
              <span>{`${t("available")}: `}</span>
              <div className="flex items-center gap-1">
                <span>{`${formatEther(linkedWalletBalance)}`}</span>
                <img src={sflIcon} className="object-contain w-4" />
              </div>
            </div>
          )}
          <div className="relative">
            <NumberInput
              value={amount}
              maxDecimalPlaces={18}
              isOutOfRange={
                amount.gt(maxAmount) ||
                amount.gt(new Decimal(formatEther(linkedWalletBalance)))
              }
              className="p-1 h-12"
              onValueChange={(value) => handleAmountChange(value)}
            />
            <Button
              className="absolute top-[51%] right-3 -translate-y-1/2 h-7 w-12"
              onClick={() =>
                maxAmount.gt(new Decimal(formatEther(linkedWalletBalance)))
                  ? setAmount(new Decimal(formatEther(linkedWalletBalance)))
                  : setAmount(maxAmount)
              }
            >
              <span className="text-xxs">{`${t("max")}`}</span>
            </Button>
          </div>
          <div className="flex justify-end w-full mt-1 pr-1">
            <span className="text-xxs">
              {t("transaction.migrate.sfl.maxAmount", {
                maxAmount: maxAmount.toString(),
              })}
            </span>
          </div>
        </div>
        <ButtonPanel
          disabled={
            !depositAddress ||
            balanceState === "loading" ||
            balanceState === "error" ||
            amount.lte(0) ||
            amount.gt(maxAmount) ||
            amount.gt(new Decimal(formatEther(linkedWalletBalance))) ||
            depositingSFLFromLinkedWallet ||
            loadingDeposits
          }
          className="w-full text-center mb-2"
          onClick={handleDeposit}
        >
          <div className="mb-1">{getButtonText()}</div>
        </ButtonPanel>
        <DepositHistory
          selectedNetwork={selectedNetwork}
          refreshDeposits={refreshDeposits}
          firstLoadComplete={firstLoadComplete}
        />
      </GameWallet>
    </div>
  );
};

export const DepositSFL: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const { t } = useTranslation();

  const [balanceState, setBalanceState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [balance, setBalance] = useState<bigint>(0n);
  const [acknowledged, setAcknowledged] = useState(false);
  const [depositType, setDepositType] = useState<"manual" | "linked">();
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  const depositAddress = useSelector(gameService, _depositAddress);
  const success = useSelector(gameService, _success);
  const failed = useSelector(gameService, _failed);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const authToken = useSelector(authService, _authToken);

  const selectedNetwork = POLYGON_NETWORK;

  useEffect(() => {
    fetchBalance(selectedNetwork);
    refreshDeposits();
  }, []);

  useEffect(() => {
    if (success || failed) {
      gameService.send("CONTINUE");
    }
  }, [success, failed]);

  const fetchBalance = async (selectedNetwork: NetworkOption) => {
    setBalanceState("loading");
    try {
      const balance = await getSFLBalance({
        account: linkedWallet as `0x${string}`,
        selectedNetwork,
      });
      setBalance(balance);
      setBalanceState("loaded");
    } catch (error) {
      setBalanceState("error");
    }
  };

  const refreshDeposits = async () => {
    if (!firstLoadComplete) {
      setFirstLoadComplete(true);
    }

    gameService.send("sfl.depositStarted", {
      effect: {
        type: "sfl.depositStarted",
        chainId: CONFIG.NETWORK === "mainnet" ? polygon.id : polygonAmoy.id,
      },
      authToken,
    });
  };

  const handleBack = () => {
    if (depositType !== undefined) {
      setDepositType(undefined);
    } else {
      onClose();
    }
  };

  const depositReady = acknowledged && selectedNetwork?.value && depositAddress;

  return (
    <>
      <div className="flex items-center ml-2 gap-3 my-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="w-6 cursor-pointer"
          onClick={handleBack}
        />
        <Label type="default" icon={sflIcon}>
          {t("transaction.migrate.sfl")}
        </Label>
      </div>

      {/* Acknowledge conditions */}
      {!acknowledged && selectedNetwork?.value && (
        <AcknowledgeConditions
          depositAddress={depositAddress}
          setAcknowledged={setAcknowledged}
        />
      )}

      {/* Deposit from linked wallet */}
      {depositReady && (
        <DepositFromLinkedWallet
          linkedWallet={linkedWallet}
          depositAddress={depositAddress}
          selectedNetwork={selectedNetwork}
          linkedWalletBalance={balance}
          balanceState={balanceState}
          fetchBalance={fetchBalance}
          refreshDeposits={refreshDeposits}
          firstLoadComplete={firstLoadComplete}
        />
      )}
    </>
  );
};
