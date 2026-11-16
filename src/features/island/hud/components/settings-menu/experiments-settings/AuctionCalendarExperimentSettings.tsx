import React from "react";
import type { ContentComponentProps } from "../types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ExperimentToggle } from "./ExperimentToggle";

export const AuctionCalendarExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();

  return (
    <ExperimentToggle
      experiment="auctionCalendar"
      description={t("gameOptions.experiments.auctionCalendarDescription")}
      toggleLabel={t("gameOptions.experiments.auctionCalendarToggle")}
    />
  );
};
