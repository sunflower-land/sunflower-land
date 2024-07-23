import React, { useContext, useEffect, useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import confetti from "canvas-confetti";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { FACTION_POINT_ICONS } from "features/world/ui/factions/FactionDonationPanel";
import { MachineState } from "features/game/lib/gameMachine";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { NPC_WEARABLES } from "lib/npcs";
import { formatDateTime, secondsToString } from "lib/utils/time";
import { FACTION_EMBLEM_ICONS } from "features/world/ui/factions/components/ClaimEmblems";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "lib/utils/capitalize";
import { FACTION_RECRUITERS } from "features/world/ui/factions/JoinFaction";
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

const Countdown: React.FC<{ time: Date; onComplete: () => void }> = ({
  time,
  onComplete,
}) => {
  const start = useCountdown(time.getTime());

  useEffect(() => {
    if (time.getTime() < Date.now()) {
      onComplete();
    }
  }, [start]);

  return <TimerDisplay time={start} />;
};

export const SpecialEventCountdown: React.FC = () => {
  const { showAnimations, gameService } = useContext(Context);
  const specialEvents = useSelector(gameService, _specialEvents);

  const [isClosed, setIsClosed] = useState(false);

  const { t } = useAppTranslation();

  if (isClosed) return null;

  const now = Date.now();

  const specialEventDetails = specialEvents[0];

  if (!specialEventDetails || !specialEventDetails[1]) return null;
  const [specialEventName, specialEvent] = specialEventDetails;

  const boostItem = getKeys(specialEvent.bonus ?? {})[0];
  const boostAmount = specialEvent.bonus?.[boostItem]?.saleMultiplier;

  const hasEnded = specialEvent.endAt < now;

  if (hasEnded) return null;

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
              {/* <Label type="transparent">Special Event</Label> */}
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
              {`${boostAmount}x ${boostItem} Sale`}
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
          {/* <Countdown
            time={new Date(specialEvent.endAt)}
            onComplete={() => setIsClosed(true)}
          /> */}
        </div>
      </div>
    </InnerPanel>
  );
};
