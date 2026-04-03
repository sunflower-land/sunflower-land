import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import Decimal from "decimal.js-light";
import {
  canAffordShopItem,
  canAffordShopPriceLine,
} from "../lib/canAffordShopItem";
import { isShopItemBoughtOrDisabled } from "../lib/minigameShopAvailability";

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
        const boughtOrCapped = isShopItemBoughtOrDisabled(item);
        const canAfford = canAffordShopItem(item, balances);
        return (
          <ButtonPanel
            key={item.id}
            className="flex min-h-[3.5rem] flex-row items-center gap-2 py-1.5 text-left"
            selected={item.id === highlightedId}
            disabled={boughtOrCapped}
            onClick={() => {
              if (boughtOrCapped) return;
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
                  "mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs leading-normal",
                  !boughtOrCapped && !canAfford && "font-medium",
                )}
              >
                {item.prices.map((line, idx) => {
                  const lineOk =
                    boughtOrCapped || canAffordShopPriceLine(balances, line);
                  return (
                    <React.Fragment key={`${item.id}-${line.token}-${idx}`}>
                      {idx > 0 ? (
                        <span className="text-[10px] opacity-60" aria-hidden>
                          {"+"}
                        </span>
                      ) : null}
                      <span
                        className={classNames(
                          !boughtOrCapped && !lineOk && "text-red-700",
                        )}
                      >
                        {new Decimal(line.amount).toString()}
                      </span>
                      <img
                        src={getMinigameTokenImage(line.token, tokenImages)}
                        alt=""
                        style={{
                          width: `${PIXEL_SCALE * 5}px`,
                          height: `${PIXEL_SCALE * 5}px`,
                          imageRendering: "pixelated",
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            {boughtOrCapped && (
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
