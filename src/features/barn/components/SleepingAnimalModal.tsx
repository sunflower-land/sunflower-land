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
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
} from "features/game/lib/animals";
import { hasFeatureAccess } from "lib/flags";
import { getAnimalXP } from "features/game/events/landExpansion/loveAnimal";

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
    onClose();
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

  const favouriteFood = getAnimalFavoriteFood(animal.type, animal.experience);

  // Calculate when the animal can be loved again
  const lovePeriod = (animal.awakeAt - animal.asleepAt) / 3;

  // Get the XP for the current love item
  const { animalXP } = getAnimalXP({
    name: animal.item,
    state: gameState.context.state,
    animal: animal.type,
  });

  const hasTool = gameState.context.state.inventory[animal.item]?.gt(0);

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center">
          <Label
            type="default"
            className="mr-1"
          >{`${t("sleepingAnimal.sleeping")} ${animal.type}`}</Label>
          <Label type="formula" className="text-xs">
            {`Lvl. ${getAnimalLevel(animal.experience, animal.type)}`}
          </Label>
        </div>

        <div className="flex text-sm p-1 items-center">
          <img src={sleepIcon} alt="Sleep" className="w-6 mr-2" />
          <span className="mr-2">
            {" "}
            {`${t("wakesIn")} ${secondsToString(secondsLeft, { length: "medium" })}`}
          </span>
        </div>
        <div className="flex text-sm p-1 items-center">
          <img
            src={ITEM_DETAILS[favouriteFood].image}
            alt="Sleep"
            className="w-6 mr-2"
          />
          <div className="flex items-center justify-between w-full">
            <span className="mr-2">
              {t("sleepingAnimal.favouriteFood")} {favouriteFood}
            </span>
          </div>
        </div>
        <div className="flex text-sm p-1 items-center">
          <img
            src={ITEM_DETAILS[animal.item].image}
            alt="Sleep"
            className="w-6 mr-2"
          />
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-secondary">{`${animal.item} (+${animalXP}XP)`}</p>
              {!hasTool && (
                <Label type="danger" className="text-xxs">
                  {t("sleepingAnimal.missing")}
                </Label>
              )}
            </div>
            <span className="text-xs -top-0.5 relative">{`${t("sleepingAnimal.every")} ${secondsToString(
              lovePeriod / 1000,
              {
                length: "short",
              },
            )}`}</span>
          </div>
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

          <div className="flex items-center mt-1">
            <Box image={ITEM_DETAILS[toy].image} count={count} />
            <div className="ml-1">
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
