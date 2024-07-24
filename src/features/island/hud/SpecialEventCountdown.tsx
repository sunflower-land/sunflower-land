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

const _specialEvents = (state: MachineState) =>
  Object.entries(state.context.state.specialEvents.current)
    .filter(([, specialEvent]) => !!specialEvent?.isEligible)
    .filter(
      ([, specialEvent]) => (specialEvent?.endAt ?? Infinity) > Date.now(),
    )
    .filter(([, specialEvent]) => (specialEvent?.startAt ?? 0) < Date.now());

export const SpecialEventCountdown: React.FC = () => {
  const { showAnimations, gameService } = useContext(Context);
  const specialEvents = useSelector(gameService, _specialEvents);

  const [isClosed, setIsClosed] = useState(false);

  const { t } = useAppTranslation();

  if (isClosed) return null;

  const specialEventDetails = specialEvents[0];

  if (!specialEventDetails || !specialEventDetails[1]) return null;
  const [specialEventName, specialEvent] = specialEventDetails;

  const boostItem = getKeys(specialEvent.bonus ?? {})[0];
  const boostAmount = specialEvent.bonus?.[boostItem]?.saleMultiplier;

  return (
    <InnerPanel className="flex justify-center" id="emblem-airdrop">
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
            onClick={() => setIsClosed(true)}
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
            {`${secondsToString((specialEvent.endAt - Date.now()) / 1000, {
              length: "short",
            })} left`}
          </Label>
        </div>
      </div>
    </InnerPanel>
  );
};
