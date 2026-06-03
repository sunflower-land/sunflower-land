import React from "react";

import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getAnimalLevel } from "features/game/lib/animals";
import type { Animal } from "features/game/types/game";

interface Props {
  animal: Animal;
}

export const LockedAnimalModal = ({ animal }: Props) => {
  const { t } = useAppTranslation();

  const level = getAnimalLevel(animal.experience, animal.type);

  return (
    <InnerPanel>
      <div className="flex items-center mb-1">
        <Label type="default" className="mr-1">
          {t("lockedAnimal.title")}
        </Label>
        <Label type="formula" className="text-xs mr-1">
          {`Lvl. ${level}`}
        </Label>
        <Label type="danger">{t("lockedAnimal.locked")}</Label>
      </div>

      <div className="flex text-sm p-1 items-start">
        <img src={SUNNYSIDE.icons.lock} alt="Locked" className="w-6 mr-2" />
        <p className="text-xs">
          {t("lockedAnimal.description", { animal: animal.type })}
        </p>
      </div>
      <div className="flex text-sm p-1 items-start">
        <img src={SUNNYSIDE.icons.heart} alt="Unlock" className="w-6 mr-2" />
        <p className="text-xs">{t("lockedAnimal.howToUnlock")}</p>
      </div>
    </InnerPanel>
  );
};
