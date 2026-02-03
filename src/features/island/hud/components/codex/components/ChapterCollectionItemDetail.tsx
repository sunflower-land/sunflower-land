import React, { useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import {
  ChapterItemSourceKey,
  getChapterItemSource,
} from "features/game/types/collections";
import { ChapterName, hasChapterEnded } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { NaturalImage, NaturalImageProps } from "components/ui/NaturalImage";
import { getWearableImage } from "features/game/lib/getWearableImage";

export type ChapterCollectionItemType = "collectible" | "wearable";

type Props = {
  itemName: InventoryItemName | BumpkinItem;
  type: ChapterCollectionItemType;
  chapter: ChapterName;
  state: GameState;
  onClose: () => void;
};

const HOW_TO_OBTAIN_I18N_KEY: Record<
  Exclude<ChapterItemSourceKey, "megastore" | "unknown">,
  TranslationKeys
> = {
  mutants: "season.codex.howToObtain.mutants",
  track: "season.codex.howToObtain.track",
  auctioneer: "season.codex.howToObtain.auctioneer",
  vipChest: "season.codex.howToObtain.vipChest",
  vipGift: "season.codex.howToObtain.vipGift",
};

export const ChapterCollectionItemDetail: React.FC<Props> = ({
  itemName,
  type,
  chapter,
  state,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const [imageWidth, setImageWidth] = useState<number>(0);
  const displayWidth = type === "wearable" ? 40 : imageWidth;

  const chapterEnded = hasChapterEnded(chapter, now);
  const { source, storeItem } = getChapterItemSource(chapter, itemName, type);

  const image =
    type === "wearable"
      ? getWearableImage(itemName as BumpkinItem)
      : (ITEM_DETAILS[itemName as InventoryItemName]?.image ?? "");

  const description =
    type === "wearable"
      ? (OPEN_SEA_WEARABLES[itemName as BumpkinItem]?.description ?? "")
      : (ITEM_DETAILS[itemName as InventoryItemName]?.description ?? "");

  const buff =
    type === "wearable"
      ? BUMPKIN_ITEM_BUFF_LABELS[itemName as BumpkinItem]
      : COLLECTIBLE_BUFF_LABELS[itemName as InventoryItemName]?.({
          skills: state.bumpkin.skills,
          collectibles: state.collectibles,
        });

  const ownedCount =
    type === "collectible"
      ? (state.inventory[itemName as InventoryItemName]?.toNumber() ?? 0)
      : (state.wardrobe[itemName as BumpkinItem] ?? 0);

  const howToObtainKey =
    source === "unknown"
      ? "season.codex.howToObtain.unknown"
      : source === "megastore"
        ? null
        : HOW_TO_OBTAIN_I18N_KEY[source];

  const itemReq = storeItem?.cost?.items;
  const sflCost = storeItem?.cost?.sfl ?? 0;

  useEffect(() => {
    if (type === "wearable") return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setImageWidth(img.width * PIXEL_SCALE);
    };
    img.src = image;
    return () => {
      cancelled = true;
    };
  }, [image, type]);

  const naturalImageProps: NaturalImageProps = {
    ...(type === "collectible"
      ? { maxWidth: displayWidth }
      : { maxHeight: displayWidth }),
    src: image,
    className: "pr-1 pb-1",
    alt: String(itemName),
  };

  return (
    <InnerPanel className="flex flex-col shadow h-full border-2 border-blue-500">
      <div className="flex items-center justify-between w-full pb-2 pl-2.5">
        <span className="flex-1">{itemName}</span>
        <img
          src={SUNNYSIDE.icons.close}
          className="cursor-pointer"
          onClick={onClose}
          style={{ width: `${PIXEL_SCALE * 9}px` }}
          alt="Close"
        />
      </div>
      <div className="flex min-h-[200px] items-stretch p-2 pt-1">
        {/* Image on left */}
        <div
          className="w-[60%] sm:w-1/2 relative rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center"
          style={
            type === "collectible"
              ? {
                  backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  backgroundImage: `url(${SUNNYSIDE.ui.brown_background_flipped})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
          }
        >
          <NaturalImage {...naturalImageProps} />
        </div>

        {/* Content on right */}
        <div className="w-full p-1 px-1 relative h-full">
          <div className="flex">
            <div className="flex flex-col space-y-2">
              {!!buff && buff.length > 0 && (
                <div className="flex content-start flex-col sm:flex-row sm:flex-wrap">
                  {buff.map(
                    ({
                      labelType,
                      boostTypeIcon,
                      boostedItemIcon,
                      shortDescription,
                    }) => (
                      <Label
                        key={shortDescription}
                        type={labelType}
                        icon={boostTypeIcon}
                        secondaryIcon={boostedItemIcon}
                        className="mr-1"
                      >
                        {shortDescription}
                      </Label>
                    ),
                  )}
                </div>
              )}
              {description && (
                <span className="text-xs leading-none">{description}</span>
              )}

              {chapterEnded ? (
                <span className="text-xxs pb-1">
                  {t("season.codex.howToObtain.chapterEnded")}
                </span>
              ) : (
                <>
                  {source !== "megastore" &&
                    source !== "unknown" &&
                    howToObtainKey && (
                      <p className="text-xs pb-1">{t(howToObtainKey)}</p>
                    )}
                  {source === "unknown" && (
                    <p className="text-xs pb-1">
                      {t("season.codex.howToObtain.unknown")}
                    </p>
                  )}

                  {source === "megastore" && storeItem?.cost && (
                    <>
                      <Label type="default" className="text-xxs">
                        {t("season.megastore.crafting.limit.max", {
                          limit: ownedCount,
                          max: 1,
                        })}
                      </Label>
                      {itemReq && (
                        <div className="flex flex-1 content-start flex-col flex-wrap gap-1">
                          {getKeys(itemReq).map((reqItemName) => (
                            <RequirementLabel
                              key={reqItemName}
                              type="item"
                              item={reqItemName}
                              showLabel
                              balance={
                                state.inventory[reqItemName] ?? new Decimal(0)
                              }
                              requirement={
                                new Decimal(itemReq[reqItemName] ?? 0)
                              }
                            />
                          ))}
                        </div>
                      )}
                      {sflCost !== 0 && (
                        <div className="flex flex-1 items-end">
                          <RequirementLabel
                            type="sfl"
                            balance={state.balance}
                            requirement={new Decimal(sflCost)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </InnerPanel>
  );
};
