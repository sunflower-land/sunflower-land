import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { ANIMALS, AnimalType } from "../../types/animals";
import { produce } from "immer";
import { makeAnimalBuildingKey } from "../../lib/animals";

export type CureAnimalAction = {
  type: "animal.cured";
  animal: AnimalType;
  id: string;
};

type CureOptions = {
  state: Readonly<GameState>;
  action: CureAnimalAction;
  createdAt: number;
};

export function cureAnimal({
  state,
  action,
  createdAt,
}: CureOptions): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];
    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];

    if (!animal) {
      throw new Error(
        `Animal ${action.id} not found in building ${buildingKey}`,
      );
    }

    if (animal.state !== "sick") {
      throw new Error("Animal is not sick");
    }

    const barnDelightCount = copy.inventory["Barn Delight"] ?? new Decimal(0);
    if (barnDelightCount.lt(1)) {
      throw new Error("No Barn Delight available to cure animal");
    }

    copy.inventory["Barn Delight"] = barnDelightCount.sub(1);
    animal.state = "idle";

    return copy;
  });
}
