import { Label } from "components/ui/Label";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

export const Deliveries: React.FC = () => {
  const [selected, setSelected] = useState<string>();

  const { t } = useAppTranslation();

  return (
    <>
      <Label type="default">{t("deliveries")}</Label>
      <p className="mb-2 ml-1 text-xs">{t("deliveries.intro")}</p>
      <DeliveryOrders
        onSelect={(id) => setSelected(id)}
        selectedId={selected}
      />
    </>
  );
};
