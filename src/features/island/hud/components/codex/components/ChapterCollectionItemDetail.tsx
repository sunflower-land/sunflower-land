import React from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
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
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { KNOWN_IDS } from "features/game/types";
import { getWearableImage } from "features/game/lib/getWearableImage";
import {
  WEARABLE_RELEASES,
  getInventoryReleases,
} from "features/game/types/withdrawables";

export type ChapterCollectionItemType = "collectible" | "wearable";

type ContentProps = {
  itemName: InventoryItemName | BumpkinItem;
  type: ChapterCollectionItemType;
  chapter: ChapterName;
  state: GameState;
  onClose: () => void;
};

const HOW_TO_OBTAIN_I18N_KEY: Record<
  Exclude<ChapterItemSourceKey, "unknown">,
  TranslationKeys
> = {
  megastore: "season.codex.howToObtain.megastore",
  mutants: "season.codex.howToObtain.mutants",
  track: "season.codex.howToObtain.track",
  auctioneer: "season.codex.howToObtain.auctioneer",
  vipChest: "season.codex.howToObtain.vipChest",
  vipGift: "season.codex.howToObtain.vipGift",
};

const ChapterCollectionItemDetailContent: React.FC<ContentProps> = ({
  itemName,
  type,
  chapter,
  state,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const chapterEnded = hasChapterEnded(chapter, now);
  const { source } = getChapterItemSource(chapter, itemName, type);

  const image =
    type === "wearable"
      ? getWearableImage(itemName as BumpkinItem)
      : (ITEM_DETAILS[itemName as InventoryItemName]?.image ?? "");

  const buff =
    type === "wearable"
      ? BUMPKIN_ITEM_BUFF_LABELS[itemName as BumpkinItem]
      : COLLECTIBLE_BUFF_LABELS[itemName as InventoryItemName]?.({
          skills: state.bumpkin.skills,
          collectibles: state.collectibles,
        });

  const howToObtainKey =
    source === "unknown" ? null : HOW_TO_OBTAIN_I18N_KEY[source];

  const inventoryReleases = getInventoryReleases(now);
  const isTradable =
    type === "wearable"
      ? !!WEARABLE_RELEASES[itemName as BumpkinItem]
      : !!inventoryReleases[itemName as InventoryItemName];

  const marketplaceId =
    type === "collectible"
      ? KNOWN_IDS[itemName as InventoryItemName]
      : ITEM_IDS[itemName as BumpkinItem];
  const collection = type === "collectible" ? "collectibles" : "wearables";
  const isWorldRoute = pathname.startsWith("/world");
  const marketplaceUrl =
    typeof marketplaceId === "number"
      ? `${isWorldRoute ? "/world" : ""}/marketplace/${collection}/${marketplaceId}`
      : null;

  return (
    <InnerPanel
      className="drop-shadow-lg cursor-pointer"
      style={{ maxWidth: "16rem" }}
    >
      <div className="flex flex-col space-y-2 p-1">
        {/* Header: icon + name */}
        <div className="flex items-center gap-1">
          <SquareIcon icon={image} width={9} />
          <Label type="transparent" className="ml-2">
            <span className="text-xs whitespace-nowrap">{itemName}</span>
          </Label>
        </div>

        {!!buff && buff.length > 0 && (
          <div className="flex flex-col gap-1">
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

        {chapterEnded ? (
          isTradable && marketplaceUrl ? (
            <span
              className="cursor-pointer underline text-xxs pb-1"
              onClick={() => {
                navigate(marketplaceUrl);
                onClose();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(marketplaceUrl);
                  onClose();
                }
              }}
              role="button"
              tabIndex={0}
            >
              {t("season.codex.buyOnMarketplace")}
            </span>
          ) : null
        ) : (
          <>
            {howToObtainKey && (
              <p className="text-xs pb-1">{t(howToObtainKey)}</p>
            )}
            {source === "unknown" && (
              <p className="text-xs pb-1">
                {t("season.codex.howToObtain.unknown")}
              </p>
            )}
          </>
        )}
      </div>
    </InnerPanel>
  );
};

type PopoverProps = ContentProps & {
  children: React.ReactNode;
};

export const ChapterCollectionItemPopover: React.FC<PopoverProps> = ({
  itemName,
  type,
  chapter,
  state,
  children,
  onClose,
}) => {
  return (
    <Popover>
      <PopoverButton as="div" className="cursor-pointer">
        {children}
      </PopoverButton>
      <PopoverPanel anchor={{ to: "right start" }} className="flex">
        <ChapterCollectionItemDetailContent
          itemName={itemName}
          type={type}
          chapter={chapter}
          state={state}
          onClose={onClose}
        />
      </PopoverPanel>
    </Popover>
  );
};
