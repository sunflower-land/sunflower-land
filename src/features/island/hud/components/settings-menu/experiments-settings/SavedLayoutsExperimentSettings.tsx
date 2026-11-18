import React from "react";
import type { ContentComponentProps } from "../types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ExperimentToggle } from "./ExperimentToggle";

export const SavedLayoutsExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();

  return (
    <ExperimentToggle
      experiment="savedLayouts"
      description={t("gameOptions.experiments.savedLayoutsDescription")}
      toggleLabel={t("gameOptions.experiments.savedLayoutsToggle")}
      disclaimer={t("gameOptions.experiments.savedLayoutsDisclaimer")}
    />
  );
};
