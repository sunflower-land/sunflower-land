/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";
import baseIcon from "assets/icons/chains/base.png";
import { ButtonPanel } from "components/ui/Panel";
import flowerIcon from "assets/icons/flower_token.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { CopySvg } from "components/ui/CopyField";
import { useTranslation } from "react-i18next";
import { shortAddress } from "lib/utils/shortAddress";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { DropdownPanel } from "components/ui/DropdownPanel";

type NetworkName = "Base" | "Base Sepolia";

type NetworkOption = {
  value: NetworkName;
  icon: string;
  chainId: number;
};

const MAINNET_NETWORKS: NetworkOption[] = [
  {
    value: "Base",
    icon: baseIcon,
    chainId: 8453,
  },
];

const TESTNET_NETWORKS: NetworkOption[] = [
  {
    value: "Base Sepolia",
    icon: baseIcon,
    chainId: 84532,
  },
];

// Select appropriate network options based on config
const networkOptions =
  CONFIG.NETWORK === "mainnet" ? MAINNET_NETWORKS : TESTNET_NETWORKS;

type ProcessedDeposit = {
  from: string | null;
  value: string;
  transactionHash: string;
  createdAt: number;
};

const _deposits = (state: MachineState): ProcessedDeposit[] =>
  state.context.data["depositingFlower"]?.deposits ?? [];
const _depositAddress = (state: MachineState): string =>
  state.context.data["depositingFlower"]?.depositAddress ?? "";
const _pending = (state: MachineState) => state.matches("depositingFlower");
const _success = (state: MachineState) =>
  state.matches("depositingFlowerSuccess");

export const DepositFlower: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState<
    NetworkOption | undefined
  >();
  const [acknowledged, setAcknowledged] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>(t("copied"));

  const depositAddress = useSelector(gameService, _depositAddress);
  const deposits = useSelector(gameService, _deposits);
  const pending = useSelector(gameService, _pending);
  const success = useSelector(gameService, _success);

  useEffect(() => {
    if (selectedNetwork?.value) {
      refreshDeposits();
    }
  }, [selectedNetwork]);

  useEffect(() => {
    if (success) {
      gameService.send("CONTINUE");
    }
  }, [success]);

  const handleNetworkChange = (networkName: NetworkName) => {
    // Use proper type checking to ensure networkName is a valid key
    const networkOption = networkOptions.find(
      (option) => option.value === networkName,
    ) as NetworkOption;

    if (networkOption.value === selectedNetwork?.value) return;

    setAcknowledged(false);
    setSelectedNetwork(networkOption);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);

      setShowLabel(true);
    } catch (e: unknown) {
      setShowLabel(true);
      setTooltipMessage(typeof e === "string" ? e : t("copy.failed"));
    }

    // Close tooltip after two seconds
    setTimeout(() => {
      setShowLabel(false);
    }, 2000);
  };

  const refreshDeposits = async () => {
    gameService.send("flower.depositStarted", {
      effect: {
        type: "flower.depositStarted",
        chainId: selectedNetwork?.chainId,
      },
      authToken: authService.getSnapshot().context.user.rawToken as string,
    });
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="w-6 cursor-pointer"
            onClick={onClose}
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
          <>
            <div className="flex flex-col p-2 mt-1 text-xxs sm:text-xs">
              <div className="w-full flex gap-1 h-8">
                <div className="w-6 flex items-center justify-center">
                  <img
                    src={SUNNYSIDE.icons.expression_alerted}
                    className="object-contain h-5"
                  />
                </div>
                <div className="w-[90%] flex items-center">
                  <span>{t("deposit.flower.onlyDeposit")}</span>
                </div>
              </div>
              <div className="w-full flex gap-1 h-8">
                <div className="w-6 flex items-center justify-center">
                  <img src={flowerIcon} className="object-contain w-5" />
                </div>
                <div className="w-[90%] flex items-center">
                  <span>{t("deposit.flower.minimumDeposit")}</span>
                </div>
              </div>
              <div className="w-full flex gap-1 h-8">
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
        )}

        {/* Deposit address */}
        {acknowledged && selectedNetwork?.value && (
          <div className="relative flex flex-col items-center justify-center gap-2 p-2 mt-2">
            <span className="px-3 sm:px-[50px]  text-center break-all select-text">
              {depositAddress}
            </span>
            <div className="flex items-center gap-1" onClick={copyToClipboard}>
              <CopySvg height={12} />
              <span className="text-xxs sm:text-xs pb-1">
                {t("deposit.copyDepositAddress")}
              </span>
            </div>
            <div
              className={`absolute top-8 right-10 transition duration-400 pointer-events-none ${
                showLabel ? "opacity-100" : "opacity-0"
              }`}
            >
              <Label type="success">{tooltipMessage}</Label>
            </div>
            <Label type="danger">
              <span className="text-center">
                {t("deposit.doNotSaveAddress")}
              </span>
            </Label>
          </div>
        )}
      </div>
      {/* Deposits history */}
      {selectedNetwork?.value && deposits.length > 0 && (
        <div className="flex flex-col mt-2">
          <div className="pb-2 border-b border-white -px-2">
            <span className="text-sm ml-1">
              {t("deposit.flower.processedDeposits")}
            </span>
          </div>
          <div className="h-[120px] scrollable overflow-y-auto">
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
                <div className="flex gap-1 mr-2">
                  <span className="text-xxs">{deposit.value}</span>
                  <img src={flowerIcon} alt="flower icon" className="w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {acknowledged && (
        <Button
          disabled={pending || !selectedNetwork}
          className="w-full text-center mt-2"
          onClick={refreshDeposits}
        >
          {pending
            ? t("deposit.flower.refreshing")
            : t("deposit.flower.refreshDeposit")}
        </Button>
      )}
    </>
  );
};
