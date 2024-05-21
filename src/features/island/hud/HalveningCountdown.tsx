import React, { useContext, useEffect, useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import confetti from "canvas-confetti";
import { ESTIMATED_HALVENING } from "features/game/lib/halvening";
import { Context } from "features/game/GameProvider";

const Countdown: React.FC<{ time: Date; onComplete: () => void }> = ({
  time,
  onComplete,
}) => {
  const start = useCountdown(time.getTime());
  const { t } = useAppTranslation();

  const { showAnimations } = useContext(Context);

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
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="ml-1">
          {t("halveningCountdown.title")}
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

export const HalveningCountdown: React.FC = () => {
  const [halvening, setHalvening] = useState<Date>();

  useEffect(() => {
    // Is within 24 hours of the estimated halvening
    if (
      ESTIMATED_HALVENING.getTime() > Date.now() &&
      ESTIMATED_HALVENING.getTime() - 24 * 60 * 60 * 1000 < Date.now()
    ) {
      setHalvening(ESTIMATED_HALVENING);
    }
  }, []);

  if (!halvening) {
    return null;
  }

  return (
    <InnerPanel className="flex justify-center" id="test-auction">
      <Countdown time={halvening} onComplete={() => setHalvening(undefined)} />
    </InnerPanel>
  );
};
