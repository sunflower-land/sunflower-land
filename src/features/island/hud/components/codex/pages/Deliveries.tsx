import { DeliveryOrders } from "features/island/delivery/components/Orders";
import React, { useState } from "react";

import { GameState } from "features/game/types/game";

export const Deliveries: React.FC<{
  onClose: () => void;
  state: GameState;
}> = ({ onClose, state }) => {
  const [selected, setSelected] = useState<string>();

  return (
    <div className="flex flex-col h-full">
      <DeliveryOrders
        onSelect={(id) => setSelected(id)}
        selectedId={selected}
        onClose={() => onClose()}
        state={state}
      />
    </div>
  );
};
