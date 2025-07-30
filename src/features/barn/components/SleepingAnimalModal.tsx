import React, { useState } from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";

import sleepIcon from "assets/icons/sleep.webp";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import { useGame } from "features/game/GameProvider";
import { getAnimalToy } from "features/game/events/landExpansion/wakeUpAnimal";
import { Animal } from "features/game/types/game";
import { getAnimalLevel } from "features/game/lib/animals";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
  awakeAt: number;
  animal: Animal;
  id: string;
}

export const SleepingAnimalModal = ({
  onClose,
  awakeAt,
  animal,
  id,
}: Props) => {
  const { gameService, gameState } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useAppTranslation();

  const secondsLeft = (awakeAt - Date.now()) / 1000;

  const toy = getAnimalToy({ animal });

  const count = gameState.context.state.inventory[toy] ?? new Decimal(0);

  const onWakeUp = () => {
    gameService.send("animal.wakeUp", {
      animal: animal.type,
      id,
    });
  };

  if (showConfirm) {
    return (
      <InnerPanel>
        <Label type="danger">{t("confirmTitle")}</Label>
        <p className="text-xs m-1">
          {t("sleepingAnimal.confirmMessage", {
            name: toy,
            animal: animal.type,
          })}
        </p>

        <div className="flex">
          <Button onClick={() => setShowConfirm(false)} className="mr-1">
            {t("sleepingAnimal.cancel")}
          </Button>
          <Button onClick={onWakeUp}>{t("sleepingAnimal.confirm")}</Button>
        </div>
      </InnerPanel>
    );
  }

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center">
          <Label
            type="default"
            className="mr-2"
          >{`${t("sleepingAnimal.sleeping")} ${animal.type}`}</Label>
          <p className="text-xs">{`Lvl. ${getAnimalLevel(animal.experience, animal.type)}`}</p>
        </div>

        <div className="flex text-sm p-1 items-center">
          <img src={sleepIcon} alt="Sleep" className="h-6 mr-2" />
          <span className="mr-2"> {t("wakesIn")}</span>
          <span className=" font-secondary">
            {secondsToString(secondsLeft, { length: "medium" })}
          </span>
        </div>
      </InnerPanel>
      {hasFeatureAccess(gameState.context.state, "CRAFTING") && (
        <InnerPanel>
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.heart} alt="Sleep" className="h-6 mr-2" />
            <p className="text-xs">
              {t("sleepingAnimal.sheepLoveToPlay", { name: animal.type })}
            </p>
          </div>

          <div className="flex items-center">
            <Box image={ITEM_DETAILS[toy].image} count={count} />
            <div>
              <p className="text-sm">
                {t("sleepingAnimal.dollCount", { name: toy })}
              </p>
              <p className="text-xs italic">
                {t("sleepingAnimal.availableAtCraftingBox")}
              </p>
            </div>
          </div>

          <Button disabled={count.lt(1)} onClick={() => setShowConfirm(true)}>
            {t("sleepingAnimal.wakeUp")}
          </Button>
        </InnerPanel>
      )}
    </>
  );
};
