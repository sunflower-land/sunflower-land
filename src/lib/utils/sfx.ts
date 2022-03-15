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
  volume: 0.2,
});

export const blacksmithAudio = new Howl({
  src: [blacksmithMp3],
  volume: 0.2,
});

export const marketAudio = new Howl({
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

export const whishingWellAudio = new Howl({
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
