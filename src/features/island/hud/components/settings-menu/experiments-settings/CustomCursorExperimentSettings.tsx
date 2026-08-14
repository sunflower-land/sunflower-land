import Switch from "components/ui/Switch";
import type { ContentComponentProps } from "../types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import {
  isCustomCursorEnabled,
  setCustomCursorEnabled,
} from "lib/utils/customCursor";

export const CustomCursorExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();
  const [enabled, setEnabled] = useState(isCustomCursorEnabled);

  const onToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setCustomCursorEnabled(next);
  };

  return (
    <div className="flex flex-col gap-3 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">
        {t("gameOptions.experiments.customCursorDescription")}
      </p>
      <div className="rounded-md border-2 border-amber-800/70 bg-stone-950/35 p-3 space-y-3">
        <Switch
          checked={enabled}
          onChange={onToggle}
          label={t("gameOptions.experiments.customCursorToggle")}
        />
      </div>
    </div>
  );
};
