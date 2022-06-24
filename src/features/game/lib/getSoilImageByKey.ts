import soil1 from "assets/land/soils/soil_1.png";

export enum SoilTypeEnum {
  soil1 = "soil1",
}

const images: Record<string, string> = {
  soil1,
};

export function getSoilImageByKey(key: string) {
  return images[key];
}
