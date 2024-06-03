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

export const EMBLEM_AIRDROP_DATE = new Date("2024-06-14T00:00:00Z");
const SHOW_COUNTDOWN = new Date("2024-06-01T00:00:00Z");

const _faction = (state: MachineState) => state.context.state.faction;

const Countdown: React.FC<{ time: Date; onComplete: () => void }> = ({
  time,
  onComplete,
}) => {
  const start = useCountdown(time.getTime());
  const { t } = useAppTranslation();

  const { showAnimations, gameService } = useContext(Context);
  const faction = useSelector(gameService, _faction);

  useEffect(() => {
    if (time.getTime() < Date.now()) {
      if (showAnimations) confetti();
      onComplete();
    }
  }, [start]);

  if (time.getTime() < Date.now()) {
    return null;
  }

  return (
    <div>
      <div className="h-6 flex justify-center">
        <Label
          type="info"
          icon={SUNNYSIDE.icons.stopwatch}
          className={classNames("ml-1", { "mr-1": !!faction })}
          secondaryIcon={faction && FACTION_POINT_ICONS[faction.name]}
        >
          {t("faction.emblemAirdrop")}
        </Label>
        <img
          src={SUNNYSIDE.icons.close}
          className="h-5 cursor-pointer ml-2"
          onClick={onComplete}
        />
      </div>
      <TimerDisplay time={start} />
    </div>
  );
};

export const EmblemAirdropCountdown: React.FC = () => {
  const [airdropDate, setAirdropDate] = useState<Date>();

  useEffect(() => {
    if (SHOW_COUNTDOWN.getTime() < Date.now()) {
      setAirdropDate(EMBLEM_AIRDROP_DATE);
    }
  }, []);

  if (!airdropDate) {
    return null;
  }

  return (
    <InnerPanel className="flex justify-center" id="emblem-airdrop">
      <Countdown
        time={EMBLEM_AIRDROP_DATE}
        onComplete={() => setAirdropDate(undefined)}
      />
    </InnerPanel>
  );
};
