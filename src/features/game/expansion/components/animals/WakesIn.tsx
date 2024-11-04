import React from "react";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

type Props = {
  awakeAt: number;
  className?: string;
};

export const WakesIn = ({ awakeAt, className }: Props) => {
  const { t } = useAppTranslation();
  const secondsLeft = (awakeAt - Date.now()) / 1000;

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
