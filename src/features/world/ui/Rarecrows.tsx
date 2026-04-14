import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { NoticeboardItems } from "./kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Rarecrows: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel onClose={onClose}>
      <Label type="vibrant" className="mb-2">
        {t("description.rarecrows.title")}
      </Label>
      <NoticeboardItems
        items={[
          {
            text: t("description.rarecrows"),
            icon: SUNNYSIDE.icons.heart,
          },
          {
            text: t("description.rarecrows.2"),
            icon: ITEM_DETAILS.Cheer.image,
          },
        ]}
      />
      <Button
        className="mt-2"
        onClick={() => {
          window.open("https://t.me/rarecrows_bot", "_blank");
        }}
      >
        {t("description.rarecrows.3")}
      </Button>
    </CloseButtonPanel>
  );
};
