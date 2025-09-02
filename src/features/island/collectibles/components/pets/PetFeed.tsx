import React, { memo, useState } from "react";
import { getPetRequestXP, Pet, PetName } from "features/game/types/pets";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { CookableName } from "features/game/types/consumables";
import { Label } from "components/ui/Label";
import { getExperienceToNextLevel } from "features/game/types/pets";
import { Button } from "components/ui/Button";
import { Inventory } from "features/game/types/game";
import levelUp from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import xpIcon from "assets/icons/xp.png";

interface Props {
  petName: PetName;
  petData: Pet;
  inventory: Inventory;
}

const PetFeedComponent: React.FC<
  Props & {
    handleFeed: (food: CookableName) => void;
  }
> = ({ petName, petData, handleFeed, inventory }) => {
  const [selectedFood, setSelectedFood] = useState<CookableName>(
    petData.requests.food[0],
  );
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <SplitScreenView
      panel={
        <PetFeedPanel
          petName={petName}
          petData={petData}
          selectedFood={selectedFood}
          handleFeed={handleFeed}
          inventory={inventory}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
        />
      }
      content={
        <PetFeedContent
          petName={petName}
          petData={petData}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          inventory={inventory}
          setShowConfirm={setShowConfirm}
        />
      }
    />
  );
};

const PetFeedPanel: React.FC<
  Props & {
    selectedFood: CookableName;
    handleFeed: (food: CookableName) => void;
    showConfirm: boolean;
    setShowConfirm: (showConfirm: boolean) => void;
  }
> = ({
  petName,
  petData,
  selectedFood,
  handleFeed,
  inventory,
  showConfirm,
  setShowConfirm,
}) => {
  const lastFedAt = petData.requests.fedAt;
  const foodFed = petData.requests.foodFed;

  const todayDate = new Date(Date.now()).toISOString().split("T")[0];
  const lastFedAtDate = new Date(lastFedAt ?? 0).toISOString().split("T")[0];
  const isToday = lastFedAtDate === todayDate;
  const isDisabled =
    (isToday && foodFed?.includes(selectedFood)) ||
    !inventory[selectedFood] ||
    inventory[selectedFood].lessThan(1);

  const { level, currentProgress, experienceBetweenLevels } =
    getExperienceToNextLevel(petData.experience);

  const foodXp = getPetRequestXP(selectedFood);
  const experienceAfterFeed = petData.experience + foodXp;
  const {
    level: levelAfterFeed,
    currentProgress: currentProgressAfterFeed,
    experienceBetweenLevels: experienceBetweenLevelsAfterFeed,
  } = getExperienceToNextLevel(experienceAfterFeed);

  const levelChange = isDisabled ? 0 : levelAfterFeed - level;
  const experienceChange = isDisabled
    ? 0
    : experienceAfterFeed - petData.experience;
  const beforeEnergy = petData.energy;
  const afterEnergy = petData.energy + foodXp;
  const energyChange = isDisabled ? 0 : afterEnergy - beforeEnergy;

  const petImage = ITEM_DETAILS[petName].image;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Pet Image and Name */}
      <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <img
            src={petImage}
            alt={petName}
            className="w-12 h-12 object-contain"
          />
          <Label type="default" className="text-xs">
            {petName}
          </Label>
        </div>

        <div className="flex flex-row gap-2 items-center w-full">
          <img
            src={ITEM_DETAILS[selectedFood].image}
            alt={selectedFood}
            className="w-8"
          />
          <span className="text-xs">{selectedFood}</span>
        </div>
      </div>

      {showConfirm ? (
        <div className="flex flex-col gap-2 w-full">
          <Label type="default">{`Changes`}</Label>
          <div className="flex flex-row sm:flex-col gap-2 w-full justify-between">
            <InnerPanel className="flex flex-col gap-2 w-[40%] sm:w-full">
              <div className="flex flex-row items-center gap-2">
                <img src={levelUp} className="w-3" />
                <span className="text-xs font-medium">{`Level: ${level}`}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img src={xpIcon} className="w-4" />
                <div className="flex flex-row md:items-center gap-1 text-xs">
                  <span>
                    {`${currentProgress} / ${experienceBetweenLevels}`}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                <span className="text-xs font-medium">{`${beforeEnergy}`}</span>
              </div>
            </InnerPanel>
            <div className="w-[20%] sm:w-full flex justify-center items-center">
              <img
                src={SUNNYSIDE.icons.arrow_right}
                alt="Arrow Right"
                className="w-4 block md:hidden"
              />
              <img
                src={SUNNYSIDE.icons.arrow_down}
                alt="Arrow Down"
                className="w-4 hidden md:block"
              />
            </div>
            <InnerPanel className="flex flex-col gap-2 w-[40%] sm:w-full">
              <div className="flex flex-row items-center gap-2">
                <img src={levelUp} className="w-3" />
                <span className="text-xs font-medium">{`Level: ${levelAfterFeed} ${levelChange > 0 ? `(+${levelChange})` : ""}`}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img src={xpIcon} className="w-4" />
                <div className="flex flex-row md:items-center gap-1 text-xs">
                  <span>
                    {`${currentProgressAfterFeed} / ${experienceBetweenLevelsAfterFeed} ${experienceChange > 0 ? `(+${experienceChange})` : ""}`}
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                <span className="text-xs font-medium">{`${afterEnergy} ${energyChange > 0 ? `(+${energyChange})` : ""}`}</span>
              </div>
            </InnerPanel>
          </div>
        </div>
      ) : (
        <div className="flex flex-row md:flex-col gap-2 justify-between w-full p-1">
          <div className="flex flex-row gap-2 items-center">
            <img src={xpIcon} className="w-4" />
            <span className="text-xs">{`+${foodXp} XP`}</span>
          </div>
          <div className="flex flex-row gap-2">
            <img src={SUNNYSIDE.icons.lightning} className="w-3" />
            <span className="text-xs">{`+${foodXp} Energy`}</span>
          </div>
        </div>
      )}

      {/* Labels for today's feed and insufficient food */}
      {isToday && foodFed?.includes(selectedFood) ? (
        <div className="flex w-full items-start">
          <Label type="danger" className="text-xs">
            {`Food Fed Today`}
          </Label>
        </div>
      ) : !inventory[selectedFood] || inventory[selectedFood].lessThan(1) ? (
        <div className="flex w-full items-start">
          <Label type="danger" className="text-xs">
            {`Insufficient Food`}
          </Label>
        </div>
      ) : null}
      <div className="flex flex-row sm:flex-col gap-1 w-full">
        <Button
          disabled={isDisabled}
          onClick={() => {
            setShowConfirm(!showConfirm);
            if (showConfirm) handleFeed(selectedFood);
          }}
        >
          {showConfirm ? `Confirm` : `Feed ${petName}`}
        </Button>
        {showConfirm && (
          <Button onClick={() => setShowConfirm(false)}>{`Cancel`}</Button>
        )}
      </div>
    </div>
  );
};

const PetFeedContent: React.FC<
  Props & {
    selectedFood: CookableName;
    setSelectedFood: (selectedFood: CookableName) => void;
    setShowConfirm: (showConfirm: boolean) => void;
  }
> = ({
  petName,
  petData,
  selectedFood,
  setSelectedFood,
  inventory,
  setShowConfirm,
}) => (
  <div className="flex flex-col gap-2">
    <Label type="default">{`${petName}'s Requests Today`}</Label>
    <div className="flex flex-row gap-2">
      {petData.requests.food.map((food) => (
        <Box
          key={food}
          image={ITEM_DETAILS[food].image}
          isSelected={selectedFood === food}
          onClick={() => {
            setSelectedFood(food);
            setShowConfirm(false);
          }}
          count={inventory[food]}
        />
      ))}
    </div>
  </div>
);

export const PetFeed = memo(PetFeedComponent);
