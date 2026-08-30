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
  // Animal houses [useSound.ts animal configs]
  feed_animal: new Howl({
    src: [SOUNDS.animals.feed_animal],
    preload: false,
    volume: 0.05,
  }),
  cow_collect: new Howl({
    src: [SOUNDS.animals.cow_collect],
    preload: false,
    volume: 0.05,
  }),
  sheep_collect: new Howl({
    src: [SOUNDS.animals.sheep_collect],
    preload: false,
    volume: 0.05,
  }),
  chicken_collect: new Howl({
    src: [SOUNDS.animals.chicken_collect],
    preload: false,
    volume: 0.05,
  }),
  produce_drop: new Howl({
    src: [SOUNDS.animals.produce_drop],
    preload: false,
    volume: 0.1,
  }),
  cure_animal: new Howl({
    src: [SOUNDS.animals.cure_animal],
    preload: false,
    volume: 0.05,
  }),
  level_up: new Howl({
    src: [SOUNDS.notifications.level_up],
    preload: false,
    volume: 0.05,
  }),
  // Building clicks [useSound.ts configs: shop/bakery/barn]
  shop: new Howl({
    src: [SOUNDS.buildings.shop],
    preload: false,
    volume: 0.05,
  }),
  bakery: new Howl({
    src: [SOUNDS.buildings.kitchen],
    preload: false,
    volume: 0.25,
  }),
  barn: new Howl({
    src: [SOUNDS.buildings.barn],
    preload: false,
    volume: 0.05,
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
