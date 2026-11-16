import React from "react";
import type { ContentComponentProps } from "../types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ExperimentToggle } from "./ExperimentToggle";

export const LandscapingExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();

  return (
    <ExperimentToggle
      experiment="newLandscaping"
      description={t("gameOptions.experiments.landscapingDescription")}
      toggleLabel={t("gameOptions.experiments.landscapingToggle")}
      disclaimer={t("gameOptions.experiments.landscapingDisclaimer")}
    />
  );
};
