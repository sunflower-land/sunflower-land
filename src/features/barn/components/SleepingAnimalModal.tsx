import React, { useContext, useState } from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";

import sleepIcon from "assets/icons/sleep.webp";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { getAnimalToy } from "features/game/events/landExpansion/wakeUpAnimal";
import type { Animal } from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  isMaxLevel as isMaxAnimalLevel,
} from "features/game/lib/animals";
import { ANIMAL_LEVELS, type AnimalLevel } from "features/game/types/animals";
import {
  getAnimalXP,
  getNextLoveAvailableAt,
} from "features/game/events/landExpansion/loveAnimal";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { useSelector } from "@xstate/react";
import glow from "public/world/glow.png";
import { useCountdown } from "lib/utils/hooks/useCountdown";

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
  const { gameService } = useContext(Context);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useAppTranslation();
  const { totalSeconds: secondsLeft } = useCountdown(awakeAt);
  const { totalSeconds: secondsUntilLove } = useCountdown(
    getNextLoveAvailableAt(animal),
  );

  const toy = getAnimalToy({ animal });
  const state = useSelector(gameService, (state) => state.context.state);

  const { count } = getCountAndType(state, toy);

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

  // Get the XP for the current love item
  const { animalXP } = getAnimalXP({
    name: animal.item,
    state,
    animal: animal.type,
  });

  const hasTool = getCountAndType(state, animal.item).count.gt(0);

  const level = getAnimalLevel(animal.experience, animal.type);
  const isMaxLevel = isMaxAnimalLevel(animal.type, level);

  const xpToNext = isMaxLevel
    ? (() => {
        const levelBeforeMaxXP =
          ANIMAL_LEVELS[animal.type][(level - 1) as AnimalLevel];
        const maxLevelXP = ANIMAL_LEVELS[animal.type][level as AnimalLevel];
        const cycleXP = maxLevelXP - levelBeforeMaxXP;
        const excessXP = animal.experience - maxLevelXP;
        return cycleXP - (excessXP % cycleXP);
      })()
    : ANIMAL_LEVELS[animal.type][(level + 1) as AnimalLevel] -
      animal.experience;

  const { name: mutantName } = animal.reward?.items?.[0] ?? {};

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center">
          <Label
            type="default"
            className="mr-1"
          >{`${t("sleepingAnimal.sleeping")} ${animal.type}`}</Label>
          <Label type="formula" className="text-xs">
            {`Lvl. ${level}`}
          </Label>
          {isMaxLevel && <Label type="warning">{"MAX"}</Label>}
        </div>

        <div className="flex text-sm p-1 items-center">
          <img src={sleepIcon} alt="Sleep" className="w-6 mr-2" />
          <span className="mr-2">
            {" "}
            {`${t("wakesIn")} ${secondsToString(secondsLeft, { length: "medium" })}`}
          </span>
        </div>
        {/* XP progress */}
        <div className="flex text-sm p-1 items-center">
          <img src={SUNNYSIDE.icons.lightning} alt="XP" className="w-6 mr-2" />
          <div className="flex justify-between w-full text-xs">
            <span>
              {t("sleepingAnimal.xp", { experience: animal.experience })}
            </span>
            {isMaxLevel ? (
              <span>{t("sleepingAnimal.xpToNextCycle", { xpToNext })}</span>
            ) : (
              <span>
                {t("sleepingAnimal.xpToNextLevel", {
                  xpToNext,
                  level: level + 1,
                })}
              </span>
            )}
          </div>
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
            <span className="text-xs -top-0.5 relative">
              {secondsUntilLove > 0
                ? t("pets.nextRequestsIn", {
                    time: secondsToString(secondsUntilLove, {
                      length: "medium",
                    }),
                  })
                : t("ready")}
            </span>
          </div>
        </div>

        {mutantName && (
          <div className="flex p-1 items-center w-[330px]">
            <img src={glow} className="w-6 mr-2" />
            <div>
              <p className="text-sm mr-2">
                {t("sleepingAnimal.mutantClue1", { type: animal.type })}
              </p>
              <p className="text-xs mr-2">{t("sleepingAnimal.mutantClue2")}</p>
            </div>
          </div>
        )}

        {animal.feedBuff && (
          <div className="flex text-sm p-1 items-center">
            <img
              src={ITEM_DETAILS[animal.feedBuff.name].image}
              alt={animal.feedBuff.name}
              className="w-6 mr-2"
            />
            <div>
              <p className="text-sm font-secondary">{animal.feedBuff.name}</p>
              <span className="text-xs -top-0.5 relative">
                {t("sleepingAnimal.harvestsLeft", {
                  count: animal.feedBuff.harvestsRemaining,
                })}
              </span>
            </div>
          </div>
        )}
      </InnerPanel>

      {level < 15 && (
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
