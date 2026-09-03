import Switch from "components/ui/Switch";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { useSelector } from "@xstate/react";
import React, { useContext } from "react";

export const BehaviourSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const {
    gameService,
    showAnimations,
    toggleAnimations,
    enableQuickSelect,
    toggleQuickSelect,
    showTimers,
    toggleTimers,
    showActualTime,
    toggleActualTime,
  } = useContext(Context);

  const game = useSelector(gameService, (state) => state.context.state);

  // The two readings only diverge while a boost window is running, which only
  // happens under SPEED_BOOSTS — without it the toggle is a no-op.
  const hasSpeedBoosts = hasFeatureAccess(game, "SPEED_BOOSTS");

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
      {hasSpeedBoosts && (
        <Switch
          checked={showActualTime}
          onChange={toggleActualTime}
          label={t("gameOptions.generalSettings.actualTime")}
        />
      )}
    </div>
  );
};
