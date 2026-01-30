import { DeliveryOrders } from "features/island/delivery/components/Orders";
import React, { useState } from "react";

import { GameState } from "features/game/types/game";

export const Deliveries: React.FC<{
  onClose: () => void;
  state: GameState;
}> = ({ onClose, state }) => {
  const [selected, setSelected] = useState<string | undefined>(
    state.delivery.orders[0]?.id,
  );

  return (
    <div className="flex flex-col h-full">
      <DeliveryOrders
        onSelect={setSelected}
        selectedId={selected}
        onClose={() => onClose()}
        state={state}
      />
    </div>
  );
};
