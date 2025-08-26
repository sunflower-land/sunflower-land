import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

interface Props {
  onClose: () => void;
}
export const PetShop: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-1">
        <Label type="info" className="mb-2">
          {t("coming.soon")}
        </Label>
        <p className="text-sm">{t("pets.coming.soon")}</p>
      </div>
      <Button onClick={onClose}>{t("close")}</Button>
    </CloseButtonPanel>
  );
};
