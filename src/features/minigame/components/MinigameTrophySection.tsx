import React, { useMemo } from "react";

import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { setImageWidth } from "lib/images";
import { deriveOwnedTrophyDisplays } from "../lib/minigameConfigHelpers";
import type { PlayerEconomyConfig } from "../lib/types";

/** Trophy art on the checkered backdrop only; `setImageWidth` scales natural pixels by `PIXEL_SCALE`. */
export const MinigameTrophySection: React.FC<{
  config: PlayerEconomyConfig;
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  onSelectTrophy?: (token: string) => void;
}> = ({ config, balances, tokenImages, onSelectTrophy }) => {
  const { t } = useAppTranslation();
  const trophies = useMemo(
    () => deriveOwnedTrophyDisplays(config, balances, tokenImages),
    [config, balances, tokenImages],
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-col items-center shrink-0 px-2 pt-1 pb-2 text-center">
        <Label type="warning" className="mx-auto">
          {t("minigame.dashboard.trophySection.title")}
        </Label>
        <p className="text-xxs mt-1 max-w-[min(100%,240px)] leading-snug text-white text-shadow">
          {t("minigame.dashboard.trophySection.subtitle")}
        </p>
      </div>
      <div
        className="flex min-h-0 flex-1 flex-wrap content-start items-end justify-center overflow-y-auto overflow-x-hidden p-2"
        role="list"
        style={{
          columnGap: `${PIXEL_SCALE * 2}px`,
          rowGap: `${PIXEL_SCALE * 2}px`,
        }}
      >
        {trophies.map((t) => (
          <button
            key={t.token}
            type="button"
            role="listitem"
            className="relative shrink-0 border-none bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80"
            onClick={() => onSelectTrophy?.(t.token)}
            aria-label={t.name}
          >
            <img
              src={t.imageUrl}
              alt=""
              onLoad={(e) => setImageWidth(e.currentTarget)}
              style={{
                opacity: 0,
                maxWidth: "none",
                display: "block",
                imageRendering: "pixelated",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
