import React, { useContext } from "react";

import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getAnimalLevel } from "features/game/lib/animals";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Animal } from "features/game/types/game";
import { getTranslatedItemName } from "features/game/types/images";

interface Props {
  animal: Animal;
}

const _game = (state: MachineState) => state.context.state;

export const LockedAnimalModal = ({ animal }: Props) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);

  const level = getAnimalLevel(animal.experience, animal.type, game);

  return (
    <InnerPanel>
      <div className="flex items-center mb-1">
        <Label type="default" className="mr-1">
          {t("lockedAnimal.title")}
        </Label>
        <Label type="formula" className="text-xs mr-1">
          {t("level.short", { level })}
        </Label>
        <Label type="danger">{t("lockedAnimal.locked")}</Label>
      </div>

      <div className="flex text-sm p-1 items-start">
        <img src={SUNNYSIDE.icons.lock} alt="Locked" className="w-6 mr-2" />
        <p className="text-xs">
          {t("lockedAnimal.description", {
            animal: getTranslatedItemName(animal.type),
          })}
        </p>
      </div>
      <div className="flex text-sm p-1 items-start">
        <img src={SUNNYSIDE.icons.heart} alt="Unlock" className="w-6 mr-2" />
        <p className="text-xs">{t("lockedAnimal.howToUnlock")}</p>
      </div>
    </InnerPanel>
  );
};
