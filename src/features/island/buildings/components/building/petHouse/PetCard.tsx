import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import {
  PetName,
  Pet,
  getExperienceToNextLevel,
  getPetRequestXP,
} from "features/game/types/pets";
import { CookableName } from "features/game/types/consumables";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSelector } from "@xstate/react";

interface Props {
  petName: PetName;
  pet: Pet;
}

export const PetCard: React.FC<Props> = ({ petName, pet }) => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );

  const handleFeedPet = (food: CookableName) => {
    gameService.send("pet.fed", {
      pet: petName,
      food,
    });
  };

  const level = getExperienceToNextLevel(pet.experience).level;

  const hasFoodInInventory = (foodName: CookableName) => {
    return inventory[foodName] && inventory[foodName].greaterThan(0);
  };

  const isFoodAlreadyFed = (pet: Pet, food: CookableName) => {
    const today = new Date().toISOString().split("T")[0];
    const lastFedDate = pet.requests.fedAt
      ? new Date(pet.requests.fedAt).toISOString().split("T")[0]
      : null;

    if (lastFedDate !== today) return false;

    return pet.requests.foodFed?.includes(food) || false;
  };

  const petImage = ITEM_DETAILS[petName].image;

  return (
    <OuterPanel className="p-3">
      <div className="flex items-center space-x-3">
        <img
          src={petImage}
          alt={petName}
          className="w-16 h-16 object-contain"
        />
        <div className="flex-1">
          <Label type={"default"}>{petName}</Label>
          <div className="text-xs text-gray-600">
            <div>{`Level: ${level}`}</div>
            <div>{`Experience: ${pet.experience}`}</div>
            <div>{`Energy: ${pet.energy}`}</div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Label className="mb-4 block" type={"info"}>
          {`Food Requests:`}
        </Label>
        <div className="flex space-x-2">
          {pet.requests.food.map((food) => {
            const foodImage = ITEM_DETAILS[food].image;
            const canFeed = hasFoodInInventory(food);
            const foodCount = inventory[food];
            const alreadyFed = isFoodAlreadyFed(pet, food);
            const isDisabled = !canFeed || alreadyFed;
            const foodXP = getPetRequestXP(food);

            return (
              <div key={food} className="flex flex-col items-center space-x-2">
                <div className="relative">
                  <Button
                    disabled={isDisabled}
                    onClick={() => handleFeedPet(food)}
                    className={`w-12 h-12 p-1`}
                  >
                    <img
                      src={foodImage}
                      alt={food}
                      className="w-full h-full object-contain"
                    />
                  </Button>
                  {alreadyFed && (
                    <img
                      src={SUNNYSIDE.icons.confirm}
                      className="absolute top-[-0.25rem] right-[-0.25rem] w-5 h-5"
                    />
                  )}
                  {foodCount && (
                    <Label
                      type="default"
                      className="absolute top-[-0.75rem] left-[-0.75rem]"
                    >
                      {foodCount.toString()}
                    </Label>
                  )}
                </div>
                <Label type="vibrant" icon={SUNNYSIDE.icons.lightning}>
                  {foodXP}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </OuterPanel>
  );
};
