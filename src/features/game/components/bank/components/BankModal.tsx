import React, { useState } from "react";

import { Withdraw } from "./Withdraw";
import withdrawIcon from "assets/icons/withdraw.png";
import chest from "assets/icons/chest.png";
import farmImg from "assets/brand/nft.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "../../CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Deposit } from "./Deposit";
import { TransferAccountWrapper } from "features/island/hud/components/settings-menu/blockchain-settings/TransferAccount";

type Tab = "withdraw" | "deposit" | "transfer";

interface Props {
  farmAddress: string;
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ farmAddress, onClose }) => {
  const { t } = useAppTranslation();

  const [currentTab, setCurrentTab] = useState<Tab>("withdraw");

  const isFullUser = farmAddress !== "";

  const tabs = [
    { id: "withdraw" as const, icon: withdrawIcon, name: t("withdraw") },
    { id: "deposit" as const, icon: chest, name: t("deposit") },
    ...(isFullUser
      ? [
          {
            id: "transfer" as const,
            icon: farmImg,
            name: t("gameOptions.blockchainSettings.transferOwnership"),
          },
        ]
      : []),
  ];

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["greedclaw"]}
      tabs={tabs}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onClose={onClose}
    >
      {currentTab === "withdraw" && <Withdraw onClose={onClose} />}
      {currentTab === "deposit" && <Deposit onClose={onClose} />}
      {currentTab === "transfer" && <TransferAccountWrapper />}
    </CloseButtonPanel>
  );
};
