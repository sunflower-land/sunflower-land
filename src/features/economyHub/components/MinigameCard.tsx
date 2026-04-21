import React from "react";

import { ButtonPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MINIGAME_TOKEN_IMAGE_FALLBACK } from "features/minigame/lib/minigameTokenIcons";

type Props = {
  image?: string;
  name: string;
  description: string;
  activePlayers: number;
  trophies?: number;
  /** From economy config: number of balance items with `trophy: true`. */
  trophyGoal: number;
  onClick?: () => void;
};

/**
 * A single minigame in the Economy Hub, rendered as a vertical card:
 *   ┌──────────────────┐
 *   │    big image     │
 *   ├──────────────────┤
 *   │ title            │
 *   │ short description│
 *   │ players  progress│
 *   └──────────────────┘
 */
export const MinigameCard: React.FC<Props> = ({
  image,
  name,
  description,
  activePlayers,
  trophies = 0,
  trophyGoal,
  onClick,
}) => {
  const { t } = useAppTranslation();
  const showTrophies = trophyGoal > 0;
  const percentage = showTrophies
    ? Math.min(100, (trophies / trophyGoal) * 100)
    : 0;

  return (
    <ButtonPanel onClick={onClick} className="flex flex-col w-full">
      {/* Big image — fills the card width with a fixed aspect ratio. */}
      <div
        className="w-full flex items-center justify-center mb-2 rounded-sm"
        style={{
          aspectRatio: "2 / 1",
          background: "#b96f50",
        }}
      >
        <img
          src={image || MINIGAME_TOKEN_IMAGE_FALLBACK}
          alt=""
          className="object-contain"
          style={{
            maxHeight: "70%",
            maxWidth: "70%",
            imageRendering: "pixelated",
          }}
          onError={(e) => {
            e.currentTarget.src = MINIGAME_TOKEN_IMAGE_FALLBACK;
          }}
        />
      </div>

      {/* Title. */}
      <p className="text-sm mb-1">{name}</p>

      {/* Short description. */}
      <p className="text-xxs text-brown-700 mb-2 leading-tight">
        {description}
      </p>

      {/* Footer row: active players; trophy progress only when config defines trophies. */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-xxs">
          <img
            src={SUNNYSIDE.icons.player_small}
            alt=""
            className="object-contain"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              height: `${PIXEL_SCALE * 8}px`,
            }}
          />
          <span className="tabular-nums">
            {t("economyHub.activePlayersCount", { count: activePlayers })}
          </span>
        </div>

        {showTrophies && (
          <div className="flex items-center gap-1">
            <ResizableBar
              percentage={percentage}
              type="progress"
              outerDimensions={{ width: 25, height: 7 }}
            />
            <span className="text-xxs tabular-nums">
              {t("economyHub.trophiesCollected", {
                count: trophies,
                total: trophyGoal,
              })}
            </span>
          </div>
        )}
      </div>
    </ButtonPanel>
  );
};
