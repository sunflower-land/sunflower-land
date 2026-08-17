import { SOUNDS } from "assets/sound-effects/soundEffects";

// Playlist hardcoded, but eventually it will be fetched from the server

export interface Song {
  id: string;
  artist: string;
  name: string;
  path: string;
}

// Generated tracks (see sound-generation/soundset.manifest.json) are
// served locally from public/audio; the "Remastered" ones are the classic
// tracks time-stretched to the tempo of the generated set and run back
// through the generator as init audio.
export const SONGS: Song[] = [
  {
    id: "willow_tree",
    artist: "Romy",
    name: "Willow Tree",
    path: SOUNDS.songs.willow_tree,
  },
  {
    id: "mountain_escape",
    artist: "Romy & Rick",
    name: "Mountain Escape",
    path: SOUNDS.songs.mountain_escape,
  },
  {
    id: "willow_tree_remastered",
    artist: "Romy × DJ Cluck Daddy",
    name: "Willow Tree (Remastered)",
    path: "/audio/willow_tree_remastered.m4a",
  },
  {
    id: "mountain_escape_remastered",
    artist: "Romy & Rick × DJ Cluck Daddy",
    name: "Mountain Escape (Remastered)",
    path: "/audio/mountain_escape_remastered.m4a",
  },
  {
    id: "sunny_meadows",
    artist: "DJ Cluck Daddy",
    name: "Sunny Meadows",
    path: "/audio/sunny_meadows.m4a",
  },
  {
    id: "island_hoedown",
    artist: "DJ Cluck Daddy",
    name: "Island Hoedown",
    path: "/audio/island_hoedown.m4a",
  },
  {
    id: "goblin_jamboree",
    artist: "DJ Cluck Daddy",
    name: "Goblin Jamboree",
    path: "/audio/goblin_jamboree.m4a",
  },
  {
    id: "moonlit_orchard",
    artist: "DJ Cluck Daddy",
    name: "Moonlit Orchard",
    path: "/audio/moonlit_orchard.m4a",
  },
  {
    id: "seaside_stroll",
    artist: "DJ Cluck Daddy",
    name: "Seaside Stroll",
    path: "/audio/seaside_stroll.m4a",
  },
];

const FARMING_ORDER: string[] = [
  "willow_tree",
  "sunny_meadows",
  "mountain_escape",
  "island_hoedown",
  "willow_tree_remastered",
  "moonlit_orchard",
  "mountain_escape_remastered",
  "seaside_stroll",
  "goblin_jamboree",
];

const GOBLIN_ORDER: string[] = [
  "goblin_jamboree",
  "mountain_escape",
  "island_hoedown",
  "mountain_escape_remastered",
  "willow_tree",
  "seaside_stroll",
  "willow_tree_remastered",
  "moonlit_orchard",
  "sunny_meadows",
];

const byId = (id: string) => SONGS.find((song) => song.id === id) as Song;

export const getSongs = (isFarming: boolean): Song[] =>
  (isFarming ? FARMING_ORDER : GOBLIN_ORDER).map(byId);
