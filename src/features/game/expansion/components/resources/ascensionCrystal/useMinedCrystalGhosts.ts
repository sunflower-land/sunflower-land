import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "features/game/GameProvider";
import type { GameState } from "features/game/types/game";

export type MinedCrystalGhost = { id: string; x: number; y: number };

/** How long the "+3 shards" feedback lingers where a crystal was mined. */
const GHOST_DURATION_MS = 3000;

/**
 * Mining deletes an Ascension Crystal from state, which unmounts its map
 * element on the same update — so, unlike every other rock, the node itself
 * can never show its own collect feedback. This hook watches the crystals map
 * from the layer that outlives the node (Land) and reports short-lived
 * "ghosts" (id + tile) for just-deleted placed crystals, so the caller can
 * render the yield float at the mined spot.
 *
 * The diff runs during render via React's "adjusting state when props change"
 * pattern (no setState inside an effect body). Records merely picked up by
 * landscaping keep their id with x/y unset, so they never ghost — only true
 * deletions (mining) do.
 */
export const useMinedCrystalGhosts = (
  crystals: GameState["ascensionCrystals"],
): MinedCrystalGhost[] => {
  const { showAnimations } = useContext(Context);

  const [ghosts, setGhosts] = useState<MinedCrystalGhost[]>([]);
  const [prevCrystals, setPrevCrystals] = useState(crystals);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  if (prevCrystals !== crystals) {
    setPrevCrystals(crystals);

    if (showAnimations) {
      const mined = Object.entries(prevCrystals).filter(
        ([id, crystal]) =>
          crystal.x !== undefined && crystal.y !== undefined && !crystals[id],
      );

      if (mined.length) {
        setGhosts((existing) => [
          ...existing,
          ...mined.map(([id, crystal]) => ({
            id,
            x: crystal.x!,
            y: crystal.y!,
          })),
        ]);
      }
    }
  }

  // Expire each ghost once its feedback has played out.
  useEffect(() => {
    ghosts.forEach(({ id }) => {
      if (timers.current[id]) return;

      timers.current[id] = setTimeout(() => {
        delete timers.current[id];
        setGhosts((existing) => existing.filter((ghost) => ghost.id !== id));
      }, GHOST_DURATION_MS);
    });
  }, [ghosts]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      Object.values(activeTimers).forEach(clearTimeout);
    };
  }, []);

  return ghosts;
};
