import Switch from "components/ui/Switch";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  isCustomCursorEnabled,
  setCustomCursorEnabled,
} from "lib/utils/customCursor";
import React, { useContext, useState } from "react";

export const BehaviourSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const {
    showAnimations,
    toggleAnimations,
    enableQuickSelect,
    toggleQuickSelect,
    showTimers,
    toggleTimers,
  } = useContext(Context);
  const [customCursor, setCustomCursor] = useState(isCustomCursorEnabled);

  const toggleCustomCursor = () => {
    const next = !customCursor;
    setCustomCursor(next);
    setCustomCursorEnabled(next);
  };

  return (
    <div className="flex flex-col items-start gap-2 p-2">
      <h1 className="text-lg mb-2">
        {t("gameOptions.generalSettings.behaviour")}
      </h1>
      <Switch
        checked={showAnimations}
        onChange={toggleAnimations}
        label={"Animations"}
      />
      <Switch
        checked={enableQuickSelect}
        onChange={toggleQuickSelect}
        label={"Quick Select"}
      />
      <Switch checked={showTimers} onChange={toggleTimers} label={"Timers"} />
      <Switch
        checked={customCursor}
        onChange={toggleCustomCursor}
        label={t("gameOptions.generalSettings.customCursor")}
      />
    </div>
  );
};
