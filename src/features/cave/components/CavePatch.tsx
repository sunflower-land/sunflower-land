import React, { useContext, useMemo } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import type { CaveBatch } from "features/game/types/game";
import {
  caveTileKey,
  isCavePatchCleared,
} from "features/game/types/caveRecipes";
import {
  generateCavePatch,
  getCaveBeetleProgress,
  isCaveSeed,
  resolveCaveTile,
  type ResolvedCaveTile,
} from "features/game/types/cavePatch";
import { ITEM_DETAILS } from "features/game/types/images";
import { CAVE_PATCH_SIZE } from "features/game/expansion/placeable/lib/caveLayout";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getKeys } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  machineId: string;
  batch?: CaveBatch;
  now: number;
  hasShovel: boolean;
}

const DugTile: React.FC<{ tile: ResolvedCaveTile }> = ({ tile }) => {
  const item = getKeys(tile.items)[0];

  return (
    <div className="relative w-full h-full">
      <img
        src={SUNNYSIDE.soil.sand_dug}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
      {item && (
        <img
          src={ITEM_DETAILS[item].image}
          className="absolute inset-0 m-auto"
          style={{ width: `${PIXEL_SCALE * 9}px` }}
        />
      )}
      {tile.type === "Beetle" && (
        <img
          src={SUNNYSIDE.icons.confirm}
          className="absolute top-0 right-0"
          style={{ width: `${PIXEL_SCALE * 5}px` }}
        />
      )}
      {tile.clue !== undefined && (
        <span
          className="absolute bottom-0 right-0.5 text-xs text-white"
          style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000" }}
        >
          {tile.clue}
        </span>
      )}
    </div>
  );
};

/**
 * A Myco-Composter's 5x5 patch. Covered while growing; once ready each tile
 * can be dug with a Sand Shovel and shows what it held straight away.
 */
export const CavePatch: React.FC<Props> = ({
  machineId,
  batch,
  now,
  hasShovel,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const recipe = batch?.recipe;
  const seed = batch?.seed;
  const layout = useMemo(
    () =>
      recipe && isCaveSeed(seed)
        ? generateCavePatch({ recipe, seed })
        : undefined,
    [recipe, seed],
  );

  const growing = !!batch && batch.readyAt > now;
  const ready = !!batch && !growing;
  const cleared = !!batch && isCavePatchCleared(batch);
  const beetles = batch ? getCaveBeetleProgress(batch) : undefined;

  return (
    <>
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${CAVE_PATCH_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${CAVE_PATCH_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: CAVE_PATCH_SIZE * CAVE_PATCH_SIZE }).map(
          (_, i) => {
            const x = i % CAVE_PATCH_SIZE;
            const y = Math.floor(i / CAVE_PATCH_SIZE);
            const dug = batch?.dug?.[caveTileKey(x, y)];

            if (dug && layout) {
              return (
                <DugTile
                  key={`tile-${i}`}
                  tile={resolveCaveTile(layout, x, y, dug.dugAt)}
                />
              );
            }

            if (!ready) {
              return (
                <img
                  key={`tile-${i}`}
                  src={
                    batch ? SUNNYSIDE.soil.sand_hill : SUNNYSIDE.soil.sand_dug
                  }
                  className="w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                />
              );
            }

            return (
              <button
                key={`tile-${i}`}
                type="button"
                // The board arrives with the save that follows the batch start.
                disabled={!hasShovel || !layout}
                className="w-full h-full p-0 border-0 bg-transparent cursor-pointer hover:brightness-110 disabled:cursor-not-allowed"
                onClick={() =>
                  gameService.send({ type: "cave.dug", machineId, x, y })
                }
              >
                <img
                  src={SUNNYSIDE.soil.sand_hill}
                  className="w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>
            );
          },
        )}
      </div>

      {growing && batch && (
        <div className="absolute inset-0 bg-[#241521]/70 flex flex-col items-center justify-center">
          <img
            src={SUNNYSIDE.icons.stopwatch}
            style={{ width: `${PIXEL_SCALE * 8}px` }}
          />
          <span className="text-white text-xxs mt-0.5">
            {secondsToString(Math.max(0, (batch.readyAt - now) / 1000), {
              length: "short",
            })}
          </span>
        </div>
      )}

      {ready && beetles && (
        <div
          className="absolute left-0 right-0 flex flex-col items-center gap-0.5 pointer-events-none"
          style={{ top: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX + 4}px` }}
        >
          {cleared ? (
            <Label type="default">{t("cave.dig.cleared")}</Label>
          ) : (
            <Label type="success">{t("cave.batch.ready")}</Label>
          )}
          {beetles.found >= beetles.total ? (
            <Label type="success" icon={ITEM_DETAILS["Brown Beetle"].image}>
              {t("cave.dig.allBeetlesFound")}
            </Label>
          ) : (
            <Label type="default" icon={ITEM_DETAILS["Brown Beetle"].image}>
              {t("cave.dig.beetlesFound", beetles)}
            </Label>
          )}
        </div>
      )}
    </>
  );
};
