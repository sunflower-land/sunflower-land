import type { MinigameType } from "../lib/minigames";
import { RaceScene } from "./RaceScene";
import { ChopScene } from "./ChopScene";
import { EggScene } from "./EggScene";

/**
 * Maps each playable game `type` to the Phaser scene that runs it. This is the
 * Phaser half of the game config — kept out of `lib/minigames.ts` so UI code can
 * import the metadata without dragging in Phaser scene classes.
 *
 * To add a game: add its entry to `GIVEAWAY_MINIGAMES` (with a `sceneId`), then
 * add its scene class here under the same `type`. Nothing else needs touching.
 */
export const GIVEAWAY_SCENES: Partial<
  Record<MinigameType, new () => Phaser.Scene>
> = {
  race: RaceScene,
  chop: ChopScene,
  eggs: EggScene,
};

/** Every registered scene class, for the Phaser `scene` list. */
export const GIVEAWAY_SCENE_LIST = Object.values(GIVEAWAY_SCENES);
