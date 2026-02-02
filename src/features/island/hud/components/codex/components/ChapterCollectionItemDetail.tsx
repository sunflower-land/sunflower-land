import React, { useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "lib/utils/getImageURLS";
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

export type ChapterCollectionItemType = "collectible" | "wearable";

type Props = {
  itemName: InventoryItemName | BumpkinItem;
  type: ChapterCollectionItemType;
  chapter: ChapterName;
  state: GameState;
  onClose: () => void;
};

const SOURCE_I18N_KEY: Record<
  Exclude<ChapterItemSourceKey, "unknown">,
  TranslationKeys
> = {
  megastore: "season.codex.source.megastore",
  mutants: "season.codex.source.mutants",
  track: "season.codex.source.track",
  auctioneer: "season.codex.source.auctioneer",
  vipChest: "season.codex.source.vipChest",
  vipGift: "season.codex.source.vipGift",
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
  const displayWidth = type === "wearable" ? PIXEL_SCALE * 50 : imageWidth;

  const chapterEnded = hasChapterEnded(chapter, now);
  const { source, storeItem } = getChapterItemSource(chapter, itemName, type);

  const image =
    type === "wearable"
      ? getImageUrl(ITEM_IDS[itemName as BumpkinItem])
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

  const sourceLabel =
    source === "unknown"
      ? t("season.codex.source.unknown")
      : t(SOURCE_I18N_KEY[source] as TranslationKeys);

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

  return (
    <InnerPanel className="shadow">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center w-full">
          <div style={{ width: `${PIXEL_SCALE * 9}px` }} />
          <span className="flex-1 text-center">{itemName}</span>
          <img
            src={SUNNYSIDE.icons.close}
            className="cursor-pointer"
            onClick={onClose}
            style={{ width: `${PIXEL_SCALE * 9}px` }}
            alt="Close"
          />
        </div>
        <div className="w-full p-2 px-1">
          <div className="flex">
            <div
              className="w-[40%] relative min-w-[40%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
              style={
                type === "collectible"
                  ? {
                      backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
            >
              <img
                src={image}
                alt={String(itemName)}
                className="w-full"
                style={{ width: `${displayWidth}px` }}
              />
            </div>
            <div className="flex flex-col space-y-2">
              {!!buff && buff.length > 0 && (
                <div className="flex content-start flex-col sm:flex-row sm:flex-wrap gap-2">
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
                      >
                        {shortDescription}
                      </Label>
                    ),
                  )}
                </div>
              )}
              <span className="text-xs leading-none">{description}</span>

              {chapterEnded ? (
                <span className="text-xxs">
                  {t("season.codex.howToObtain.chapterEnded")}
                </span>
              ) : (
                <>
                  <Label type="default" className="text-xxs">
                    {t("season.codex.whereToObtain")}
                    {": "}
                    {sourceLabel}
                  </Label>

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

                  {source !== "megastore" &&
                    source !== "unknown" &&
                    howToObtainKey && (
                      <span className="text-xxs">
                        {t(howToObtainKey as TranslationKeys)}
                      </span>
                    )}

                  {source !== "megastore" && (
                    <Label type="default" className="text-xxs">
                      {t("season.megastore.crafting.limit.max", {
                        limit: ownedCount,
                        max: 1,
                      })}
                    </Label>
                  )}

                  {source === "unknown" && (
                    <span className="text-xxs">
                      {t("season.codex.howToObtain.unknown")}
                    </span>
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
