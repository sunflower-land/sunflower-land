import { Howl } from "howler";
import harvesting from "../../../assets/songs/harvesting.mp3";
import willowTree from "../../../assets/songs/willow_tree.mp3";
import mountainEscape from "../../../assets/songs/mountain_escape.mp3";
import cave from "../../../assets/songs/cave.mp3";

export interface Song {
  artist: string;
  name: string;
  audio: Howl;
}

export const FARMING_SONGS: Song[] = [
  {
    artist: "Romy & Rick",
    name: "Harvesting",
    audio: new Howl({
      src: [harvesting],
      volume: 0.1,
    }),
  },
  {
    artist: "Romy",
    name: "Willow Tree",
    audio: new Howl({
      src: [willowTree],
      volume: 0.1,
    }),
  },
];

export const GOBLIN_SONGS: Song[] = [
  {
    artist: "Romy & Rick",
    name: "Mountain Escape",
    audio: new Howl({
      src: [mountainEscape],
      volume: 0.1,
    }),
  },
];

export const CAVE_SONGS: Song[] = [
  {
    artist: "Romy",
    name: "Cave World",
    audio: new Howl({
      src: [cave],
      volume: 0.1,
      loop: true,
    }),
  },
];
