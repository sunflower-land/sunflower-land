import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PetType } from "features/game/types/pets";
import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import { getTimeUntilUTCReset } from "./ResetFoodRequests";
import { Button } from "components/ui/Button";

type Props = {
  type: PetType;
  onClose: () => void;
};

export const PetTypeFed: React.FC<Props> = ({ type, onClose }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-1">
      <Label type="warning">
        {t("pets.typeFed", { type: type.toLowerCase() })}
      </Label>
      <InnerPanel className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 p-1">
          <p className="text-xs">
            {t("pets.typeFedDescriptionOne", {
              type: type.toLowerCase(),
            })}
          </p>
          <p className="text-xs">
            {t("pets.typeFedDescriptionTwo", {
              type: type.toLowerCase(),
            })}
          </p>
          <Label
            type="info"
            icon={SUNNYSIDE.icons.stopwatch}
            className="-mb-1 mt-2"
          >
            {t("pets.comeBackIn", { time: getTimeUntilUTCReset() })}
          </Label>
        </div>
        <Button onClick={onClose}>{t("gotIt")}</Button>
      </InnerPanel>
    </div>
  );
};
