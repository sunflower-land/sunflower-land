import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  BumpkinPart,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import React, { useState } from "react";
import { DynamicNFT } from "./DynamicNFT";
import { NPC } from "features/island/bumpkin/components/NPC";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/types/craftables";

import { Label } from "components/ui/Label";
import classNames from "classnames";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { GameState } from "features/game/types/game";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const REQUIRED: BumpkinPart[] = [
  "background",
  "body",
  "dress",
  "shirt",
  "pants",
  "hair",
  "shoes",
  "tool",
];

interface Props {
  onEquip: (equipment: BumpkinParts) => void;
  equipment: BumpkinParts;
  game: GameState;
}

export const BumpkinEquip: React.FC<Props> = ({ equipment, onEquip, game }) => {
  const [equipped, setEquipped] = useState(equipment);

  /**
   * Show available wardrobe and currently equipped items
   */
  const wardrobe = Object.values(equipment ?? {}).reduce(
    (acc, name) => ({
      ...acc,
      [name]: 1,
    }),
    availableWardrobe(game)
  );

  const equipPart = (name: BumpkinItem) => {
    const part = BUMPKIN_ITEM_PART[name];
    const outfit = {
      ...equipped,
      [part]: name,
    };

    if (part === "dress") {
      delete outfit.shirt;
      delete outfit.pants;
    }

    if (part === "shirt") {
      delete outfit.dress;
    }

    if (part === "pants") {
      delete outfit.dress;
    }

    setEquipped(outfit);
  };

  const unequipPart = (name: BumpkinItem) => {
    if (REQUIRED.includes(BUMPKIN_ITEM_PART[name])) {
      return;
    }
    const part = BUMPKIN_ITEM_PART[name];
    const outfit = { ...equipped };

    delete outfit[part];

    setEquipped(outfit);
  };

  const finish = (equipment: BumpkinParts) => {
    onEquip(equipment);
  };

  const isDirty = JSON.stringify(equipped) !== JSON.stringify(equipment);

  const equippedItems = Object.values(equipped);

  const isMissingBackground = !equipped.background;
  const isMissingHair = !equipped.hair;
  const isMissingBody = !equipped.body;
  const isMissingShoes = !equipped.shoes;
  const isMissingShirt = !equipped.shirt && !equipped.dress;
  const isMissingPants = !equipped.pants && !equipped.dress;

  const warn =
    isMissingHair ||
    isMissingBody ||
    isMissingShoes ||
    isMissingShirt ||
    isMissingBackground ||
    isMissingPants;

  const { t } = useAppTranslation();
  const warning = () => {
    if (isMissingHair) {
      return t("equip.missingHair");
    }

    if (isMissingBody) {
      return t("equip.missingBody");
    }

    if (isMissingShoes) {
      return t("equip.missingShoes");
    }

    if (isMissingShirt) {
      return t("equip.missingShirt");
    }

    if (isMissingPants) {
      return t("equip.missingPants");
    }

    if (isMissingBackground) {
      return t("equip.missingBackground");
    }
    return "";
  };
  const sortedWardrobeNames = getKeys(wardrobe).sort((a, b) =>
    a.localeCompare(b)
  );
  return (
    <div className="p-2">
      <div className="flex justify-center">
        <div className="w-1/3  mr-1">
          <div className="w-full  relative rounded-xl overflow-hidden mr-2 mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute  w-8 h-8 bottom-10 right-4">
              <NPC parts={equipped} key={JSON.stringify(equipped)} />
            </div>
          </div>
          <Button disabled={!isDirty || warn} onClick={() => finish(equipped)}>
            <div className="flex">{t("save")}</div>
          </Button>
          {warn && <Label type="warning">{warning()}</Label>}
        </div>
        <div className="flex-1 flex flex-wrap justify-center pr-1 overflow-y-auto scrollable max-h-[290px]">
          {sortedWardrobeNames.map((name) => {
            const buffLabel = BUMPKIN_ITEM_BUFF_LABELS[name];

            return (
              <OuterPanel
                key={name}
                className={classNames("w-full flex mb-1 !p-1 relative", {
                  "cursor-pointer hover:bg-brown-200":
                    !equippedItems.includes(name) ||
                    !REQUIRED.includes(BUMPKIN_ITEM_PART[name]),
                })}
                onClick={() => {
                  // Already equipped
                  if (equippedItems.includes(name)) {
                    unequipPart(name);
                  } else {
                    equipPart(name);
                  }
                }}
              >
                {equippedItems.includes(name) && (
                  <img
                    className="absolute h-4 right-0 top-0"
                    src={SUNNYSIDE.icons.confirm}
                  />
                )}
                <div className="flex-1 flex flex-col">
                  <p className="text-xs flex-1">{name}</p>
                  {!!buffLabel && (
                    <div className="mt-1">
                      <Label
                        type={buffLabel.labelType}
                        icon={buffLabel.boostTypeIcon}
                        secondaryIcon={buffLabel.boostedItemIcon}
                      >
                        <p className="text-xxs">{buffLabel.shortDescription}</p>
                      </Label>
                    </div>
                  )}
                </div>
                <img
                  src={getImageUrl(ITEM_IDS[name])}
                  className="h-10 rounded-md"
                />
              </OuterPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};
