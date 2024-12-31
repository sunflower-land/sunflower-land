import { Button } from "components/ui/Button";
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
    <>
      <Button className="mb-1" onClick={toggleAnimations}>
        <span>
          {showAnimations
            ? t("gameOptions.generalSettings.disableAnimations")
            : t("gameOptions.generalSettings.enableAnimations")}
        </span>
      </Button>
      <Button className="mb-1" onClick={toggleQuickSelect}>
        <span>
          {enableQuickSelect
            ? t("gameOptions.generalSettings.disableQuickSelect")
            : t("gameOptions.generalSettings.enableQuickSelect")}
        </span>
      </Button>
    </>
  );
};
