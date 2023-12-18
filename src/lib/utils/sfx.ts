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
  src: ["src/assets/sound-effects/harvest.mp3"],
  volume: 0.2,
  preload: false,
});

export const plantAudio = new Howl({
  src: ["src/assets/sound-effects/plant.mp3"],
  volume: 0.2,
  preload: false,
});

export const bakeryAudio = new Howl({
  src: ["src/assets/sound-effects/kitchen.mp3"],
  volume: 0.5,
  preload: false,
});

export const blacksmithAudio = new Howl({
  src: ["src/assets/sound-effects/blacksmith.mp3"],
  volume: 0.2,
  preload: false,
});

export const shopAudio = new Howl({
  src: ["src/assets/sound-effects/shop.mp3"],
  volume: 0.2,
  preload: false,
});

export const bankAudio = new Howl({
  src: ["src/assets/sound-effects/bank.mp3"],
  volume: 0.2,
  preload: false,
});

export const beggarAudio = new Howl({
  src: ["src/assets/sound-effects/beggar.mp3"],
  volume: 0.3,
  preload: false,
});

export const wishingWellAudio = new Howl({
  src: ["src/assets/sound-effects/wishing_well.mp3"],
  volume: 0.5,
  preload: false,
});

export const miningAudio = new Howl({
  src: ["src/assets/sound-effects/mining.mp3"],
  volume: 0.5,
  preload: false,
});

export const miningFallAudio = new Howl({
  src: ["src/assets/sound-effects/mining_fall.mp3"],
  volume: 0.5,
  preload: false,
});

export const chopAudio = new Howl({
  src: ["src/assets/sound-effects/chop.mp3"],
  volume: 0.3,
  preload: false,
});

export const treeFallAudio = new Howl({
  src: ["src/assets/sound-effects/tree_fall.mp3"],
  volume: 0.3,
  preload: false,
});

export const tailorAudio = new Howl({
  src: ["src/assets/sound-effects/tailor.mp3"],
  volume: 0.2,
  preload: false,
});

export const homeDoorAudio = new Howl({
  src: ["src/assets/sound-effects/home_door.mp3"],
  volume: 0.1,
  preload: false,
});

export const barnAudio = new Howl({
  src: ["src/assets/sound-effects/barn.mp3"],
  volume: 0.1,
  preload: false,
});

export const diaryAudio = new Howl({
  src: ["src/assets/sound-effects/diary.mp3"],
  volume: 0.2,
  preload: false,
});

export const battleAudio = new Howl({
  src: ["src/assets/sound-effects/battle.mp3"],
  volume: 0.2,
  preload: false,
});

export const fountainAudio = new Howl({
  src: ["src/assets/sound-effects/fountain.mp3"],
  volume: 0.2,
  preload: false,
});

export const observatoryAnimationAudio = new Howl({
  src: ["src./assets/sound-effects/mom_observatory_animation_sounds.mp3"],
  volume: 0.5,
  loop: true,
  preload: false,
});

export const merchantAudio = new Howl({
  src: ["src/assets/sound-effects/merchant.mp3"],
  volume: 0.2,
  preload: false,
});

export const burningSound = new Howl({
  src: ["src/assets/sound-effects/fire-crackling.mp3"],
  volume: 0.5,
  preload: false,
});

export const warChant = new Howl({
  src: ["src/assets/sound-effects/war_chant.mp3"],
  volume: 0.2,
  preload: false,
});

// Arcade - Greedy Goblin
export const greedyGoblinAudio = {
  greedyGoblinIntroAudio: new Howl({
    src: ["src/assets/community/arcade/greedy_goblin/audio/intro.mp3"],
    volume: 0.3,
    preload: false,
  }),
  greedyGoblinPlayingAudio: new Howl({
    src: ["src/assets/community/arcade/greedy_goblin/audio/playing.mp3"],
    volume: 0.2,
    loop: true,
    preload: false,
  }),
  greedyGoblinPickAudio: new Howl({
    src: ["src/assets/community/arcade/greedy_goblin/audio/pick.mp3"],
    volume: 0.2,
    preload: false,
  }),
  greedyGoblinGameOverAudio: new Howl({
    src: ["src/assets/community/arcade/audio/game_over.mp3"],
    volume: 0.2,
    preload: false,
  }),
};

// Arcade - Chicken Fight
export const chickenFightAudio = {
  chickenFightPlayingAudio: new Howl({
    src: ["src/assets/community/arcade/chicken_fight/audio/playing.mp3"],
    volume: 0.2,
    loop: true,
  }),
  chickenFightPunchAudio: new Howl({
    src: ["src/assets/community/arcade/chicken_fight/audio/punch.mp3"],
    volume: 0.3,
  }),
  chickenFightHitAudio: new Howl({
    src: ["src/assets/community/arcade/chicken_fight/audio/hit.mp3"],
    volume: 0.2,
  }),
  chickenFightGameOverAudio: new Howl({
    src: ["src/assets/community/arcade/audio/game_over.mp3"],
    volume: 0.2,
  }),
};
