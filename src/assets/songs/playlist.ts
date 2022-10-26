// Halloween
import haunted from "./haunted.mp3";
import blackOak from "./black_oak.mp3";
// Playlist hardcoded, but eventually it will be fetched from the server
const farming_songs = [
  // {
  //   artist: "Romy & Rick",
  //   name: "Harvesting",
  //   path: harvesting,
  // },
  // {
  //   artist: "Romy",
  //   name: "Willow Tree",
  //   path: willow_tree,
  // },

  {
    artist: "Romy & Rick",
    name: "Black Oak",
    path: blackOak,
  },
];

const goblin_songs = [
  // {
  //   artist: "Romy & Rick",
  //   name: "Mountain Escape",
  //   path: mountain_escape,
  // },
  {
    artist: "Jc Eii",
    name: "Haunted",
    path: haunted,
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
