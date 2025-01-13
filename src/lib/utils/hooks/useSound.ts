import { SOUNDS } from "assets/sound-effects/soundEffects";
import { Howl } from "howler";
import { useEffect } from "react";

const PITCH_VARIANCE = 0.1;

const HOWLERS = {
  open: new Howl({
    src: [SOUNDS.ui.hud],
    preload: false,
    volume: 0.1,
  }),
  tab: new Howl({
    src: [SOUNDS.ui.tab],
    preload: false,
    volume: 0.1,
  }),
  close: new Howl({
    src: [SOUNDS.ui.close],
    preload: false,
    volume: 0.1,
  }),
  travel: new Howl({
    src: [SOUNDS.ui.travel],
    preload: false,
    volume: 0.1,
  }),
  profile: new Howl({
    src: [SOUNDS.ui.profile],
    preload: false,
    volume: 0.1,
  }),
  inventory: new Howl({
    src: [SOUNDS.ui.inventory],
    preload: false,
    volume: 0.2,
  }),
  button: new Howl({
    src: [SOUNDS.ui.button],
    preload: false,
    volume: 0.1,
  }),
  copypaste: new Howl({
    src: [SOUNDS.ui.copypaste],
    preload: false,
    volume: 0.1,
  }),
  romy_rick: new Howl({
    src: [SOUNDS.songs.willow_tree],
    preload: false,
    volume: 0.06,
    loop: true,
    rate: 1,
  }),
  desert: new Howl({
    src: [SOUNDS.loops.desert],
    preload: false,
    volume: 0.02,
    loop: true,
    rate: 1,
  }),
  sfl: new Howl({
    src: [SOUNDS.ui.sfl],
    preload: false,
    volume: 0.05,
  }),
  chicken_1: new Howl({
    src: [SOUNDS.resources.chicken_1],
    preload: false,
    volume: 0.05,
  }),
  chicken_2: new Howl({
    src: [SOUNDS.resources.chicken_2],
    preload: false,
    volume: 0.05,
  }),
  chicken_collect_1: new Howl({
    src: [SOUNDS.resources.chicken_collect_1],
    preload: false,
    volume: 0.05,
  }),
  chicken_collect_2: new Howl({
    src: [SOUNDS.resources.chicken_collect_2],
    preload: false,
    volume: 0.05,
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
  no: new Howl({
    src: [SOUNDS.ui.no],
    preload: false,
    volume: 0.05,
  }),
  // Factions
  barlow: new Howl({
    src: SOUNDS.faction.barlow,
    preload: false,
    volume: 0.07,
  }),
  graxle: new Howl({
    src: SOUNDS.faction.graxle,
    preload: false,
    volume: 0.07,
  }),
  nyx: new Howl({
    src: SOUNDS.faction.nyx,
    preload: false,
    volume: 0.07,
  }),
  reginald: new Howl({
    src: SOUNDS.faction.reginald,
    preload: false,
    volume: 0.07,
  }),
  // animals
  chicken_collect: new Howl({
    src: SOUNDS.animals.chicken_collect,
    preload: false,
    volume: 0.05,
  }),
  cow_collect: new Howl({
    src: SOUNDS.animals.cow_collect,
    preload: false,
    volume: 0.05,
  }),
  sheep_collect: new Howl({
    src: SOUNDS.animals.sheep_collect,
    preload: false,
    volume: 0.05,
  }),
  produce_drop: new Howl({
    src: SOUNDS.animals.produce_drop,
    preload: false,
    volume: 0.1,
  }),
  feed_animal: new Howl({
    src: SOUNDS.animals.feed_animal,
    preload: false,
    volume: 0.05,
  }),
  level_up: new Howl({
    src: SOUNDS.notifications.level_up,
    preload: false,
    volume: 0.05,
  }),
  cure_animal: new Howl({
    src: SOUNDS.animals.cure_animal,
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
  mining_fall: new Howl({
    src: SOUNDS.resources.mining_fall,
    preload: false,
    volume: 0.1,
  }),
  mining: new Howl({
    src: SOUNDS.resources.mining,
    preload: false,
    volume: 0.1,
  }),
  shop: new Howl({
    src: [SOUNDS.buildings.shop],
    preload: false,
    volume: 0.05,
  }),
  fountain: new Howl({
    src: [SOUNDS.misc.fountain],
    preload: false,
    volume: 0.1,
  }),
  observatory: new Howl({
    src: [SOUNDS.misc.mom_observatory_animation_sounds],
    preload: false,
    volume: 0.15,
    loop: true,
  }),
  burning: new Howl({
    src: [SOUNDS.loops.fire],
    preload: false,
    volume: 0.25,
  }),
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
  bakery: new Howl({
    src: [SOUNDS.buildings.kitchen],
    preload: false,
    volume: 0.25,
  }),
  blacksmith: new Howl({
    src: [SOUNDS.buildings.blacksmith],
    preload: false,
    volume: 0.05,
  }),
  barn: new Howl({
    src: [SOUNDS.buildings.barn],
    preload: false,
    volume: 0.05,
  }),
  morning_rooster: new Howl({
    src: [SOUNDS.animals.morning_rooster],
    preload: false,
    volume: 0.05,
  }),
};

let lastSoundPlayedAt = 0;

export const useSound = (sound: keyof typeof HOWLERS, play = false) => {
  const howl = HOWLERS[sound];

  useEffect(() => {
    // Load once only
    if (howl.state() === "unloaded") howl.load();

    // Autoplay
    if (play) {
      howl.seek(Math.floor(howl.duration() * Math.random()));
      howl.play();
    }

    return () => {
      // Stop autoplay
      if (play) howl.stop();
    };
  }, [sound]);

  return {
    play: () => {
      // Debounce
      const now = Date.now();
      if (now - lastSoundPlayedAt < 15) return;

      lastSoundPlayedAt = now;
      // Randomize pitch for variety
      howl.rate(1 - PITCH_VARIANCE / 2 + Math.random() * PITCH_VARIANCE);
      howl.play();
    },
    isPlaying: () => howl.playing(),
    stop: () => howl.stop(),
  };
};
