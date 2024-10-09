import React from "react";
import { InventoryItemName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import lockIcon from "assets/icons/lock.png";

interface Props {
  show: boolean;
  onHide: () => void;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel>
        <div className="p-2">
          <Label type="default" icon={lockIcon} className="mb-2">
            {t("coming.soon")}
          </Label>
          <p className="text-sm">{t("crafting.coming.soon")}</p>
        </div>
        <Button onClick={onHide}>{t("close")}</Button>
      </CloseButtonPanel>
    </Modal>
  );
};
