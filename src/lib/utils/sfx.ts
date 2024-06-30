import { SOUNDS } from "assets/sound-effects/soundEffects";
import { Howl } from "howler";

/**
 * All sounds should be lazy loaded to prevent unnecessary network requests on initial load. Please add the
 * path to the audio file directly into the instantiated Howl instance rather then importing into this file.
 * This is why we use the `loadAudio` function to load the sounds when needed.
 * This is also why we use the `preload: false` option on the Howl objects.
 * In the component that you wish you play the audio, you should import the sound and call `loadAudio` on it inside a useEffect.
 *
 * Example:
 *
 *   useEffect(() => {
 *     loadAudio([burningSound]);
 *   }, []);
 *
 */

/**
 * Lazy loader for audio sounds.
 * @param sounds Array of Howl objects with `preload: false`
 * @returns
 */
export const loadAudio = (sounds: Howl[]) => {
  for (const sound of sounds) {
    if (sound.state() === "loaded" || sound.state() === "loading") return;

    sound.load();
  }
};

export const harvestAudio = new Howl({
  src: [SOUNDS.resources.harvest],
  preload: false,
  volume: 0.05,
});

export const plantAudio = new Howl({
  src: [SOUNDS.resources.plant],
  preload: false,
  volume: 0.05,
});

export const bakeryAudio = new Howl({
  src: [SOUNDS.buildings.kitchen],
  preload: false,
  volume: 0.25,
});

export const blacksmithAudio = new Howl({
  src: [SOUNDS.buildings.blacksmith],
  preload: false,
  volume: 0.05,
});

export const shopAudio = new Howl({
  src: [SOUNDS.buildings.shop],
  preload: false,
  volume: 0.05,
});

export const bankAudio = new Howl({
  src: [SOUNDS.buildings.bank],
  preload: false,
  volume: 0.05,
});

export const beggarAudio = new Howl({
  src: [SOUNDS.misc.begger],
  preload: false,
  volume: 0.1,
});

export const wishingWellAudio = new Howl({
  src: [SOUNDS.buildings.wishing_well],
  preload: false,
  volume: 0.25,
});

export const miningAudio = new Howl({
  src: [SOUNDS.resources.mining],
  preload: false,
  volume: 0.1,
});

export const miningFallAudio = new Howl({
  src: [SOUNDS.resources.mining_fall],
  preload: false,
  volume: 0.1,
});

export const chopAudio = new Howl({
  src: [SOUNDS.resources.chop],
  preload: false,
  volume: 0.1,
});

export const treeFallAudio = new Howl({
  src: [SOUNDS.resources.tree_fall],
  preload: false,
  volume: 0.1,
});

export const tailorAudio = new Howl({
  src: [SOUNDS.buildings.tailor],
  preload: false,
  volume: 0.1,
});

export const barnAudio = new Howl({
  src: [SOUNDS.buildings.barn],
  preload: false,
  volume: 0.05,
});

export const diaryAudio = new Howl({
  src: [SOUNDS.misc.diary],
  preload: false,
  volume: 0.1,
});

export const battleAudio = new Howl({
  src: [SOUNDS.misc.battle],
  preload: false,
  volume: 0.1,
});

export const fountainAudio = new Howl({
  src: [SOUNDS.misc.fountain],
  preload: false,
  volume: 0.1,
});

export const observatoryAnimationAudio = new Howl({
  src: [SOUNDS.misc.mom_observatory_animation_sounds],
  preload: false,
  volume: 0.15,
  loop: true,
});

export const burningSound = new Howl({
  src: [SOUNDS.loops.fire],
  preload: false,
  volume: 0.25,
});

export const warChant = new Howl({
  src: [SOUNDS.misc.war_chant],
  preload: false,
  volume: 0.1,
});

// Arcade - Greedy Goblin
export const greedyGoblinAudio = {
  greedyGoblinIntroAudio: new Howl({
    src: [SOUNDS.greedy_goblin.intro],
    preload: false,
    volume: 0.15,
  }),
  greedyGoblinPlayingAudio: new Howl({
    src: [SOUNDS.greedy_goblin.playing],
    preload: false,
    volume: 0.1,
    loop: true,
  }),
  greedyGoblinPickAudio: new Howl({
    src: [SOUNDS.greedy_goblin.pick],
    preload: false,
    volume: 0.1,
  }),
  greedyGoblinGameOverAudio: new Howl({
    src: [SOUNDS.misc.game_over],
    preload: false,
    volume: 0.1,
  }),
};

// Arcade - Greedy Goblin
export const chickenFightAudio = {
  chickenFightPlayingAudio: new Howl({
    src: [SOUNDS.chicken_fight.playing],
    preload: false,
    volume: 0.1,
    loop: true,
  }),
  chickenFightPunchAudio: new Howl({
    src: [SOUNDS.chicken_fight.punch],
    preload: false,
    volume: 0.15,
  }),
  chickenFightHitAudio: new Howl({
    src: [SOUNDS.chicken_fight.hit],
    preload: false,
    volume: 0.1,
  }),
  chickenFightGameOverAudio: new Howl({
    src: [SOUNDS.misc.game_over],
    preload: false,
    volume: 0.1,
  }),
};

// Plaza
export const mazeOver = new Howl({
  src: [SOUNDS.notifications.maze_over],
  preload: false,
  volume: 0.1,
});
