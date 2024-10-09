import { ANIMALS, AnimalType } from "../types/animals";
import { BuildingName } from "../types/buildings";
import { Animal, AnimalBuildingKey } from "../types/game";

export const makeAnimalBuildingKey = (
  buildingName: Extract<BuildingName, "Hen House" | "Barn">,
): AnimalBuildingKey => {
  return buildingName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "") as AnimalBuildingKey;
};

export function makeAnimals(count: number, type: AnimalType) {
  const animal = ANIMALS[type];

  const positions = [
    { x: -animal.width, y: 0 },
    { x: 0, y: 0 },
    { x: animal.width, y: 0 },
  ];

  return new Array(count).fill(0).reduce(
    (animals, _, index) => {
      return {
        ...animals,
        [index]: {
          id: index.toString(),
          type,
          state: "idle",
          coordinates: positions[index],
        },
      };
    },
    {} as Record<string, Animal>,
  );
}
