import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";

export const Deliveries: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [selected, setSelected] = useState<string>();

  const { t } = useAppTranslation();

  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: gameService.state.context.farmId,
  });

  return (
    <div className="flex flex-col h-full">
      <DeliveryOrders
        onSelect={(id) => setSelected(id)}
        selectedId={selected}
        onClose={() => onClose()}
      />
    </div>
  );
};
