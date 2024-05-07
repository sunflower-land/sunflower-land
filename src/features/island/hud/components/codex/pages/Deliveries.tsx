import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";

import { secondsToString } from "lib/utils/time";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";

import { Context } from "features/game/GameProvider";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";

export const Deliveries: React.FC = () => {
  const { gameService } = useContext(Context);
  const [selected, setSelected] = useState<string>();

  const { t } = useAppTranslation();

  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: gameService.state.context.farmId,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-1">
        <div className="flex justify-between">
          <Label type="default">{t("deliveries")}</Label>
          {!ticketTasksAreFrozen && (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`${t("new.delivery.in")} ${secondsToString(secondsTillReset(), {
                length: "short",
              })}`}
            </Label>
          )}
        </div>
        <p className="my-2 ml-1 text-xxs">{t("deliveries.intro")}</p>
      </div>
      <DeliveryOrders
        onSelect={(id) => setSelected(id)}
        selectedId={selected}
      />
    </div>
  );
};
