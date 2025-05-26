/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";
import baseIcon from "assets/icons/chains/base.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "lib/config";
import { DropdownPanel } from "components/ui/DropdownPanel";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { getFlowerBalance } from "lib/blockchain/DepositFlower";
import { base, baseSepolia } from "viem/chains";
import { GameWallet } from "features/wallet/Wallet";
import { WalletContext } from "features/wallet/WalletProvider";
import { DepositHistory } from "./DepositHistory";
import { DepositAddress } from "./DepositAddress";
import { AcknowledgeConditions } from "./AcknowledgeConditions";
import { DepositFromLinkedWallet } from "./DepositFromLinkedWallet";

export type NetworkOption = {
  value: NetworkName;
  icon: string;
  chainId: number;
};

const MAINNET_NETWORKS: NetworkOption[] = [
  {
    value: "Base",
    icon: baseIcon,
    chainId: base.id,
  },
];

const TESTNET_NETWORKS: NetworkOption[] = [
  {
    value: "Base Sepolia",
    icon: baseIcon,
    chainId: baseSepolia.id,
  },
];

// Select appropriate network options based on config
const networkOptions =
  CONFIG.NETWORK === "mainnet" ? MAINNET_NETWORKS : TESTNET_NETWORKS;

const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingFlower"]?.depositAddress ?? "";

const _success = (state: MachineState) =>
  state.matches("depositingFlowerSuccess");
const _failed = (state: MachineState) =>
  state.matches("depositingFlowerFailed");
const _authToken = (state: AuthMachineState) => state.context.user.rawToken;
const _linkedWallet = (state: MachineState) =>
  state.context.linkedWallet ?? "0xc23Ea4b3fFA70DF89874ff65759031d78e40251d";

export const DepositFlower: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const { walletService } = useContext(WalletContext);
  const { t } = useTranslation();

  const [selectedNetwork, setSelectedNetwork] = useState<
    NetworkOption | undefined
  >();
  const [balanceState, setBalanceState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [balance, setBalance] = useState<bigint>(0n);
  const [acknowledged, setAcknowledged] = useState(false);
  const [manualDeposit, setManualDeposit] = useState(false);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  const depositAddress = useSelector(gameService, _depositAddress);
  const success = useSelector(gameService, _success);
  const failed = useSelector(gameService, _failed);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const authToken = useSelector(authService, _authToken);

  useEffect(() => {
    if (selectedNetwork?.value) {
      walletService.send("SWITCH_NETWORK", {
        chainId: selectedNetwork.chainId,
      });
      refreshDeposits();
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (success || failed) {
      gameService.send("CONTINUE");
    }
  }, [success, failed]);

  useEffect(() => {
    if (!selectedNetwork) return;

    fetchBalance(selectedNetwork);
  }, [linkedWallet, selectedNetwork]);

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
        chainId: selectedNetwork?.chainId,
      },
      authToken,
    });
  };

  const handleNetworkChange = (networkName: NetworkName) => {
    // Use proper type checking to ensure networkName is a valid key
    const networkOption = networkOptions.find(
      (option) => option.value === networkName,
    ) as NetworkOption;

    if (networkOption.value === selectedNetwork?.value) return;

    setAcknowledged(false);
    setSelectedNetwork(networkOption);
  };

  const depositReady = acknowledged && selectedNetwork?.value && depositAddress;

  return (
    <GameWallet action="depositFlower">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="w-6 cursor-pointer"
            onClick={manualDeposit ? () => setManualDeposit(false) : onClose}
          />
          <Label type="default" icon={flowerIcon}>
            {t("deposit.flower")}
          </Label>
        </div>

        <DropdownPanel<NetworkName>
          options={networkOptions}
          value={selectedNetwork?.value}
          onChange={handleNetworkChange}
          placeholder={t("deposit.flower.selectNetwork")}
        />

        {/* Acknowledge conditions */}
        {!acknowledged && selectedNetwork?.value && (
          <AcknowledgeConditions
            depositAddress={depositAddress}
            setAcknowledged={setAcknowledged}
          />
        )}
      </div>

      {/* Deposit from linked wallet */}
      {depositReady && !manualDeposit && (
        <DepositFromLinkedWallet
          linkedWallet={linkedWallet}
          depositAddress={depositAddress}
          selectedNetwork={selectedNetwork}
          linkedWalletBalance={balance}
          balanceState={balanceState}
          setManualDeposit={setManualDeposit}
        />
      )}

      {/* Manual deposit */}
      {depositReady && manualDeposit && (
        <DepositAddress
          depositAddress={depositAddress}
          selectedNetwork={selectedNetwork}
        />
      )}

      {acknowledged && (
        <DepositHistory
          acknowledged={acknowledged}
          selectedNetwork={selectedNetwork}
          refreshDeposits={refreshDeposits}
          firstLoadComplete={firstLoadComplete}
        />
      )}
    </GameWallet>
  );
};
