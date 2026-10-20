import React, { useContext, useMemo, useState } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import type { CaveBatch } from "features/game/types/game";
import {
  caveTileKey,
  getCaveDrillSquare,
  isCavePatchCleared,
} from "features/game/types/caveRecipes";
import {
  generateCavePatch,
  getCaveBeetleProgress,
  getCavePatchComposition,
  getUndugCaveTiles,
  isCaveSeed,
  resolveCaveTile,
  type ResolvedCaveTile,
} from "features/game/types/cavePatch";
import { ITEM_DETAILS } from "features/game/types/images";
import { CAVE_PATCH_SIZE } from "features/game/expansion/placeable/lib/caveLayout";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ProgressBar } from "components/ui/ProgressBar";
import { getCaveBatchPercentage } from "features/cave/lib/caveBatchProgress";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CaveTutorialHand } from "./CaveTutorial";

interface Props {
  machineId: string;
  batch?: CaveBatch;
  now: number;
  hasShovel: boolean;
  hasDrill: boolean;
  /** The tile the Cave tutorial points at for the first dig. */
  tutorialTile?: { x: number; y: number };
}

// The same hover boxes the desert dig site uses: one tile for the shovel,
// 2x2 for the drill (served from public/world).
const SHOVEL_SELECT = "world/shovel_select_new.webp";
const DRILL_SELECT = "world/drill_select_new.webp";

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
 * A Myco Bin's 5x5 patch. Shaded with the batch's timer while growing; once
 * ready each tile
 * can be dug with a Sand Shovel, or a 2x2 square when the Sand Drill is the
 * selected item, and shows what it held straight away.
 */
export const CavePatch: React.FC<Props> = ({
  machineId,
  batch,
  now,
  hasShovel,
  hasDrill,
  tutorialTile,
}) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const { t } = useAppTranslation();
  // The tile under the pointer; the drill's square grows from it.
  const [hovered, setHovered] = useState<{ x: number; y: number }>();

  const recipe = batch?.recipe;
  const seed = batch?.seed;
  const skills = batch?.skills;
  const layout = useMemo(
    () =>
      recipe && isCaveSeed(seed)
        ? generateCavePatch({ recipe, seed, skills })
        : undefined,
    [recipe, seed, skills],
  );

  const growing = !!batch && batch.readyAt > now;
  const ready = !!batch && !growing;
  const cleared = !!batch && isCavePatchCleared(batch);
  const beetles = batch ? getCaveBeetleProgress(batch) : undefined;
  const mushroomsTotal = batch
    ? getCavePatchComposition(batch.recipe, batch.skills).Mushroom
    : 0;
  const mushroomsFound = batch
    ? mushroomsTotal - getUndugCaveTiles(batch).Mushroom
    : 0;

  const drilling = ready && selectedItem === "Sand Drill";
  // Where the hover box sits: the 2x2 square's top-left for the drill, the
  // tile itself for the shovel. Derived from the batch, not just the pointer:
  // once the hovered tile (or the whole drill square) is dug the box goes
  // away without waiting for the pointer to move.
  const isDug = (tile: { x: number; y: number }) =>
    !!batch?.dug?.[caveTileKey(tile.x, tile.y)];
  const hoverBox = (() => {
    if (!hovered) return undefined;
    if (drilling) {
      const square = getCaveDrillSquare(hovered.x, hovered.y);
      return square.every(isDug) ? undefined : { ...square[0], size: 2 };
    }
    return isDug(hovered) ? undefined : { ...hovered, size: 1 };
  })();

  // The room image already draws the bare sand of an empty patch.
  if (!batch) return null;

  if (growing) {
    return (
      <div className="absolute inset-0 pointer-events-none bg-white/20 rounded-md">
        {/* The plot-style timer and bar, centred on the patch. */}
        <div
          className="absolute"
          style={{
            left: `calc(50% - ${PIXEL_SCALE * 7.5}px)`,
            top: `calc(50% - ${PIXEL_SCALE * 3.5}px)`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <ProgressBar
            percentage={getCaveBatchPercentage(batch, now)}
            seconds={Math.max(0, (batch.readyAt - now) / 1000)}
            type="progress"
            formatLength="medium"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="absolute inset-0 grid"
        onPointerEnter={() => {
          // Digging needs a tool in hand: pick up the shovel unless a Cave
          // tool is already selected.
          if (
            ready &&
            selectedItem !== "Sand Shovel" &&
            selectedItem !== "Sand Drill"
          ) {
            shortcutItem("Sand Shovel");
          }
        }}
        onPointerLeave={() => setHovered(undefined)}
        style={{
          gridTemplateColumns: `repeat(${CAVE_PATCH_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${CAVE_PATCH_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: CAVE_PATCH_SIZE * CAVE_PATCH_SIZE }).map(
          (_, i) => {
            const x = i % CAVE_PATCH_SIZE;
            const y = Math.floor(i / CAVE_PATCH_SIZE);
            const key = caveTileKey(x, y);
            const dug = batch?.dug?.[key];
            const showHand =
              !dug && tutorialTile?.x === x && tutorialTile?.y === y;

            if (drilling) {
              const square = getCaveDrillSquare(x, y);
              const allDug = square.every(
                (tile) => !!batch?.dug?.[caveTileKey(tile.x, tile.y)],
              );

              return (
                <button
                  key={`tile-${i}`}
                  type="button"
                  disabled={!hasDrill || !layout || allDug}
                  className="relative w-full h-full p-0 border-0 bg-transparent cursor-pointer disabled:cursor-not-allowed"
                  onPointerEnter={() => setHovered({ x, y })}
                  onClick={() =>
                    gameService.send({
                      type: "cave.drilled",
                      machineId,
                      coords: square,
                    })
                  }
                >
                  {dug && layout ? (
                    <DugTile tile={resolveCaveTile(layout, x, y)} />
                  ) : (
                    <img
                      src={SUNNYSIDE.soil.sand_hill}
                      className="w-full h-full"
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                  {showHand && <CaveTutorialHand />}
                </button>
              );
            }

            if (dug && layout) {
              // A dug tile takes no tool, so the hover box must not sit on it.
              return (
                <div
                  key={`tile-${i}`}
                  className="w-full h-full"
                  onPointerEnter={() => setHovered(undefined)}
                >
                  <DugTile tile={resolveCaveTile(layout, x, y)} />
                </div>
              );
            }

            return (
              <button
                key={`tile-${i}`}
                type="button"
                // The board arrives with the save that follows the batch start.
                disabled={!hasShovel || !layout}
                className="relative w-full h-full p-0 border-0 bg-transparent cursor-pointer disabled:cursor-not-allowed"
                onPointerEnter={() => setHovered({ x, y })}
                onClick={() => {
                  // The tile becomes a DugTile under the pointer.
                  setHovered(undefined);
                  gameService.send({ type: "cave.dug", machineId, x, y });
                }}
              >
                <img
                  src={SUNNYSIDE.soil.sand_hill}
                  className="w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                />
                {showHand && <CaveTutorialHand />}
              </button>
            );
          },
        )}
      </div>

      {ready && !cleared && hoverBox && (
        <img
          src={hoverBox.size === 2 ? DRILL_SELECT : SHOVEL_SELECT}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${hoverBox.x * GRID_WIDTH_PX}px`,
            top: `${hoverBox.y * GRID_WIDTH_PX}px`,
            width: `${hoverBox.size * GRID_WIDTH_PX}px`,
            height: `${hoverBox.size * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        />
      )}

      {beetles && (
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
            <Label type="success" icon={ITEM_DETAILS["Green Beetle"].image}>
              {t("cave.dig.allBeetlesFound")}
            </Label>
          ) : (
            <Label type="default" icon={ITEM_DETAILS["Green Beetle"].image}>
              {t("cave.dig.beetlesFound", beetles)}
            </Label>
          )}
          {mushroomsFound < mushroomsTotal ? (
            <Label type="default" icon={ITEM_DETAILS["Wild Mushroom"].image}>
              {t("cave.dig.mushroomsFound", {
                found: mushroomsFound,
                total: mushroomsTotal,
              })}
            </Label>
          ) : (
            <Label type="success" icon={ITEM_DETAILS["Wild Mushroom"].image}>
              {t("cave.dig.allMushroomsFound")}
            </Label>
          )}
        </div>
      )}
    </>
  );
};
