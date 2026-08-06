import React from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { GiveawayBoardContent } from "./GiveawayBoardContent";

/** Standalone Community Games panel (opened from the plaza giveaway board). */
export const GiveawayBoard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel title={t("giveaway.title")} onClose={onClose}>
      <GiveawayBoardContent />
    </CloseButtonPanel>
  );
};
