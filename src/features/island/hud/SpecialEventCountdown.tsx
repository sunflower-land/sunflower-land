import React, { useContext, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

import { secondsToString } from "lib/utils/time";

import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";

import lightning from "assets/icons/lightning.png";
import {
  acknowledgeSpecialEvent,
  specialEventLastAcknowledged,
} from "features/announcements/announcementsStorage";
import { useNow } from "lib/utils/hooks/useNow";

const _specialEvents = (state: MachineState) =>
  Object.entries(state.context.state.specialEvents.current)
    .filter(([, specialEvent]) => !!specialEvent?.isEligible)
    .filter(
      ([, specialEvent]) => (specialEvent?.endAt ?? Infinity) > Date.now(),
    )
    .filter(([, specialEvent]) => (specialEvent?.startAt ?? 0) < Date.now());

export const SpecialEventCountdown: React.FC = () => {
  const { gameService } = useContext(Context);
  const specialEvents = useSelector(gameService, _specialEvents);
  const now = useNow();

  const [isClosed, setIsClosed] = useState(false);

  const { t } = useAppTranslation();

  if (isClosed) return null;

  const close = () => {
    setIsClosed(true);
    acknowledgeSpecialEvent();
  };

  const specialEventDetails = specialEvents[0];

  if (!specialEventDetails || !specialEventDetails[1]) return null;
  const [specialEventName, specialEvent] = specialEventDetails;

  const lastAcknowledged = specialEventLastAcknowledged();
  if (lastAcknowledged && lastAcknowledged > new Date(specialEvent.startAt))
    return null;

  const boostItem = getKeys(specialEvent.bonus ?? {})[0];
  const boostAmount = specialEvent.bonus?.[boostItem]?.saleMultiplier;

  return (
    <InnerPanel className="flex justify-center max-w-[60vw]" id="special-event">
      <div>
        <div className="h-6 flex justify-between">
          {boostItem && (
            <>
              <Label
                type="default"
                className="ml-1"
                icon={SUNNYSIDE.icons.player}
              >
                {specialEventName}
              </Label>
            </>
          )}

          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer"
            onClick={close}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <Label
              icon={boostItem ? ITEM_DETAILS[boostItem].image : undefined}
              secondaryIcon={lightning}
              type="vibrant"
              className="ml-1 mt-1"
            >
              {`${boostAmount}x ${boostItem} ${t("sale")}`}
            </Label>
          </div>
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="info"
            className="ml-1 mt-1"
          >
            {`${secondsToString((specialEvent.endAt - now) / 1000, {
              length: "short",
            })} left`}
          </Label>
        </div>
      </div>
    </InnerPanel>
  );
};
