import { SOUNDS } from "assets/sound-effects/soundEffects";
import { Howl } from "howler";
import { useEffect, useMemo } from "react";
import {
  getVolumeSetting,
  VOLUME_CHANGED_EVENT,
  type VolumeChangedDetail,
  type VolumeChannel,
} from "lib/utils/hooks/useAudioVolume";

const PITCH_VARIANCE = 0.1;

// Locally generated cues (sound-generation/soundset.manifest.json),
// mastered m4as served from public/audio. These instrument interactions
// that previously had no sound - the classic CDN sound effects below
// are untouched.
const generated = (name: string) => `/audio/${name}.m4a`;

interface CueSpec {
  src: string;
  // Base volume at full slider - the authored mix level of the cue
  volume: number;
  // Volume slider that scales this cue (defaults to "sfx")
  channel?: VolumeChannel;
  loop?: boolean;
}

const SPECS = {
  open: { src: SOUNDS.ui.hud, volume: 0.1 },
  tab: { src: SOUNDS.ui.tab, volume: 0.1 },
  close: { src: SOUNDS.ui.close, volume: 0.1 },
  travel: { src: SOUNDS.ui.travel, volume: 0.1 },
  profile: { src: SOUNDS.ui.profile, volume: 0.1 },
  inventory: { src: SOUNDS.ui.inventory, volume: 0.2 },
  // Generated tactile pop - replaced the classic click Craig found flat
  button: { src: generated("ui_click"), volume: 0.1 },
  copypaste: { src: SOUNDS.ui.copypaste, volume: 0.1 },
  romy_rick: {
    src: SOUNDS.songs.willow_tree,
    volume: 0.06,
    channel: "music",
    loop: true,
  },
  // Sparse ambience: lone chirps scheduled from GameContent over real
  // silence - any looping generated bed carries a noise floor (Craig)
  bird_chirp_1: {
    src: generated("bird_chirp_1"),
    volume: 0.06,
    channel: "ambience",
  },
  bird_chirp_2: {
    src: generated("bird_chirp_2"),
    volume: 0.06,
    channel: "ambience",
  },
  bird_chirp_3: {
    src: generated("bird_chirp_3"),
    volume: 0.06,
    channel: "ambience",
  },
  sfl: { src: SOUNDS.ui.sfl, volume: 0.05 },
  chicken_1: { src: SOUNDS.resources.chicken_1, volume: 0.05 },
  chicken_2: { src: SOUNDS.resources.chicken_2, volume: 0.05 },
  chicken_collect_1: { src: SOUNDS.resources.chicken_collect_1, volume: 0.05 },
  chicken_collect_2: { src: SOUNDS.resources.chicken_collect_2, volume: 0.05 },
  mushroom_1: { src: SOUNDS.resources.mushroom_1, volume: 0.1 },
  mushroom_2: { src: SOUNDS.resources.mushroom_2, volume: 0.1 },
  mushroom_3: { src: SOUNDS.resources.mushroom_3, volume: 0.1 },
  no: { src: SOUNDS.ui.no, volume: 0.05 },
  // Factions
  barlow: { src: SOUNDS.faction.barlow, volume: 0.07 },
  graxle: { src: SOUNDS.faction.graxle, volume: 0.07 },
  nyx: { src: SOUNDS.faction.nyx, volume: 0.07 },
  reginald: { src: SOUNDS.faction.reginald, volume: 0.07 },
  // animals
  chicken_collect: { src: SOUNDS.animals.chicken_collect, volume: 0.05 },
  cow_collect: { src: SOUNDS.animals.cow_collect, volume: 0.05 },
  sheep_collect: { src: SOUNDS.animals.sheep_collect, volume: 0.05 },
  produce_drop: { src: SOUNDS.animals.produce_drop, volume: 0.1 },
  feed_animal: { src: SOUNDS.animals.feed_animal, volume: 0.05 },
  level_up: { src: SOUNDS.notifications.level_up, volume: 0.05 },
  cure_animal: { src: SOUNDS.animals.cure_animal, volume: 0.05 },
  // Classic CDN cue, re-mastered through the soundgen QC pass (public/audio)
  chop: { src: generated("chop"), volume: 0.1 },
  tree_fall: { src: SOUNDS.resources.tree_fall, volume: 0.1 },
  mining_fall: { src: SOUNDS.resources.mining_fall, volume: 0.1 },
  mining: { src: SOUNDS.resources.mining, volume: 0.1 },
  shop: { src: SOUNDS.buildings.shop, volume: 0.05 },
  fountain: { src: SOUNDS.misc.fountain, volume: 0.1, channel: "ambience" },
  observatory: {
    src: SOUNDS.misc.mom_observatory_animation_sounds,
    volume: 0.15,
    channel: "ambience",
    loop: true,
  },
  burning: { src: SOUNDS.loops.fire, volume: 0.25, channel: "ambience" },
  // Classic CDN cue, re-mastered through the soundgen QC pass (public/audio)
  harvest: { src: generated("harvest"), volume: 0.08 },
  plant: { src: SOUNDS.resources.plant, volume: 0.05 },
  bakery: { src: SOUNDS.buildings.kitchen, volume: 0.25 },
  blacksmith: { src: SOUNDS.buildings.blacksmith, volume: 0.05 },
  barn: { src: SOUNDS.buildings.barn, volume: 0.05 },
  morning_rooster: { src: SOUNDS.animals.morning_rooster, volume: 0.05 },
  // Generated cues for previously silent interactions
  expansion_reveal: { src: generated("expansion_reveal"), volume: 0.1 },
  flower_plant: { src: generated("flower_plant"), volume: 0.08 },
  flower_harvest: { src: generated("flower_harvest"), volume: 0.08 },
  honey_collect: { src: generated("honey_collect"), volume: 0.08 },
  fishing_cast: { src: generated("fishing_cast"), volume: 0.1 },
  fishing_bite: { src: generated("fishing_bite"), volume: 0.1 },
  fishing_catch: { src: generated("fishing_catch"), volume: 0.1 },
  compost_start: { src: generated("compost_start"), volume: 0.08 },
  compost_collect: { src: generated("compost_collect"), volume: 0.08 },
  chest_open: { src: generated("chest_open"), volume: 0.1 },
  daily_chest_epic: { src: generated("daily_chest_epic"), volume: 0.1 },
  // Confetti / reward-reveal fanfare (ClaimReward and other confetti pops)
  celebration: { src: generated("celebration"), volume: 0.1 },
  place_item: { src: generated("place_item"), volume: 0.08 },
  pet_pet: { src: generated("pet_pet"), volume: 0.08 },
  // Generic cue bank - reused across many call sites
  confirm_soft: { src: generated("confirm_soft"), volume: 0.08 },
  claim_reward: { src: generated("claim_reward"), volume: 0.09 },
  craft_item: { src: generated("craft_item"), volume: 0.09 },
  coins_spend: { src: generated("coins_spend"), volume: 0.1 },
  machine_whir: { src: generated("machine_whir"), volume: 0.08 },
  paper_open: { src: generated("paper_open"), volume: 0.08 },
  panel_slide: { src: generated("panel_slide"), volume: 0.08 },
  unlock_sparkle: { src: generated("unlock_sparkle"), volume: 0.09 },
  upgrade_build: { src: generated("upgrade_build"), volume: 0.09 },
} satisfies Record<string, CueSpec>;

export type SoundName = keyof typeof SPECS;

const cueChannel = (spec: CueSpec): VolumeChannel => spec.channel ?? "sfx";

const HOWLERS = Object.fromEntries(
  (Object.entries(SPECS) as [SoundName, CueSpec][]).map(([name, spec]) => [
    name,
    new Howl({
      src: [spec.src],
      preload: false,
      volume: spec.volume * getVolumeSetting(cueChannel(spec)),
      loop: spec.loop ?? false,
    }),
  ]),
) as Record<SoundName, Howl>;

// Rescale every cue on the changed channel when its volume slider moves
if (typeof window !== "undefined") {
  window.addEventListener(
    VOLUME_CHANGED_EVENT as any,
    (event: CustomEvent<VolumeChangedDetail>) => {
      const { channel, value } = event.detail;
      (Object.entries(SPECS) as [SoundName, CueSpec][]).forEach(
        ([name, spec]) => {
          if (cueChannel(spec) === channel) {
            HOWLERS[name].volume(spec.volume * value);
          }
        },
      );
    },
  );
}

export const useSound = (sound: SoundName, play = false) => {
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

  // Stable per howl so callers can safely list the handle in hook deps
  return useMemo(
    () => ({
      play: () => {
        // Randomize pitch for variety
        howl.rate(1 - PITCH_VARIANCE / 2 + Math.random() * PITCH_VARIANCE);
        howl.play();
      },
      isPlaying: () => howl.playing(),
      stop: () => howl.stop(),
    }),
    [howl],
  );
};
