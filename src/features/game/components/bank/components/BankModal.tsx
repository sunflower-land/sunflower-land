import React from "react";

import { Withdraw } from "./Withdraw";
import { GameWallet } from "features/wallet/Wallet";

import withdrawIcon from "assets/icons/withdraw.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "../../CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  farmAddress: string;
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <CloseButtonPanel
        bumpkinParts={NPC_WEARABLES["greedclaw"]}
        tabs={[{ icon: withdrawIcon, name: t("withdraw") }]}
        onClose={onClose}
      >
        <GameWallet action="withdraw">
          <Withdraw onClose={onClose} />
        </GameWallet>
      </CloseButtonPanel>
    </>
  );
};
