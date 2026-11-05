import Switch from "components/ui/Switch";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";

export const BehaviourSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const {
    showAnimations,
    toggleAnimations,
    enableQuickSelect,
    toggleQuickSelect,
    showFullMoonSeedsInQuickSelect,
    toggleFullMoonSeedsInQuickSelect,
    showTimers,
    toggleTimers,
  } = useContext(Context);

  return (
    <div className="flex flex-col items-start gap-2 p-2">
      <Switch
        checked={showAnimations}
        onChange={toggleAnimations}
        label={t("gameOptions.generalSettings.animations")}
      />
      <Switch
        checked={enableQuickSelect}
        onChange={toggleQuickSelect}
        label={t("gameOptions.generalSettings.quickSelect")}
      />
      {enableQuickSelect && (
        <Switch
          checked={showFullMoonSeedsInQuickSelect}
          onChange={toggleFullMoonSeedsInQuickSelect}
          label={t("gameOptions.generalSettings.fullMoonSeedsInQuickSelect")}
        />
      )}
      <Switch
        checked={showTimers}
        onChange={toggleTimers}
        label={t("gameOptions.generalSettings.timers")}
      />
    </div>
  );
};
