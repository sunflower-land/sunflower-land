import React, { useRef, useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { WardrobeFilters } from "./WardrobeFilters";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "lib/object";
import { getWearableImage } from "features/game/lib/getWearableImage";
import {
  BUMPKIN_ITEM_PART,
  type BumpkinItem,
  type BumpkinPart,
} from "features/game/types/bumpkin";
import {
  BUMPKIN_ITEM_BUFF_LABELS,
  SPECIAL_ITEM_LABELS,
} from "features/game/types/bumpkinItemBuffs";
import type { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import lightning from "assets/icons/lightning.png";
import classNames from "classnames";
import {
  pixelBlueBorderStyle,
  pixelGrayBorderStyle,
  pixelVibrantBorderStyle,
} from "features/game/lib/style";

type BoostFilterId = "withBoost" | "withoutBoost";

const hasBoost = (item: BumpkinItem) =>
  !!BUMPKIN_ITEM_BUFF_LABELS[item] || !!SPECIAL_ITEM_LABELS[item];

// Order the wearable slots the way a player thinks about an outfit, rather
// than the internal Wallet key order.
const WARDROBE_PART_ORDER: BumpkinPart[] = [
  "hat",
  "shirt",
  "dress",
  "pants",
  "shoes",
  "coat",
  "suit",
  "onesie",
  "wings",
  "necklace",
  "aura",
  "beard",
  "background",
  "hair",
  "tool",
  "secondaryTool",
];

interface Props {
  state: GameState;
}

export const Wardrobe: React.FC<Props> = ({ state }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslation();
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [boostFilter, setBoostFilter] = useState<BoostFilterId>();
  const [selected, setSelected] = useState<BumpkinItem | undefined>();

  const equippedElsewhere = new Set<BumpkinItem>(
    Object.values(state.farmHands.bumpkins).flatMap((farmHand) =>
      getKeys(farmHand.equipped).map((part) => farmHand.equipped[part]),
    ) as BumpkinItem[],
  );

  const owned = getKeys(state.wardrobe).filter(
    (item) => (state.wardrobe[item] ?? 0) > 0,
  );

  const groups = WARDROBE_PART_ORDER.map((part) => ({
    part,
    items: owned
      .filter((item) => BUMPKIN_ITEM_PART[item] === part)
      .sort((a, b) => a.localeCompare(b)),
  })).filter((group) => group.items.length > 0);

  const query = search.trim().toLowerCase();
  const matchesSearch = (item: BumpkinItem) =>
    !query || item.toLowerCase().includes(query);

  const toggleSlotCategory = (id: string) =>
    setActiveCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const slotCategories = groups.map((group) => ({
    id: group.part,
    label: t(`equip.${group.part}`),
  }));

  const matchesBoostFilter = (item: BumpkinItem) => {
    if (boostFilter === "withBoost") return hasBoost(item);
    if (boostFilter === "withoutBoost") return !hasBoost(item);
    return true;
  };

  const visibleGroups = groups
    .filter(
      (group) =>
        activeCategories.length === 0 || activeCategories.includes(group.part),
    )
    .map((group) => ({
      ...group,
      items: group.items.filter(matchesSearch).filter(matchesBoostFilter),
    }))
    .filter((group) => group.items.length > 0);

  const selectedItem =
    selected && owned.includes(selected)
      ? selected
      : (visibleGroups[0]?.items[0] ?? owned[0]);

  if (owned.length === 0) {
    return (
      <InnerPanel className="flex flex-col justify-evenly items-center px-2 !py-[50px]">
        <img
          src={SUNNYSIDE.icons.expression_confused}
          alt="Empty Wardrobe"
          style={{
            width: `${PIXEL_SCALE * 17}px`,
          }}
        />
        <span className="text-xs text-center mt-2">
          {t("statements.empty.wardrobe")}
        </span>
      </InnerPanel>
    );
  }

  return (
    <>
      <WardrobeFilters
        search={search}
        onSearchChange={setSearch}
        slotCategories={slotCategories}
        activeSlotCategories={activeCategories}
        onToggleSlotCategory={toggleSlotCategory}
        onClearSlotCategories={() => setActiveCategories([])}
        boostFilter={boostFilter}
        onSetBoostFilter={setBoostFilter}
      />
      <SplitScreenView
        divRef={divRef}
        tallMobileContent
        wideModal
        showPanel={!!selectedItem}
        panel={
          selectedItem && (
            <WardrobeItemDetails
              item={selectedItem}
              isEquipped={
                Object.values(state.bumpkin?.equipped ?? {}).includes(
                  selectedItem,
                ) || equippedElsewhere.has(selectedItem)
              }
            />
          )
        }
        content={
          <>
            {visibleGroups.length === 0 && (
              <div className="flex flex-col justify-center items-center w-full p-4">
                <img
                  src={SUNNYSIDE.icons.search}
                  alt=""
                  style={{ width: `${PIXEL_SCALE * 10}px` }}
                />
                <span className="text-xs text-center mt-2">
                  {t("inventory.noResults")}
                </span>
              </div>
            )}
            {visibleGroups.map(({ part, items }) => (
              <div className="flex flex-col pl-2 mb-2 w-full" key={part}>
                <Label type="default" className="my-1">
                  {t(`equip.${part}`)}
                </Label>
                <div className="flex mb-2 flex-wrap gap-2">
                  {items.map((item) => {
                    const boostLabel =
                      BUMPKIN_ITEM_BUFF_LABELS[item] &&
                      !SPECIAL_ITEM_LABELS[item];
                    const specialItem = SPECIAL_ITEM_LABELS[item];
                    const isEquipped =
                      Object.values(state.bumpkin?.equipped ?? {}).includes(
                        item,
                      ) || equippedElsewhere.has(item);
                    const amountOwned = state.wardrobe[item] ?? 0;

                    return (
                      <OuterPanel
                        key={item}
                        className={classNames(
                          "w-14 h-14 relative !p-0 flex items-center justify-center cursor-pointer",
                          {
                            "img-highlight": selectedItem === item,
                            "hover:img-highlight": selectedItem !== item,
                          },
                        )}
                        onClick={() => setSelected(item)}
                      >
                        {isEquipped && (
                          <img
                            className="absolute h-4 -left-2 -top-2"
                            src={SUNNYSIDE.icons.confirm}
                            alt="Equipped"
                          />
                        )}
                        {amountOwned > 1 && (
                          <div
                            className="absolute -right-2 -bottom-2 bg-[#c0cbdc] text-[#181425] text-xs"
                            style={pixelGrayBorderStyle}
                          >
                            {amountOwned}
                          </div>
                        )}
                        {(!!boostLabel || !!specialItem) && (
                          <div
                            className={classNames("absolute -right-2 -top-2", {
                              "bg-[#b65389]": specialItem,
                              "bg-[#1e6dd5]": boostLabel,
                            })}
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
                          src={getWearableImage(item)}
                          alt={item}
                          className="max-h-10 max-w-10 w-auto h-auto object-contain shrink-0"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </OuterPanel>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        }
      />
    </>
  );
};

interface WardrobeItemDetailsProps {
  item: BumpkinItem;
  isEquipped: boolean;
}

const WardrobeItemDetails: React.FC<WardrobeItemDetailsProps> = ({
  item,
  isEquipped,
}) => {
  const { t } = useAppTranslation();

  const buffLabel = BUMPKIN_ITEM_BUFF_LABELS[item] ?? SPECIAL_ITEM_LABELS[item];

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col justify-center px-1 py-0">
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
          <div className="sm:mt-2">
            <SquareIcon icon={getWearableImage(item)} width={14} />
          </div>
          <span className="sm:text-center">{item}</span>
        </div>
        <div className="flex justify-center mb-2 mt-1">
          <Label type={isEquipped ? "success" : "default"}>
            {isEquipped ? t("wardrobe.equipped") : t("wardrobe.notEquipped")}
          </Label>
        </div>
        {buffLabel && (
          <div className="flex flex-wrap sm:flex-col gap-x-3 sm:gap-x-0 gap-y-1 mb-2 items-center">
            {buffLabel.map(
              (
                { labelType, boostTypeIcon, boostedItemIcon, shortDescription },
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
      </div>
      <span className="text-xxs italic text-center px-1 pb-1">
        {t("wardrobe.equipHint")}
      </span>
    </div>
  );
};
