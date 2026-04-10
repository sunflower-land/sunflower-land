import React from "react";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ButtonPanel } from "components/ui/Panel";
import flowerIcon from "assets/icons/flower_token.webp";
import type { MinigameFlowerPurchaseItemUi } from "../lib/minigameDashboardTypes";
import Decimal from "decimal.js-light";
import { canAttemptFlowerPurchase } from "../lib/minigameShopAvailability";

type Props = {
  items: MinigameFlowerPurchaseItemUi[];
  farmBalance: Decimal;
  highlightedId?: string | null;
  onItemClick: (item: MinigameFlowerPurchaseItemUi) => void;
  className?: string;
};

export const MinigameFlowerShopListBody: React.FC<Props> = ({
  items,
  farmBalance,
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
        const canAfford = canAttemptFlowerPurchase(item.flower, farmBalance);
        return (
          <ButtonPanel
            key={item.id}
            className="flex min-h-[3.5rem] flex-row items-center gap-2 py-1.5 text-left"
            selected={item.id === highlightedId}
            onClick={() => onItemClick(item)}
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
                  !canAfford && "font-medium",
                )}
              >
                <span className={classNames(!canAfford && "text-red-700")}>
                  {item.flower}
                </span>
                <img
                  src={flowerIcon}
                  alt=""
                  style={{
                    width: `${PIXEL_SCALE * 5}px`,
                    height: `${PIXEL_SCALE * 5}px`,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            </div>
          </ButtonPanel>
        );
      })}
    </div>
  );
};
