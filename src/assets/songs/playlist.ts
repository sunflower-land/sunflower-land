import willow_tree from "./willow_tree.mp3";
// Playlist hardcoded, but eventually it will be fetched from the server
const song_list = [
  {
    artist: "Romy",
    name: "Willow Tree",
    path: willow_tree,
  },
];

export const getSong = (index: number) => {
  return song_list[index];
};

export const getSongCount = () => {
  return song_list.length;
};
