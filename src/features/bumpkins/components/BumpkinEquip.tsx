import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  BumpkinPart,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import React, { useContext, useState } from "react";
import { DynamicNFT } from "./DynamicNFT";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { SquareIcon } from "components/ui/SquareIcon";
import { BumpkinPartGroup } from "./BumpkinPartGroup";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/types/craftables";

import lightning from "assets/icons/lightning.png";

import { Label } from "components/ui/Label";
import classNames from "classnames";
import {
  BUMPKIN_ITEM_BUFF_LABELS,
  SPECIAL_ITEM_LABELS,
} from "features/game/types/bumpkinItemBuffs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  pixelBlueBorderStyle,
  pixelGrayBorderStyle,
  pixelVibrantBorderStyle,
} from "features/game/lib/style";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

const REQUIRED: BumpkinPart[] = ["background", "body", "hair", "shoes", "tool"];

const REQUIRED_BUT_INCOMPATIBLE: BumpkinPart[][] = [
  ["shirt", "pants"],
  ["dress"],
];

const NOTREQUIRED: BumpkinPart[] = [
  "hat",
  "beard",
  "necklace",
  "coat",
  "wings",
  "suit",
  "onesie",
  "secondaryTool",
  "aura",
];

interface Props {
  onEquip: (equipment: BumpkinParts) => void;
  equipment: BumpkinParts;
}

const _game = (state: MachineState) => state.context.state;

export const BumpkinEquip: React.FC<Props> = ({ equipment, onEquip }) => {
  const { gameService } = useContext(Context);
  const [equipped, setEquipped] = useState(equipment);
  const [selectedBumpkinPart, setSelectedBumpkinPart] = useState(REQUIRED[0]);

  const game = useSelector(gameService, _game);

  /**
   * Show available wardrobe and currently equipped items
   */
  const wardrobe = Object.values(equipment ?? {}).reduce((acc, name) => {
    const available = availableWardrobe(game)[name] ?? 0;

    return {
      ...acc,
      [name]: available,
    };
  }, availableWardrobe(game));

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

  const { t } = useAppTranslation();

  const sortedWardrobeNames = getKeys(wardrobe).sort((a, b) =>
    a.localeCompare(b),
  );
  const wardrobeSortedByBuff = sortedWardrobeNames
    .filter((name) => BUMPKIN_ITEM_BUFF_LABELS[name])
    .concat(
      sortedWardrobeNames.filter((name) => !BUMPKIN_ITEM_BUFF_LABELS[name]),
    );

  const filteredWardrobeNames = wardrobeSortedByBuff.filter(
    (name) => BUMPKIN_ITEM_PART[name] === selectedBumpkinPart,
  );

  const selectedBumpkinItem = equipped[selectedBumpkinPart];

  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2">
        <div className="w-full sm:w-1/3 flex flex-col justify-center">
          <div className="w-full relative rounded-xl overflow-hidden mr-2 mb-1">
            <DynamicNFT
              showBackground
              bumpkinParts={equipped}
              key={JSON.stringify(equipped)}
            />
            <div className="absolute w-8 h-8 bottom-10 right-4">
              <NPCIcon parts={equipped} key={JSON.stringify(equipped)} />
            </div>
          </div>
          <Button disabled={!isDirty} onClick={() => finish(equipped)}>
            <div className="flex">{t("save")}</div>
          </Button>
        </div>
        <div className="w-full sm:w-1/3 flex flex-col gap-2">
          <Label type="default">{t("required")}</Label>
          <BumpkinPartGroup
            bumpkinParts={REQUIRED}
            equipped={equipped}
            selected={selectedBumpkinPart}
            onSelect={(bumpkinPart) => setSelectedBumpkinPart(bumpkinPart)}
          />
          <Label type="default">{t("equip.chooseDressOrShirt&Pants")}</Label>
          <div className="flex divide-x-2 divide-white mb-2 w-full">
            {REQUIRED_BUT_INCOMPATIBLE.map((parts, index) => (
              <div
                key={parts.join(",")}
                className={classNames("md:w-1/2", {
                  "pl-2": index > 0,
                  "pr-2": index === 0,
                  "w-2/5 sm:w-2/3": index === 0,
                  "w-3/5 sm:w-1/3": index === 1,
                })}
              >
                <BumpkinPartGroup
                  bumpkinParts={parts}
                  equipped={equipped}
                  selected={selectedBumpkinPart}
                  onSelect={(bumpkinPart) =>
                    setSelectedBumpkinPart(bumpkinPart)
                  }
                  gridStyling={`grid ${index === 1 ? "grid-cols-3 sm:grid-cols-1 md:grid-cols-2" : "grid-cols-2"} gap-2`}
                />
              </div>
            ))}
          </div>
          <Label type="default">{t("optional")}</Label>
          <BumpkinPartGroup
            bumpkinParts={NOTREQUIRED}
            equipped={equipped}
            selected={selectedBumpkinPart}
            onSelect={(bumpkinPart) => setSelectedBumpkinPart(bumpkinPart)}
          />
        </div>

        <div className="flex-1 flex max-h-[300px] sm:max-h-[306px]">
          <OuterPanel className="w-full flex flex-col !pt-1 !pb-0 !px-1 min-h-[106px]">
            <div className="w-full pb-1">
              <Label type="default">{`${t(
                `equip.${selectedBumpkinPart}`,
              )}`}</Label>
            </div>
            <div className="flex-col flex-1 overflow-y-auto scrollable justify-center items-center">
              {filteredWardrobeNames.length === 0 ? (
                <div className="flex h-full justify-center items-center text-xs">
                  <p>{t("empty")}</p>
                </div>
              ) : (
                <div className="w-full grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 py-1 px-1 gap-2">
                  {filteredWardrobeNames.map((name) => {
                    const boostLabel =
                      BUMPKIN_ITEM_BUFF_LABELS[name] &&
                      !SPECIAL_ITEM_LABELS[name];

                    const specialItem = SPECIAL_ITEM_LABELS[name];

                    const buffLabel = boostLabel || specialItem;
                    const amountEquipped = wardrobe[name] ?? 0;

                    const unavailable =
                      !wardrobe[name] && !equippedItems.includes(name);

                    return (
                      <Popover key={name}>
                        <PopoverButton
                          as="div"
                          className="cursor-pointer"
                          disabled={!unavailable}
                        >
                          <OuterPanel
                            className={classNames(
                              "w-full relative  !p-0 flex items-center justify-center",
                              {
                                "hover:img-highlight": !unavailable,
                                "img-highlight":
                                  selectedBumpkinItem === name && !unavailable,
                                "cursor-pointer":
                                  (!equippedItems.includes(name) ||
                                    !REQUIRED.includes(
                                      BUMPKIN_ITEM_PART[name],
                                    )) &&
                                  !unavailable,
                                "opacity-50": unavailable,
                              },
                            )}
                            onClick={() => {
                              if (unavailable) {
                                return;
                              }
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
                            {amountEquipped > 0 && (
                              <div
                                className="absolute -right-2 -bottom-2 bg-[#c0cbdc] text-[#181425] text-xs"
                                style={pixelGrayBorderStyle}
                              >
                                {amountEquipped}
                              </div>
                            )}
                            {!!buffLabel && (
                              <div
                                className={classNames(
                                  "absolute -right-2 -top-2",
                                  {
                                    "bg-[#b65389]": specialItem,
                                    "bg-[#1e6dd5]": boostLabel,
                                  },
                                )}
                                style={
                                  specialItem
                                    ? pixelVibrantBorderStyle
                                    : pixelBlueBorderStyle
                                }
                              >
                                <SquareIcon icon={lightning} width={4} />
                              </div>
                            )}
                            <img
                              src={
                                new URL(
                                  `/src/assets/wearables/${ITEM_IDS[name]}.webp`,
                                  import.meta.url,
                                ).href
                              }
                              className="h-10"
                            />
                          </OuterPanel>
                        </PopoverButton>
                        <PopoverPanel
                          anchor={{ to: "right end" }}
                          className="flex pointer-events-none"
                        >
                          <InnerPanel>
                            <p className="text-xxs">
                              {t("marketplace.itemInUse")}
                            </p>
                          </InnerPanel>
                        </PopoverPanel>
                      </Popover>
                    );
                  })}
                </div>
              )}
            </div>
            {(() => {
              const buffLabel = selectedBumpkinItem
                ? (BUMPKIN_ITEM_BUFF_LABELS[selectedBumpkinItem] ?? "")
                : "";

              return (
                selectedBumpkinItem && (
                  <InnerPanel
                    className="relative bottom-[-5px] left-[-9px] !px-2 !pb-1 z-10"
                    style={{ width: "calc(100% + 18px)" }}
                  >
                    <p className="text-xs flex-1">{selectedBumpkinItem}</p>
                    {buffLabel && (
                      <div className="flex flex-col gap-1 mt-1">
                        {buffLabel.map(
                          (
                            {
                              labelType,
                              boostTypeIcon,
                              boostedItemIcon,
                              shortDescription,
                            },
                            index,
                          ) => (
                            <Label
                              key={index}
                              type={labelType}
                              icon={boostTypeIcon}
                              secondaryIcon={boostedItemIcon}
                            >
                              {shortDescription}
                            </Label>
                          ),
                        )}
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
