import React from "react";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";

type Props = {
  awakeAt: number;
  className?: string;
};

export const WakesIn = ({ awakeAt, className }: Props) => {
  const { t } = useAppTranslation();
  const { totalSeconds: secondsLeft } = useCountdown(awakeAt);

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
