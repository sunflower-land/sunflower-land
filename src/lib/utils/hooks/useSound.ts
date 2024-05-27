import { SOUNDS } from "assets/sound-effects/soundEffects";
import { Howl } from "howler";
import { useEffect } from "react";
import willow_tree from "assets/songs/willow_tree.mp3";

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
    src: [willow_tree],
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
      howl.play();
    },
  };
};
