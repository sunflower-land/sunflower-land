import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { TransferAccountWrapper } from "features/island/hud/components/settings-menu/blockchain-settings/TransferAccount";

interface Props {
  onClose: () => void;
  onBack: () => void;
}

/**
 * Migration assistant - a copy of the Bank modal (BankModal.tsx) with the
 * withdraw / deposit tabs removed, leaving only the account transfer flow.
 *
 * Kept as a standalone component so the whole Ronin Waypoint migration popup
 * can be deleted easily once the migration period is over.
 */
export const RoninMigrateAssistant: React.FC<Props> = ({ onClose, onBack }) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["greedclaw"]}
      title={t("gameOptions.blockchainSettings.transferOwnership")}
      onClose={onClose}
      onBack={onBack}
    >
      <TransferAccountWrapper />
    </CloseButtonPanel>
  );
};
