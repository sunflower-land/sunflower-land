import React, { useState } from "react";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { addNoise } from "lib/images";

import { PLOT_CROPS } from "features/game/types/crops";
import { getKeys } from "features/game/types/craftables";

import { randomBoolean, randomDouble, randomInt } from "lib/utils/random";
import { Label } from "components/ui/Label";
import { PATCH_FRUIT } from "features/game/types/fruits";
import { CONSUMABLES } from "features/game/types/consumables";
import { COMMODITIES } from "features/game/types/resources";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const ITEM_COUNT = 16;
const MAX_ATTEMPTS = 3;
const GOBLIN_COUNT = 3;

type Item = {
  src: string;
  isGoblin: boolean;
  rotation: { x: number; y: number };
  skew: number;
  scale: number;
  flip: boolean;
};

const goblins = [
  SUNNYSIDE.npcs.goblin,
  SUNNYSIDE.npcs.goblin_carry,
  SUNNYSIDE.npcs.goblin_chef,
  SUNNYSIDE.npcs.goblin_chef_doing,
  SUNNYSIDE.npcs.goblin_digger,
  SUNNYSIDE.npcs.goblin_doing,
  SUNNYSIDE.npcs.goblin_farmer,
  SUNNYSIDE.npcs.goblinHead,
  SUNNYSIDE.npcs.goblin_jump_rusty_shovel,
  SUNNYSIDE.npcs.goblinSnorkling,
  SUNNYSIDE.npcs.goblin_treasure,
  SUNNYSIDE.npcs.pirate_goblin,
  SUNNYSIDE.npcs.suspiciousGoblin,
  SUNNYSIDE.npcs.goblin_watering,
  SUNNYSIDE.npcs.wheat_goblin,
];
const moonSeekers = [
  SUNNYSIDE.npcs.moonseeker_walk,
  SUNNYSIDE.npcs.moonseeker2,
  SUNNYSIDE.npcs.moonseeker3,
  SUNNYSIDE.npcs.moonseeker4,
  SUNNYSIDE.npcs.moonseeker5,
];

const generateImages = (
  isMoonSeekerMode: boolean,
  collectedItem?: InventoryItemName,
) => {
  const newImageItem = (src: any, isGoblin: boolean): Item => {
    return {
      src: src,
      isGoblin: isGoblin,
      rotation: {
        x: randomInt(-25, 26),
        y: randomInt(-25, 26),
      },
      skew: randomInt(-5, 6),
      scale: randomDouble(1.0, 1.2),
      flip: randomBoolean(),
    };
  };

  const items: Item[] = [];
  let resourceImages;
  if (isMoonSeekerMode) {
    resourceImages = [
      ...getKeys(PLOT_CROPS),
      ...getKeys(PATCH_FRUIT()),
      ...getKeys(COMMODITIES),
    ];
    resourceImages = resourceImages.filter(
      (name: InventoryItemName) => name !== collectedItem,
    );
  } else {
    resourceImages = getKeys(CONSUMABLES);
  }
  const availableResourceImages = resourceImages.map(
    (name) => ITEM_DETAILS[name].image,
  );

  const enemies = isMoonSeekerMode ? moonSeekers : goblins;

  while (items.length < GOBLIN_COUNT) {
    const randomIndex = randomInt(0, enemies.length);
    items.push(newImageItem(enemies[randomIndex], true));
  }

  while (items.length < ITEM_COUNT) {
    const randomIndex = randomInt(0, availableResourceImages.length);
    items.push(newImageItem(availableResourceImages[randomIndex], false));
  }

  // shuffle positions
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled;
};

interface Props {
  onOpen: () => void;
  onFail: () => void;
  collectedItem?: InventoryItemName;
}

export const StopTheGoblins: React.FC<Props> = ({
  onOpen,
  onFail,
  collectedItem,
}) => {
  const { t } = useAppTranslation();
  const [wrongAttempts, setWrongAttempts] = useState(new Set<number>());
  const [correctAttempts, setCorrectAttempts] = useState(new Set<number>());
  const [isMoonSeekerMode] = useState(randomBoolean());
  const [items] = useState(generateImages(isMoonSeekerMode, collectedItem));

  const attemptsLeft = MAX_ATTEMPTS - wrongAttempts.size;

  const check = (index: number) => {
    if (items[index].isGoblin) {
      const _correctAttempts = new Set([...correctAttempts, index]);
      setCorrectAttempts(_correctAttempts);

      if (_correctAttempts.size === GOBLIN_COUNT) {
        onOpen();
      }

      return;
    }

    const _wrongAttempts = new Set([...wrongAttempts, index]);
    setWrongAttempts(_wrongAttempts);

    if (_wrongAttempts.size >= MAX_ATTEMPTS) {
      onFail();
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <span className="text-center mb-2">
        {isMoonSeekerMode
          ? translate("stopGoblin.stop.moon")
          : translate("stopGoblin.stop.goblin")}
      </span>
      <div className="flex flex-wrap justify-center items-center">
        {items.map((item, index) => {
          const failed = wrongAttempts.has(index);
          const confirmed = correctAttempts.has(index);

          return (
            <div
              key={index}
              className="w-1/4 h-12 flex justify-center items-center p-1 mb-1 cursor-pointer group"
              onClick={() => check(index)}
            >
              {failed || confirmed ? (
                <img
                  src={
                    failed ? SUNNYSIDE.icons.cancel : SUNNYSIDE.icons.confirm
                  }
                  className="h-full object-contain"
                />
              ) : (
                <img
                  src={item.src}
                  className="h-full object-contain"
                  onLoad={(e) => addNoise(e.currentTarget)}
                  style={{
                    transform: `perspective(9cm) skew(${item.skew}deg, ${
                      item.skew
                    }deg) rotateX(${item.rotation.x}deg) rotateY(${
                      item.rotation.y
                    }deg) scaleX(${item.scale * (item.flip ? -1 : 1)}) scaleY(${
                      item.scale
                    })`,
                  }}
                />
              )}
            </div>
          );
        })}
        <span className="text-sm mt-2 text-center">
          {isMoonSeekerMode ? t("stopGoblin.tap.one") : t("stopGoblin.tap.two")}
        </span>

        <Label className="my-1" type={attemptsLeft <= 2 ? "danger" : "info"}>
          {t("stopGoblin.left", { attemptsLeft: attemptsLeft })}
        </Label>
      </div>
    </div>
  );
};
