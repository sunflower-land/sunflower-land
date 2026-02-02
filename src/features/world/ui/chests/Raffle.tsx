import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Panel } from "components/ui/Panel";

export const Raffle: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <div className="p-1">
        <Label type="info" className="mb-2">
          {t("raffle.newLocation")}
        </Label>
        <p className="text-sm">{t("raffle.newLocationDescription")}</p>
      </div>
      <Button onClick={onClose}>{t("close")}</Button>
    </Panel>
  );
};
