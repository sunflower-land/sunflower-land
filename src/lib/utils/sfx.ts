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

// Arcade - Common - Game Over

// Arcade - Greedy Goblin

// Arcade - Chicken Fight

export const harvestAudio = new Howl({
  src: [SOUNDS.resources.harvest],
  volume: 0.2,
});

export const plantAudio = new Howl({
  src: [SOUNDS.resources.plant],
  volume: 0.2,
});

export const bakeryAudio = new Howl({
  src: [SOUNDS.buildings.kitchen],
  volume: 0.5,
});

export const blacksmithAudio = new Howl({
  src: [SOUNDS.buildings.blacksmith],
  volume: 0.2,
});

export const shopAudio = new Howl({
  src: [SOUNDS.buildings.shop],
  volume: 0.2,
});

export const bankAudio = new Howl({
  src: [SOUNDS.buildings.bank],
  volume: 0.2,
});

export const beggarAudio = new Howl({
  src: [SOUNDS.misc.begger],
  volume: 0.3,
});

export const wishingWellAudio = new Howl({
  src: [SOUNDS.buildings.wishing_well],
  volume: 0.5,
});

export const miningAudio = new Howl({
  src: [SOUNDS.resources.mining],
  volume: 0.5,
});

export const miningFallAudio = new Howl({
  src: [SOUNDS.resources.mining_fall],
  volume: 0.5,
});

export const chopAudio = new Howl({
  src: [SOUNDS.resources.chop],
  volume: 0.3,
});

export const treeFallAudio = new Howl({
  src: [SOUNDS.resources.tree_fall],
  volume: 0.3,
});

export const tailorAudio = new Howl({
  src: [SOUNDS.buildings.tailor],
  volume: 0.2,
});

export const barnAudio = new Howl({
  src: [SOUNDS.buildings.barn],
  volume: 0.1,
});

export const diaryAudio = new Howl({
  src: [SOUNDS.misc.diary],
  volume: 0.2,
});

export const battleAudio = new Howl({
  src: [SOUNDS.misc.battle],
  volume: 0.2,
});

export const fountainAudio = new Howl({
  src: [SOUNDS.misc.fountain],
  volume: 0.2,
});

export const observatoryAnimationAudio = new Howl({
  src: [SOUNDS.misc.mom_observatory_animation_sounds],
  volume: 0.5,
  loop: true,
});

export const burningSound = new Howl({
  src: [SOUNDS.loops.fire],
  volume: 0.5,
});

export const warChant = new Howl({
  src: [SOUNDS.misc.war_chant],
  volume: 0.2,
});

// Arcade - Greedy Goblin
export const greedyGoblinAudio = {
  greedyGoblinIntroAudio: new Howl({
    src: [SOUNDS.greedy_goblin.intro],
    volume: 0.3,
  }),
  greedyGoblinPlayingAudio: new Howl({
    src: [SOUNDS.greedy_goblin.playing],
    volume: 0.2,
    loop: true,
  }),
  greedyGoblinPickAudio: new Howl({
    src: [SOUNDS.greedy_goblin.pick],
    volume: 0.2,
  }),
  greedyGoblinGameOverAudio: new Howl({
    src: [SOUNDS.misc.game_over],
    volume: 0.2,
  }),
};

// Arcade - Greedy Goblin
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

// Plaza
export const mazeOver = new Howl({
  src: [SOUNDS.notifications.maze_over],
  volume: 0.2,
});
