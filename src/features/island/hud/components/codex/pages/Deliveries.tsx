import { Label } from "components/ui/Label";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import React, { useState } from "react";

export const Deliveries: React.FC = () => {
  const [selected, setSelected] = useState<string>();

  return (
    <>
      <Label type="default">Deliveries</Label>
      <p className="mb-2 ml-1 text-xs">
        Travel to different islands and deliver goods to earn rewards.
      </p>
      <DeliveryOrders
        onSelect={(id) => setSelected(id)}
        selectedId={selected}
      />
    </>
  );
};
