import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  BumpkinPart,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import React, { useEffect, useState } from "react";
import { DynamicNFT } from "./DynamicNFT";
import { NPC } from "features/island/bumpkin/components/NPC";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { SquareIcon } from "components/ui/SquareIcon";
import { BumpkinPartGroup } from "./BumpkinPartGroup";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/types/craftables";

import lightning from "assets/icons/lightning.png";

import { Label } from "components/ui/Label";
import classNames from "classnames";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { GameState } from "features/game/types/game";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import { pixelBlueBorderStyle } from "features/game/lib/style";

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

const NOTREQUIRED: BumpkinPart[] = [
  "necklace",
  "coat",
  "hat",
  "secondaryTool",
  "onesie",
  "suit",
  "wings",
  "beard",
];

interface Props {
  onEquip: (equipment: BumpkinParts) => void;
  equipment: BumpkinParts;
  game: GameState;
}

export const BumpkinEquip: React.FC<Props> = ({ equipment, onEquip, game }) => {
  const [equipped, setEquipped] = useState(equipment);
  const [selectedBumpkinPart, setSelectedBumpkinPart] = useState(REQUIRED[0]);
  const [selectedBumpkinItem, setSelectedBumpkinItem] = useState(
    equipped[REQUIRED[0]]
  );
  const [filteredWardrobeNames, setFilteredWardrobeNames] = useState<
    BumpkinItem[]
  >([]);

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
  const wardrobeSortedByBuff = sortedWardrobeNames
    .filter((name) => BUMPKIN_ITEM_BUFF_LABELS[name])
    .concat(
      sortedWardrobeNames.filter((name) => !BUMPKIN_ITEM_BUFF_LABELS[name])
    );

  useEffect(() => {
    const filteredWardrobe = wardrobeSortedByBuff.filter(
      (name) => BUMPKIN_ITEM_PART[name] === selectedBumpkinPart
    );
    setFilteredWardrobeNames(filteredWardrobe);
    setSelectedBumpkinItem(equipped[selectedBumpkinPart]);
  }, [selectedBumpkinPart]);

  return (
    <div className="p-2">
      <div className="flex flex-wrap justify-center">
        <div className="w-1/3 flex flex-col justify-center">
          <div className="w-full relative rounded-xl overflow-hidden mr-2 mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute w-8 h-8 bottom-10 right-4">
              <NPC parts={equipped} key={JSON.stringify(equipped)} />
            </div>
          </div>
          <Button disabled={!isDirty || warn} onClick={() => finish(equipped)}>
            <div className="flex">{t("save")}</div>
          </Button>
          {warn && <Label type="warning">{warning()}</Label>}
        </div>
        <div className="w-2/3 sm:w-[32%] flex flex-col gap-2 mt-1 pl-2 mb-2 sm:pr-2 sm:mb-0">
          <Label type="default">{t("required")}</Label>
          <BumpkinPartGroup
            bumpkinParts={REQUIRED}
            equipped={equipped}
            selected={selectedBumpkinPart}
            onSelect={(bumpkinPart) => setSelectedBumpkinPart(bumpkinPart)}
          ></BumpkinPartGroup>
          <Label type="default">{t("optional")}</Label>
          <BumpkinPartGroup
            bumpkinParts={NOTREQUIRED}
            equipped={equipped}
            selected={selectedBumpkinPart}
            onSelect={(bumpkinPart) => setSelectedBumpkinPart(bumpkinPart)}
          ></BumpkinPartGroup>
        </div>

        <div className="flex-1 flex max-h-[300px] sm:max-h-[294px]">
          <OuterPanel className="w-full flex flex-col !pt-1 !pb-0 !px-1 min-h-[106px]">
            <div className="w-full pb-1">
              <Label type="default">{`${t(
                `equip.${selectedBumpkinPart}`
              )}`}</Label>
            </div>
            <div className="flex-col flex-1 overflow-y-auto scrollable justify-center items-center">
              {filteredWardrobeNames.length === 0 ? (
                <div className="flex h-full justify-center items-center text-xs">
                  <p>{t("empty")}</p>
                </div>
              ) : (
                <div className="w-full grid grid-cols-5 sm:grid-cols-4 py-1 px-1 gap-2">
                  {filteredWardrobeNames.map((name) => {
                    const buffLabel = BUMPKIN_ITEM_BUFF_LABELS[name];

                    return (
                      <OuterPanel
                        key={name}
                        className={classNames(
                          "w-full relative hover:img-highlight !p-0",
                          {
                            "img-highlight": selectedBumpkinItem === name,
                            "cursor-pointer":
                              !equippedItems.includes(name) ||
                              !REQUIRED.includes(BUMPKIN_ITEM_PART[name]),
                          }
                        )}
                        onClick={() => {
                          setSelectedBumpkinItem(name);
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
                            className="absolute h-4 -left-2 -top-2"
                            src={SUNNYSIDE.icons.confirm}
                          />
                        )}
                        {!!buffLabel && (
                          <div
                            className="absolute -right-2 -top-2 bg-[#1e6dd5]"
                            style={{ ...pixelBlueBorderStyle }}
                          >
                            <SquareIcon icon={lightning} width={4} />
                          </div>
                        )}
                        <img
                          src={getImageUrl(ITEM_IDS[name])}
                          className="w-full aspect-square"
                        />
                      </OuterPanel>
                    );
                  })}
                </div>
              )}
            </div>
            {(() => {
              const buffLabel = selectedBumpkinItem
                ? BUMPKIN_ITEM_BUFF_LABELS[selectedBumpkinItem] ?? ""
                : "";

              return (
                selectedBumpkinItem && (
                  <InnerPanel
                    className="relative bottom-[-5px] left-[-9px] !px-2 !pb-1 z-10"
                    style={{ width: "calc(100% + 18px)" }}
                  >
                    <p className="text-xs flex-1">{selectedBumpkinItem}</p>
                    {buffLabel && (
                      <div className="mt-1">
                        <Label
                          type={buffLabel.labelType}
                          icon={buffLabel.boostTypeIcon}
                          secondaryIcon={buffLabel.boostedItemIcon}
                        >
                          <p className="text-xxs">
                            {buffLabel.shortDescription}
                          </p>
                        </Label>
                      </div>
                    )}
                  </InnerPanel>
                )
              );
            })()}
          </OuterPanel>
        </div>
      </div>
    </div>
  );
};
