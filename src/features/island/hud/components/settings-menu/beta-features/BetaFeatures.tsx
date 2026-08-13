import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BETA_FEATURE_NAMES } from "lib/flags";
import type { ContentComponentProps } from "../types";

export const BetaFeatures: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();

  const features = BETA_FEATURE_NAMES.filter((name) => !name.endsWith("_TEST"));

  return (
    <div className="flex flex-col gap-2 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">
        {t("gameOptions.betaFeatures.description")}
      </p>
      {features.length === 0 && (
        <p className="text-sm text-start opacity-90">
          {t("gameOptions.betaFeatures.empty")}
        </p>
      )}
      {features.map((name) => (
        <div
          key={name}
          className="rounded-md border-2 border-amber-800/70 bg-stone-950/35 p-2"
        >
          <p className="text-sm">{name}</p>
        </div>
      ))}
    </div>
  );
};
