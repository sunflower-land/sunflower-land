import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Label } from "components/ui/Label";

const THIRTY_SECONDS = 1000 * 30;
const SIXTY_SECONDS = 1000 * 60;

interface Props {
  onClose: () => void;
}

export const GoblinMarket: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel onClose={onClose}>
      <>
        <Label type="default" className="mb-2">
          {t("thanks")}
        </Label>
        <p className="text-sm p-2">{t("goblinMarket.thanks")}</p>
      </>
    </CloseButtonPanel>
  );
};
