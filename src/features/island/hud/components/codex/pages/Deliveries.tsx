import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

import { secondsToString } from "lib/utils/time";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";

export const Deliveries: React.FC = () => {
  const [selected, setSelected] = useState<string>();

  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1">
        <div className="flex justify-between">
          <Label type="default">{t("deliveries")}</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {`${t("new.delivery.in")} ${secondsToString(secondsTillReset(), {
              length: "short",
            })}`}
          </Label>
        </div>
        <p className="mb-2 mt-1 ml-1 text-xs">{t("deliveries.intro")}</p>
      </div>
      <DeliveryOrders
        onSelect={(id) => setSelected(id)}
        selectedId={selected}
      />
    </>
  );
};
