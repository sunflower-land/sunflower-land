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
  } = useContext(Context);

  return (
    <div className="flex flex-col items-center gap-2 m-3">
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
    </div>
  );
};
