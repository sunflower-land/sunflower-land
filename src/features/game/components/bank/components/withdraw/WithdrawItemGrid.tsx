import React from "react";
import Decimal from "decimal.js-light";
import classNames from "classnames";

import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";
import type { WithdrawEntry } from "./types";

interface Props {
  entries: WithdrawEntry[];
  selected: Record<string, number>;
  focusedKey?: string;
  onPick: (entry: WithdrawEntry) => void;
}

/**
 * Direction C item grid: a named grid of boxes. The count badge shows the
 * selected quantity (green) when an item is in the cart, otherwise the
 * available-to-withdraw count. Locked items stay clickable so tapping them
 * opens the detail panel with the lock reason.
 */
export const WithdrawItemGrid: React.FC<Props> = ({
  entries,
  selected,
  focusedKey,
  onPick,
}) => {
  return (
    <div className="flex flex-wrap gap-y-1">
      {entries.map((entry) => {
        const selectedQty = selected[entry.key] ?? 0;
        const available = Math.max(entry.total - selectedQty, 0);
        const badgeCount = selectedQty > 0 ? selectedQty : available;

        return (
          <div
            key={entry.key}
            className="flex flex-col items-center cursor-pointer pt-1 w-16"
            onClick={() => onPick(entry)}
          >
            <Box
              image={entry.image}
              iconClassName={entry.iconClassName}
              hideCount={entry.unique}
              count={new Decimal(badgeCount)}
              countLabelType={selectedQty > 0 ? "success" : "default"}
              isSelected={selectedQty > 0 || focusedKey === entry.key}
              secondaryImage={entry.locked ? SUNNYSIDE.icons.lock : undefined}
              onClick={() => onPick(entry)}
            />
            <span
              className={classNames(
                "text-xxs text-center leading-tight h-6 overflow-hidden",
                { "opacity-60": entry.locked },
              )}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {entry.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
