import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PetType } from "features/game/types/pets";
import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsTillReset, secondsToString } from "lib/utils/time";

export const PetTypeFed: React.FC<{ type: PetType }> = ({ type }) => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col gap-1 p-1">
      <Label type="danger">{t("pets.typeFed", { type })}</Label>
      <p className="text-sm px-1">{t("pets.typeFedDescription", { type })}</p>
      <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
        {secondsToString(secondsTillReset(), { length: "short" })}
      </Label>
    </div>
  );
};
