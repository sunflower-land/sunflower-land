import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import Decimal from "decimal.js-light";
import { canAffordShopItem } from "../lib/canAffordShopItem";

export function isShopItemOwned(
  item: MinigameShopItemUi,
  balances: Record<string, number>,
): boolean {
  const key = item.ownedBalanceToken;
  if (!key) return false;
  return (balances[key] ?? 0) >= 1;
}

type Props = {
  items: MinigameShopItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  highlightedId?: string | null;
  onItemClick: (item: MinigameShopItemUi) => void;
  className?: string;
};

/** Scrollable shop rows (used in sidebar panel and mobile modal). */
export const MinigameShopListBody: React.FC<Props> = ({
  items,
  balances,
  tokenImages,
  highlightedId,
  onItemClick,
  className,
}) => {
  return (
    <div
      className={
        className ??
        "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto md:max-h-none"
      }
    >
      {items.map((item) => {
        const owned = isShopItemOwned(item, balances);
        const canAfford = canAffordShopItem(item, balances);
        return (
          <ButtonPanel
            key={item.id}
            className="flex min-h-[3.5rem] flex-row items-center gap-2 py-1.5 text-left"
            selected={item.id === highlightedId}
            disabled={owned}
            onClick={() => {
              if (owned) return;
              onItemClick(item);
            }}
          >
            <div
              className="flex shrink-0 items-center justify-center self-center"
              style={{
                width: `${PIXEL_SCALE * 14}px`,
                maxHeight: `${PIXEL_SCALE * 22}px`,
              }}
            >
              <img
                src={item.listImage}
                alt=""
                className="max-h-full w-full object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="min-w-0 flex-1 self-center py-0.5">
              <div className="truncate text-sm leading-snug">{item.name}</div>
              <div
                className={classNames(
                  "mt-1 flex items-center gap-1 text-xs leading-normal",
                  !owned && !canAfford && "font-medium text-red-700",
                )}
              >
                <span>{new Decimal(item.price.amount).toString()}</span>
                <img
                  src={getMinigameTokenImage(item.price.token, tokenImages)}
                  alt=""
                  style={{
                    width: `${PIXEL_SCALE * 5}px`,
                    height: `${PIXEL_SCALE * 5}px`,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            </div>
            {owned && (
              <img
                src={SUNNYSIDE.icons.confirm}
                alt=""
                className="shrink-0 self-center"
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                  height: `${PIXEL_SCALE * 8}px`,
                  imageRendering: "pixelated",
                }}
              />
            )}
          </ButtonPanel>
        );
      })}
    </div>
  );
};
