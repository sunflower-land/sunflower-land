import React, { useState } from "react";
import { NetworkOption } from "./DepositFlower";
import { useTranslation } from "react-i18next";
import { CopySvg } from "components/ui/CopyField";
import { Label } from "components/ui/Label";
import { DepositHistory } from "./DepositHistory";
import { SelectChainDropdown } from "features/wallet/Wallet";

export const DepositAddress: React.FC<{
  depositAddress: string;
  selectedNetwork: NetworkOption;
  refreshDeposits: () => void;
  firstLoadComplete: boolean;
  networkOptions: NetworkOption[];
  switchChain: ({ chainId }: { chainId: number }) => void;
  isPending: boolean;
}> = ({
  depositAddress,
  selectedNetwork,
  refreshDeposits,
  firstLoadComplete,
  networkOptions,
  switchChain,
  isPending,
}) => {
  const { t } = useTranslation();
  const [showLabel, setShowLabel] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState<string>(t("copied"));

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

  return (
    <>
      <div className="absolute top-6 right-7">
        <SelectChainDropdown
          availableChains={networkOptions.map((network) => network.chainId)}
          switchChain={switchChain}
          isPending={isPending}
          chainIcon={selectedNetwork.icon}
          chainName={selectedNetwork.value}
        />
      </div>
      <div className="relative flex flex-col items-center justify-center gap-2 p-2 mt-2 mb-2">
        <p className="text-xxs sm:text-xs text-center mb-1 -mt-1">
          {t("deposit.flower.guide", { network: selectedNetwork.value })}
        </p>
        <span className="px-3 sm:px-[50px] text-center break-all select-text">
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
          <span className="text-center">{t("deposit.doNotSaveAddress")}</span>
        </Label>
      </div>
      <DepositHistory
        firstLoadComplete={firstLoadComplete}
        selectedNetwork={selectedNetwork}
        refreshDeposits={refreshDeposits}
      />
    </>
  );
};
