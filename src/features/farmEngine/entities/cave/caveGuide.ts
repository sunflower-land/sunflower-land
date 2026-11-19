import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  acknowledgeCaveTutorial,
  getCaveTutorialSeen,
  getCaveTutorialStep,
  type CaveTutorialSeen,
  type CaveTutorialStep,
} from "features/cave/lib/onboarding";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { caveSlotsForTier } from "features/game/expansion/placeable/lib/caveLayout";
import type { GameState } from "features/game/types/game";
import type { CaveModal, GameBridge } from "../../bridge/GameBridge";
import { readyShake } from "../../core/juice";
import { nativeScale } from "../../core/pixelArt";

/**
 * What the Cave's renderers and its React panels both derive from the same
 * state [cave/Cave.tsx]: the tutorial step, whether Gloomwick's popup is due,
 * what the hand points at, and whether the player is out of digging tools.
 * Kept in one place so the scene and the overlay can never disagree.
 */

export type CaveGuide = {
  /** The tutorial step the Cave's state puts the player on. */
  step: CaveTutorialStep | undefined;
  /** The step once its popup was closed: bubble + hand follow it. */
  guiding: CaveTutorialStep | undefined;
  /** Gloomwick's popup for this step is still to be shown. */
  showPopup: boolean;
};

export const caveTutorialSeen = (bridge: GameBridge): CaveTutorialSeen =>
  bridge.caveUi.get().tutorialSeen ?? getCaveTutorialSeen();

/** [Cave.tsx tutorialStep / showTutorialPopup / guiding] */
export function readCaveGuide(
  game: GameState,
  now: number,
  seen: CaveTutorialSeen,
  modal: CaveModal,
): CaveGuide {
  const step = getCaveTutorialStep(game, now, seen);
  return {
    step,
    guiding: step && seen[step] ? step : undefined,
    showPopup: !!step && !seen[step] && !modal,
  };
}

/** [Cave.tsx acknowledgeTutorial] record it and tell both sides. */
export function acknowledgeCaveGuide(
  bridge: GameBridge,
  key: keyof CaveTutorialSeen,
) {
  acknowledgeCaveTutorial(key);
  bridge.caveUi.set({
    ...bridge.caveUi.get(),
    tutorialSeen: getCaveTutorialSeen(),
  });
}

export function openCaveModal(bridge: GameBridge, modal: CaveModal) {
  bridge.caveUi.set({ ...bridge.caveUi.get(), modal });
}

/**
 * [Cave.tsx outOfShovels / readyMachines] the slots whose batch is ready and
 * not dug out, and whether the player has neither digging tool for them.
 */
export function readCaveShovelNeed(game: GameState, now: number) {
  const cave = game.cave;
  const shovels = game.inventory["Sand Shovel"]?.toNumber() ?? 0;
  const drills = game.inventory["Sand Drill"]?.toNumber() ?? 0;
  // Match the tutorial: either digging tool lets the player continue.
  const outOfShovels = shovels < 1 && drills < 1;
  const readyMachines = cave
    ? caveSlotsForTier(cave.tier).filter((id) => {
        const batch = cave.machines[String(id)]?.batch;
        return batch && batch.readyAt <= now && !isCavePatchCleared(batch);
      })
    : [];
  return {
    shovels,
    drills,
    readyMachines,
    needsShovels: outOfShovels && readyMachines.length > 0,
  };
}

/** [CaveTutorial.tsx CaveTutorialHand] the hand is 18 source px wide. */
const HAND_WIDTH = 18;

export type CaveHand = { destroy(): void };

/**
 * [CaveTutorial.tsx CaveTutorialHand] the pulsing tutorial hand with its
 * top-left at (x, y) — same tween as the farm's other tutorial pointers.
 */
export function createCaveHand(
  scene: Phaser.Scene,
  options: { x: number; y: number; depth: number; animate: boolean },
): CaveHand | undefined {
  const texture = SUNNYSIDE.icons.click_icon;
  if (!scene.textures.exists(texture)) return undefined;
  const icon = scene.add
    .image(0, 0, texture)
    .setOrigin(0.5, 0.5)
    .setDepth(options.depth);
  nativeScale(icon);
  // Centred where the DOM's 18px-wide box is, so it pulses about its middle.
  const boxHeight = (HAND_WIDTH * icon.height) / icon.width;
  icon.setPosition(options.x + HAND_WIDTH / 2, options.y + boxHeight / 2);
  // [styles.css pulsate] 1 -> 1.1 -> 1 over a second.
  const tween = options.animate
    ? scene.tweens.add({
        targets: icon,
        scale: 1.1,
        duration: 500,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      })
    : undefined;
  return {
    destroy: () => {
      tween?.remove();
      icon.destroy();
    },
  };
}

/**
 * The "!" alert [SUNNYSIDE.icons.expression_alerted] 4 source px wide with
 * its top-left at (x, y), with the DOM's `.ready` shake when animations are
 * on [Cave.tsx].
 */
export function createCaveAlert(
  scene: Phaser.Scene,
  options: { x: number; y: number; depth: number; animate: boolean },
): Phaser.GameObjects.Image | undefined {
  const texture = SUNNYSIDE.icons.expression_alerted;
  if (!scene.textures.exists(texture)) return undefined;
  const alert = scene.add
    .image(options.x, options.y, texture)
    .setOrigin(0, 0)
    .setDepth(options.depth);
  alert.setScale(4 / alert.width);
  if (options.animate) readyShake(scene, alert);
  return alert;
}
