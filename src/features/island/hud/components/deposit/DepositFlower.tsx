/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";
import flowerIcon from "assets/icons/flower_token.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "lib/config";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { getFlowerBalance } from "lib/blockchain/DepositFlower";
import { base, baseSepolia } from "viem/chains";
import { DepositAddress } from "./DepositAddress";
import { AcknowledgeConditions } from "./AcknowledgeConditions";
import { DepositFromLinkedWallet } from "./DepositFromLinkedWallet";
import { Button } from "components/ui/Button";
import {
  BASE_MAINNET_NETWORK,
  BASE_TESTNET_NETWORK,
} from "features/game/expansion/components/dailyReward/DailyReward";

const BASE_NETWORK =
  CONFIG.NETWORK === "mainnet" ? BASE_MAINNET_NETWORK : BASE_TESTNET_NETWORK;

export type NetworkOption = {
  value: NetworkName;
  icon: string;
  chainId: number;
};

const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingFlower"]?.depositAddress;

const _success = (state: MachineState) =>
  state.matches("depositingFlowerSuccess");
const _failed = (state: MachineState) =>
  state.matches("depositingFlowerFailed");
const _authToken = (state: AuthMachineState) => state.context.user.rawToken;
const _linkedWallet = (state: MachineState) =>
  state.context.linkedWallet ?? "0xc23Ea4b3fFA70DF89874ff657500000000000000";

export const DepositFlower: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
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

  const selectedNetwork = BASE_NETWORK;

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
      const balance = await getFlowerBalance({
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

    gameService.send("flower.depositStarted", {
      effect: {
        type: "flower.depositStarted",
        chainId: CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id,
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
      <div className="flex items-center gap-3 mb-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="w-6 cursor-pointer"
          onClick={handleBack}
        />
        <Label type="default" icon={flowerIcon}>
          {t("deposit.flower")}
        </Label>
      </div>

      {/* Acknowledge conditions */}
      {!acknowledged && selectedNetwork?.value && (
        <AcknowledgeConditions
          depositAddress={depositAddress}
          setAcknowledged={setAcknowledged}
        />
      )}

      {depositReady && depositType === undefined && (
        <div className="flex flex-col mt-1 justify-center space-y-1">
          <span className="text-xs my-1 ml-1">{t("deposit.from")}</span>
          <Button onClick={() => setDepositType("linked")}>
            {t("deposit.flower.depositFromLinkedWallet")}
          </Button>
          <Button onClick={() => setDepositType("manual")}>
            {t("deposit.flower.otherWallet")}
          </Button>
        </div>
      )}

      {/* Deposit from linked wallet */}
      {depositReady && depositType === "linked" && (
        <DepositFromLinkedWallet
          linkedWallet={linkedWallet}
          depositAddress={depositAddress}
          selectedNetwork={selectedNetwork}
          linkedWalletBalance={balance}
          balanceState={balanceState}
          setManualDeposit={() => setDepositType("manual")}
          fetchBalance={fetchBalance}
          refreshDeposits={refreshDeposits}
          firstLoadComplete={firstLoadComplete}
        />
      )}

      {/* Manual deposit */}
      {depositReady && depositType === "manual" && (
        <DepositAddress
          depositAddress={depositAddress}
          selectedNetwork={selectedNetwork}
          refreshDeposits={refreshDeposits}
          firstLoadComplete={firstLoadComplete}
        />
      )}
    </>
  );
};
