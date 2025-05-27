import { MachineState } from "features/game/lib/gameMachine";
import React, { useContext, useState } from "react";
import { NetworkOption } from "./DepositFlower";
import { useTranslation } from "react-i18next";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { formatEther, parseEther } from "viem";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import flowerIcon from "assets/icons/flower_token.webp";
import { Button } from "components/ui/Button";
import { NumberInput } from "components/ui/NumberInput";
import { ButtonPanel } from "components/ui/Panel";

const _depositingFlowerToLinkedWallet = (state: MachineState) =>
  state.matches("depositingFlowerFromLinkedWallet");
const _loadingDeposits = (state: MachineState) =>
  state.matches("depositingFlower");

const MIN_DEPOSIT_AMOUNT = 5;

export const DepositFromLinkedWallet: React.FC<{
  depositAddress: string;
  linkedWallet: string;
  selectedNetwork: NetworkOption;
  linkedWalletBalance: bigint;
  balanceState: "loading" | "loaded" | "error";
  setManualDeposit: (manualDeposit: boolean) => void;
  fetchBalance: (selectedNetwork: NetworkOption) => Promise<void>;
}> = ({
  depositAddress,
  linkedWallet,
  selectedNetwork,
  linkedWalletBalance,
  balanceState,
  setManualDeposit,
  fetchBalance,
}) => {
  const { t } = useTranslation();
  const { gameService } = useContext(Context);
  const [amount, setAmount] = useState<Decimal>(
    new Decimal(MIN_DEPOSIT_AMOUNT),
  );

  const depositingFlowerFromLinkedWallet = useSelector(
    gameService,
    _depositingFlowerToLinkedWallet,
  );
  const loadingDeposits = useSelector(gameService, _loadingDeposits);

  useOnMachineTransition(
    gameService,
    "depositingFlowerFromLinkedWallet",
    "playing",
    async () => {
      setAmount(new Decimal(MIN_DEPOSIT_AMOUNT));
      await fetchBalance(selectedNetwork);
    },
  );

  const handleAmountChange = (value: Decimal) => {
    setAmount(value);
  };

  const handleDeposit = async () => {
    gameService.send("DEPOSIT_FLOWER_FROM_LINKED_WALLET", {
      amount: BigInt(parseEther(amount.toString())),
      depositAddress: depositAddress as `0x${string}`,
      selectedNetwork,
    });
  };

  const getButtonText = () => {
    if (depositingFlowerFromLinkedWallet) {
      return t("deposit.flower.sendingTransaction");
    }
    if (loadingDeposits) {
      return t("deposit.flower.refreshing");
    }

    return t("deposit.flower");
  };

  return (
    <>
      <div className="flex flex-col my-3 justify-center">
        <div className="ml-3">
          <WalletAddressLabel walletAddress={linkedWallet} showLabelTitle />
        </div>
        {balanceState === "loading" && (
          <div className="flex justify-between w-full p-2">
            <span>{`Loading balance...`}</span>
          </div>
        )}
        {balanceState === "error" && (
          <div className="flex justify-between w-full p-2">
            <span>{`Error loading balance. Try again later.`}</span>
          </div>
        )}
        {balanceState === "loaded" && (
          <div className="flex justify-between w-full p-2">
            <span>{`${t("available")}: `}</span>
            <div className="flex items-center gap-1">
              <span>{`${formatEther(linkedWalletBalance)}`}</span>
              <img src={flowerIcon} className="object-contain w-4" />
            </div>
          </div>
        )}
        <div className="relative">
          <NumberInput
            value={amount}
            maxDecimalPlaces={18}
            isOutOfRange={
              amount.lt(MIN_DEPOSIT_AMOUNT) ||
              amount.gt(new Decimal(formatEther(linkedWalletBalance)))
            }
            className="p-1 h-12"
            onValueChange={(value) => handleAmountChange(value)}
          />
          <Button
            className="absolute top-[51%] right-3 -translate-y-1/2 h-7 w-12"
            onClick={() =>
              setAmount(new Decimal(formatEther(linkedWalletBalance)))
            }
          >
            <span className="text-xxs">{`${t("max")}`}</span>
          </Button>
        </div>
        <div
          className="flex justify-end w-full mt-2"
          onClick={() => setManualDeposit(true)}
        >
          <span className="text-xxs underline">
            {t("deposit.flower.depositFromDifferentWallet")}
          </span>
        </div>
      </div>
      <ButtonPanel
        disabled={
          !depositAddress ||
          balanceState === "loading" ||
          balanceState === "error" ||
          amount.lt(MIN_DEPOSIT_AMOUNT) ||
          amount.gt(new Decimal(formatEther(linkedWalletBalance))) ||
          depositingFlowerFromLinkedWallet ||
          loadingDeposits
        }
        className="w-full text-center mb-2"
        onClick={handleDeposit}
      >
        <div className="mb-1">{getButtonText()}</div>
      </ButtonPanel>
    </>
  );
};
