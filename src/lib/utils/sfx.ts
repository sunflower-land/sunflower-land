import { Howl } from "howler";

import harvestMp3 from "assets/sound-effects/harvest.mp3";
import plantMp3 from "assets/sound-effects/plant.mp3";
import kitchenMp3 from "../../assets/sound-effects/kitchen.mp3";
import blacksmithMp3 from "../../assets/sound-effects/blacksmith.mp3";
import shopMp3 from "../../assets/sound-effects/shop.mp3";
import bankMp3 from "../../assets/sound-effects/bank.mp3";
import beggarMp3 from "../../assets/sound-effects/beggar.mp3";
import wishingWellMp3 from "../../assets/sound-effects/wishing_well.mp3";
import frogMp3 from "../../assets/sound-effects/frog.mp3";
import miningMp3 from "../../assets/sound-effects/mining.mp3";
import miningFallMp3 from "../../assets/sound-effects/mining_fall.mp3";
import chopMp3 from "../../assets/sound-effects/chop.mp3";
import treeFallMp3 from "../../assets/sound-effects/tree_fall.mp3";
import tailorMp3 from "../../assets/sound-effects/tailor.mp3";
import homeDoorMp3 from "../../assets/sound-effects/home_door.mp3";
import barnMp3 from "../../assets/sound-effects/barn.mp3";
import battleMp3 from "../../assets/sound-effects/battle.mp3";
import diaryMp3 from "../../assets/sound-effects/diary.mp3";
import fountainMp3 from "../../assets/sound-effects/fountain.mp3";
import observatoryAnimationMp3 from "../../assets/sound-effects/mom_observatory_animation_sounds.mp3";
import merchantMp3 from "../../assets/sound-effects/merchant.mp3";
import fireCracklingMp3 from "../../assets/sound-effects/fire-crackling.mp3";
import warChantMp3 from "../../assets/sound-effects/war_chant.mp3";

export const harvestAudio = new Howl({
  src: [harvestMp3],
  volume: 0.2,
});

export const plantAudio = new Howl({
  src: [plantMp3],
  volume: 0.2,
});

export const bakeryAudio = new Howl({
  src: [kitchenMp3],
  volume: 0.5,
});

export const blacksmithAudio = new Howl({
  src: [blacksmithMp3],
  volume: 0.2,
});

export const shopAudio = new Howl({
  src: [shopMp3],
  volume: 0.2,
});

export const bankAudio = new Howl({
  src: [bankMp3],
  volume: 0.2,
});

export const beggarAudio = new Howl({
  src: [beggarMp3],
  volume: 0.3,
});

export const wishingWellAudio = new Howl({
  src: [wishingWellMp3],
  volume: 0.5,
});

export const frogAudio = new Howl({
  src: [frogMp3],
  volume: 0.2,
});

export const miningAudio = new Howl({
  src: [miningMp3],
  volume: 0.5,
});

export const miningFallAudio = new Howl({
  src: [miningFallMp3],
  volume: 0.5,
});

export const chopAudio = new Howl({
  src: [chopMp3],
  volume: 0.3,
});

export const treeFallAudio = new Howl({
  src: [treeFallMp3],
  volume: 0.3,
});

export const tailorAudio = new Howl({
  src: [tailorMp3],
  volume: 0.2,
});

export const homeDoorAudio = new Howl({
  src: [homeDoorMp3],
  volume: 0.1,
});

export const barnAudio = new Howl({
  src: [barnMp3],
  volume: 0.1,
});

export const diaryAudio = new Howl({
  src: [diaryMp3],
  volume: 0.2,
});

export const battleAudio = new Howl({
  src: [battleMp3],
  volume: 0.2,
});

export const fountainAudio = new Howl({
  src: [fountainMp3],
  volume: 0.2,
});

export const observatoryAnimationAudio = new Howl({
  src: [observatoryAnimationMp3],
  volume: 0.5,
  loop: true,
});

export const merchantAudio = new Howl({
  src: [merchantMp3],
  volume: 0.2,
});

export const burningSound = new Howl({
  src: [fireCracklingMp3],
  volume: 0.5,
});

export const warChant = new Howl({
  src: [warChantMp3],
  volume: 0.2,
});
