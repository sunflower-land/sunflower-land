import terrain1 from "assets/land/terrains/terrain_1.png";
import terrain2 from "assets/land/terrains/terrain_2.png";
import terrain3 from "assets/land/terrains/terrain_3.png";
import terrain4 from "assets/land/terrains/terrain_4.png";
import terrain5 from "assets/land/terrains/terrain_5.png";
import terrain6 from "assets/land/terrains/terrain_6.png";
import terrain7 from "assets/land/terrains/terrain_7.png";
import terrain8 from "assets/land/terrains/terrain_8.png";
import terrain9 from "assets/land/terrains/terrain_9.png";
import terrain10 from "assets/land/terrains/terrain_10.png";
import terrain11 from "assets/land/terrains/terrain_11.png";
import terrain12 from "assets/land/terrains/terrain_12.png";
import terrain13 from "assets/land/terrains/terrain_13.png";
import terrain14 from "assets/land/terrains/terrain_14.png";

export enum TerrainTypeEnum {
  terrain1 = "terrain1",
  terrain2 = "terrain2",
  terrain3 = "terrain3",
  terrain4 = "terrain4",
  terrain5 = "terrain5",
  terrain6 = "terrain6",
  terrain7 = "terrain7",
  terrain8 = "terrain8",
  terrain9 = "terrain9",
  terrain10 = "terrain10",
  terrain11 = "terrain11",
  terrain12 = "terrain12",
  terrain13 = "terrain13",
  terrain14 = "terrain14",
}

const images: Record<string, string> = {
  terrain1,
  terrain2,
  terrain3,
  terrain4,
  terrain5,
  terrain6,
  terrain7,
  terrain8,
  terrain9,
  terrain10,
  terrain11,
  terrain12,
  terrain13,
  terrain14,
};

export function getTerrainImageByKey(key: string) {
  return images[key];
}
