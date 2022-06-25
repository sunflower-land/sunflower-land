import terrain1 from "assets/land/terrains/terrain_1.png";

export enum TerrainTypeEnum {
  terrain1 = "terrain1",
}

const images: Record<string, string> = {
  terrain1,
};

export function getTerrainImageByKey(key: string) {
  return images[key];
}
