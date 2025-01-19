import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import doubleDelivery from "assets/icons/double_delivery_icon.webp";
import React from "react";

export const DoubleDelivery: React.FC<{ acknowledge: () => void }> = ({
  acknowledge,
}) => {
  const { t } = useAppTranslation();
  return (
    <Panel className="relative z-10">
      <div className="p-1">
        <Label type="vibrant" icon={doubleDelivery} className="mb-2">
          {t("doubleDelivery.specialEvent")}
        </Label>
        <NoticeboardItems
          items={[
            {
              text: t("doubleDelivery.one"),
              icon: SUNNYSIDE.icons.lightning,
            },
            {
              text: t("doubleDelivery.two"),
              icon: SUNNYSIDE.icons.expression_alerted,
            },
          ]}
        />
      </div>
      <Button onClick={acknowledge}>{t("continue")}</Button>
    </Panel>
  );
};
