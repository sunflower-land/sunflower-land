import { Howl } from "howler";
import { SOUNDS } from "assets/sound-effects/soundEffects";

/**
 * World sound effects for the engine — the same Howl configs the DOM farm's
 * useSound hook builds, callable from Phaser code. Lazy-loaded on first play,
 * with the hook's small pitch variance so repeated actions don't sound
 * machine-gunned.
 */

const PITCH_VARIANCE = 0.1;

const HOWLS = {
  harvest: new Howl({
    src: [SOUNDS.resources.harvest],
    preload: false,
    volume: 0.05,
  }),
  plant: new Howl({
    src: [SOUNDS.resources.plant],
    preload: false,
    volume: 0.05,
  }),
  chop: new Howl({
    src: SOUNDS.resources.chop,
    preload: false,
    volume: 0.1,
  }),
  tree_fall: new Howl({
    src: [SOUNDS.resources.tree_fall],
    preload: false,
    volume: 0.1,
  }),
  mining: new Howl({
    src: SOUNDS.resources.mining,
    preload: false,
    volume: 0.1,
  }),
  mining_fall: new Howl({
    src: SOUNDS.resources.mining_fall,
    preload: false,
    volume: 0.1,
  }),
  mushroom_1: new Howl({
    src: [SOUNDS.resources.mushroom_1],
    preload: false,
    volume: 0.1,
  }),
  mushroom_2: new Howl({
    src: [SOUNDS.resources.mushroom_2],
    preload: false,
    volume: 0.1,
  }),
  mushroom_3: new Howl({
    src: [SOUNDS.resources.mushroom_3],
    preload: false,
    volume: 0.1,
  }),
};

/** The DOM mushroom pick: one of the three squeaks at random. */
export function playMushroomSound() {
  const pick = Math.floor(Math.random() * 3) + 1;
  playSound(`mushroom_${pick}` as keyof typeof HOWLS);
}

export function playSound(name: keyof typeof HOWLS) {
  const howl = HOWLS[name];
  if (howl.state() === "unloaded") howl.load();
  howl.rate(1 - PITCH_VARIANCE / 2 + Math.random() * PITCH_VARIANCE);
  howl.play();
}
