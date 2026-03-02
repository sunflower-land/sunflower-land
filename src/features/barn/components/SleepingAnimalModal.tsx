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
import { Animal } from "features/game/types/game";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
} from "features/game/lib/animals";
import { getAnimalXP } from "features/game/events/landExpansion/loveAnimal";
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

  const toy = getAnimalToy({ animal });
  const state = useSelector(gameService, (state) => state.context.state);

  const { count } = getCountAndType(state, toy);

  const onWakeUp = () => {
    gameService.send({ type: "animal.wakeUp", animal: animal.type, id });
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
    state,
    animal: animal.type,
  });

  const hasTool = getCountAndType(state, animal.item).count.gt(0);

  const level = getAnimalLevel(animal.experience, animal.type);

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
