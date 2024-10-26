import React from "react";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ANIMAL_SLEEP_DURATION } from "features/game/events/landExpansion/feedAnimal";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

type Props = {
  asleepAt: number;
  className?: string;
};

export const WakesIn = ({ asleepAt, className }: Props) => {
  const { t } = useAppTranslation();
  const asleepUntil = asleepAt + ANIMAL_SLEEP_DURATION;

  const secondsLeft = (asleepUntil - Date.now()) / 1000;

  useUiRefresher({ active: secondsLeft > 0 });

  return (
    <div className={`flex justify-center absolute w-full ${className}`}>
      <TimeLeftPanel
        text={t("wakesIn")}
        timeLeft={secondsLeft}
        showTimeLeft={secondsLeft > 0}
      />
    </div>
  );
};
