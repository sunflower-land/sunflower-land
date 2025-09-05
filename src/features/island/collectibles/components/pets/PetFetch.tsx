import React, { useState } from "react";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Box } from "components/ui/Box";
import {
  getExperienceToNextLevel,
  getPetFetches,
  isPetNapping,
  isPetNeglected,
  PET_RESOURCES,
  Pet,
  PetName,
  PetResourceName,
} from "features/game/types/pets";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  petName: PetName;
  petData: Pet;
  handlePetFetch: (petName: PetName, fetch: PetResourceName) => void;
}

export const PetFetch: React.FC<Props> = ({
  petName,
  petData,
  handlePetFetch,
}) => {
  const { level } = getExperienceToNextLevel(petData.experience);
  const fetchConfig = getPetFetches(petName);
  const isNapping = isPetNapping(petData);
  const neglected = isPetNeglected(petData);

  const [selectedFetch, setSelectedFetch] = useState<PetResourceName>(
    fetchConfig.fetches[0]?.name,
  );

  const selectedFetchData = fetchConfig.fetches.find(
    (f) => f.name === selectedFetch,
  );

  const petImage = ITEM_DETAILS[petName].image;
  const energyRequired = PET_RESOURCES[selectedFetch].energy;
  const requiredLevel = selectedFetchData?.level ?? 0;
  const hasRequiredLevel = level >= requiredLevel;
  const hasEnoughEnergy = petData.energy >= energyRequired;

  return (
    <SplitScreenView
      panel={
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full">
            <div className="flex flex-col items-center gap-2">
              <img src={petImage} alt={petName} className="w-12 h-12" />
              <Label type="default" className="text-xs">
                {petName}
              </Label>
            </div>

            {selectedFetch && (
              <div className="flex flex-row gap-2 items-center w-full">
                <img
                  src={ITEM_DETAILS[selectedFetch].image}
                  alt={selectedFetch}
                  className="w-8"
                />
                <span className="text-xs">{`1 x ${selectedFetch}`}</span>
              </div>
            )}
          </div>

          <div className="flex flex-row sm:flex-col gap-2 justify-between w-full p-1">
            <div className="flex flex-row gap-2 items-center">
              <img src={SUNNYSIDE.icons.lightning} className="w-4" />
              <Label type={hasEnoughEnergy ? "default" : "danger"}>
                {`Energy: ${petData.energy}/${energyRequired}`}
              </Label>
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:items-center w-full">
            {!hasRequiredLevel && (
              <Label type="danger">{`Level ${requiredLevel} required`}</Label>
            )}
          </div>

          <div className="flex flex-row sm:flex-col gap-1 w-full">
            <Button
              disabled={
                !selectedFetch ||
                isNapping ||
                neglected ||
                !hasRequiredLevel ||
                !hasEnoughEnergy
              }
              onClick={() => handlePetFetch(petName, selectedFetch)}
            >
              {"Fetch"}
            </Button>
          </div>
        </div>
      }
      content={
        <div className="flex flex-col gap-2">
          <Label type="default">{"Fetchable resources"}</Label>
          <div className="flex flex-row gap-2">
            {fetchConfig.fetches.map(({ name, level: requiredLevel }) => {
              const canLevel = level >= requiredLevel;
              const isSelected = selectedFetch === name;
              return (
                <Box
                  key={name}
                  image={ITEM_DETAILS[name].image}
                  isSelected={isSelected}
                  onClick={() => setSelectedFetch(name)}
                  showOverlay={!canLevel}
                  secondaryImage={!canLevel ? SUNNYSIDE.icons.lock : undefined}
                />
              );
            })}
          </div>
        </div>
      }
    />
  );
};
