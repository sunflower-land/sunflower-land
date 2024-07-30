import { SOUNDS } from "assets/sound-effects/soundEffects";
// Playlist hardcoded, but eventually it will be fetched from the server

export interface Song {
  artist: string;
  name: string;
  path: string;
}

const farming_songs: Song[] = [
  {
    artist: "Romy",
    name: "Willow Tree",
    path: SOUNDS.songs.willow_tree,
  },
  {
    artist: "Romy & Rick",
    name: "Mountain Escape",
    path: SOUNDS.songs.mountain_escape,
  },
  // {
  //   artist: "Romy & Rick",
  //   name: "Harvesting",
  //   path: harvesting,
  // },
];

const goblin_songs = [
  {
    artist: "Romy & Rick",
    name: "Mountain Escape",
    path: SOUNDS.songs.mountain_escape,
  },
];

export const getFarmingSong = (index: number) => {
  return farming_songs[index];
};

export const getFarmingSongCount = () => {
  return farming_songs.length;
};

export const getGoblinSong = (index: number) => {
  return goblin_songs[index];
};

export const getGoblinSongCount = () => {
  return goblin_songs.length;
};
