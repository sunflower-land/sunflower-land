import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";

type Props = {
  highscore: number;
};

export const MinigameHighscoreWidget: React.FC<Props> = ({ highscore }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="rounded-sm p-1">
      <div
        className="flex items-center justify-between gap-2 pr-1"
        aria-label={t("minigame.dashboard.highscoreAria", {
          score: formatNumber(highscore, { decimalPlaces: 0 }),
        })}
      >
        <span className="text-xxs font-medium uppercase tracking-wide text-[#3e2731]/80">
          {t("minigame.dashboard.highscore")}
        </span>
        <span className="text-sm tabular-nums leading-none text-[#3e2731]">
          {formatNumber(highscore, { decimalPlaces: 0 })}
        </span>
      </div>
    </InnerPanel>
  );
};
