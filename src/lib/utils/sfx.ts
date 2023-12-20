import { SOUNDS } from "assets/sound-effects/soundEffects";
import { Howl } from "howler";

/**
 * All sounds should be lazy loaded to prevent unnecessary network requests on initial load. Please add the
 * path to the audio file directly into the instantiated Howl instance rather then importing into this file.
 * This is why we use the `loadAudio` function to load the sounds when needed.
 * This is also why we use the `preload: false` option on the Howl objects.
 * In the component that you wish you play the audio, you should import the sound and call `loadAudio` on it inside a useEffect.
 *
 *
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
  volume: 0.2,
  preload: false,
});

export const plantAudio = new Howl({
  src: [SOUNDS.resources.plant],
  volume: 0.2,
  preload: false,
});

export const bakeryAudio = new Howl({
  src: [SOUNDS.buildings.kitchen],
  volume: 0.5,
  preload: false,
});

export const blacksmithAudio = new Howl({
  src: [SOUNDS.buildings.blacksmith],
  volume: 0.2,
  preload: false,
});

export const shopAudio = new Howl({
  src: [SOUNDS.buildings.shop],
  volume: 0.2,
  preload: false,
});

export const bankAudio = new Howl({
  src: [SOUNDS.buildings.bank],
  volume: 0.2,
  preload: false,
});

export const beggarAudio = new Howl({
  src: [SOUNDS.misc.begger],
  volume: 0.3,
  preload: false,
});

export const wishingWellAudio = new Howl({
  src: [SOUNDS.buildings.wishing_well],
  volume: 0.5,
  preload: false,
});

export const miningAudio = new Howl({
  src: [SOUNDS.resources.mining],
  volume: 0.5,
  preload: false,
});

export const miningFallAudio = new Howl({
  src: [SOUNDS.resources.mining_fall],
  volume: 0.5,
  preload: false,
});

export const chopAudio = new Howl({
  src: [SOUNDS.resources.chop],
  volume: 0.3,
  preload: false,
});

export const treeFallAudio = new Howl({
  src: [SOUNDS.resources.tree_fall],
  volume: 0.3,
  preload: false,
});

export const tailorAudio = new Howl({
  src: [SOUNDS.buildings.tailor],
  volume: 0.2,
  preload: false,
});

export const barnAudio = new Howl({
  src: [SOUNDS.buildings.barn],
  volume: 0.1,
  preload: false,
});

export const diaryAudio = new Howl({
  src: [SOUNDS.misc.diary],
  volume: 0.2,
  preload: false,
});

export const battleAudio = new Howl({
  src: [SOUNDS.misc.battle],
  volume: 0.2,
  preload: false,
});

export const fountainAudio = new Howl({
  src: [SOUNDS.misc.fountain],
  volume: 0.2,
  preload: false,
});

export const observatoryAnimationAudio = new Howl({
  src: [SOUNDS.misc.mom_observatory_animation_sounds],
  volume: 0.5,
  loop: true,
  preload: false,
});

export const burningSound = new Howl({
  src: [SOUNDS.loops.fire],
  volume: 0.5,
  preload: false,
});

export const warChant = new Howl({
  src: [SOUNDS.misc.war_chant],
  volume: 0.2,
  preload: false,
});

// Arcade - Greedy Goblin
export const greedyGoblinAudio = {
  greedyGoblinIntroAudio: new Howl({
    src: [SOUNDS.greedy_goblin.intro],
    volume: 0.3,
    preload: false,
  }),
  greedyGoblinPlayingAudio: new Howl({
    src: [SOUNDS.greedy_goblin.playing],
    volume: 0.2,
    loop: true,
    preload: false,
  }),
  greedyGoblinPickAudio: new Howl({
    src: [SOUNDS.greedy_goblin.pick],
    volume: 0.2,
    preload: false,
  }),
  greedyGoblinGameOverAudio: new Howl({
    src: [SOUNDS.misc.game_over],
    volume: 0.2,
    preload: false,
  }),
};

// Arcade - Chicken Fight
export const chickenFightAudio = {
  chickenFightPlayingAudio: new Howl({
    src: [SOUNDS.chicken_fight.playing],
    volume: 0.2,
    loop: true,
    preload: false,
  }),
  chickenFightPunchAudio: new Howl({
    src: [SOUNDS.chicken_fight.punch],
    volume: 0.3,
    preload: false,
  }),
  chickenFightHitAudio: new Howl({
    src: [SOUNDS.chicken_fight.hit],
    volume: 0.2,
    preload: false,
  }),
  chickenFightGameOverAudio: new Howl({
    src: [SOUNDS.misc.game_over],
    volume: 0.2,
    preload: false,
  }),
};
