import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { ChestRewardsList } from "components/ui/ChestRewardsList";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getPetFetches,
  getPetLevel,
  isPetNapping,
  isPetNeglected,
  Pet,
  PET_RESOURCES,
  PetNFT,
  PetName,
  PetResourceName,
} from "features/game/types/pets";
import React, { useState } from "react";
import { getPetImage } from "./lib/petShared";

interface Props {
  petId: PetName | number;
  petData: Pet | PetNFT;
  handlePetFetch: (petId: PetName | number, fetch: PetResourceName) => void;
}

export const PetFetch: React.FC<Props> = ({
  petId,
  petData,
  handlePetFetch,
}) => {
  const { level } = getPetLevel(petData.experience);
  const fetches = [...getPetFetches(petData).fetches].sort(
    (a, b) => a.level - b.level,
  );
  const isNapping = isPetNapping(petData);
  const neglected = isPetNeglected(petData);

  const [selectedFetch, setSelectedFetch] = useState<PetResourceName>("Acorn");
  const [showRewards, setShowRewards] = useState(false);

  const selectedFetchData = fetches.find((f) => f.name === selectedFetch);

  const petImage = getPetImage("happy", petData, petId);
  const energyRequired = PET_RESOURCES[selectedFetch].energy;
  const requiredLevel = selectedFetchData?.level ?? 0;
  const hasRequiredLevel = level >= requiredLevel;
  const hasEnoughEnergy = petData.energy >= energyRequired;
  const fetchYield = petData.fetches?.[selectedFetch] ?? 1;

  return (
    <>
      <SplitScreenView
        panel={
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full">
              <div className="flex flex-col items-center gap-2">
                <Label type="default" className="text-xs">
                  {petData.name}
                </Label>
                <img src={petImage} alt={petData.name} className="w-12 h-12" />
              </div>

              {selectedFetch && (
                <div className="flex flex-row gap-2 justify-center items-center w-full">
                  <img
                    src={ITEM_DETAILS[selectedFetch].image}
                    alt={selectedFetch}
                    className="w-5"
                  />
                  <span className="text-xs">{`${fetchYield} x ${selectedFetch}`}</span>
                </div>
              )}
            </div>

            <div className="flex flex-row sm:flex-col justify-between w-full pt-1">
              <div className="flex flex-row gap-2 justify-center items-center">
                <Label
                  icon={SUNNYSIDE.icons.lightning}
                  type={hasEnoughEnergy ? "default" : "danger"}
                >
                  {`Energy: ${petData.energy}/${energyRequired}`}
                </Label>
              </div>
            </div>

            <div className="flex flex-col gap-1 sm:items-center w-full">
              {!hasRequiredLevel && (
                <Label type="danger">{`Level ${requiredLevel} required`}</Label>
              )}
            </div>

            <div className="flex flex-col items-center w-full">
              <Button
                disabled={
                  !selectedFetch ||
                  isNapping ||
                  neglected ||
                  !hasRequiredLevel ||
                  !hasEnoughEnergy
                }
                onClick={() => handlePetFetch(petId, selectedFetch)}
              >
                {`Fetch ${fetchYield}`}
              </Button>
              {selectedFetch === "Fossil Shell" && (
                <p
                  className="underline font-secondary text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
                  onClick={() => setShowRewards(true)}
                >
                  {`Rewards List`}
                </p>
              )}
            </div>
          </div>
        }
        content={
          <div className="flex flex-col gap-1 pt-0.5">
            <Label type="default">{"Fetchable resources"}</Label>
            <div className="flex flex-row gap-1 flex-wrap">
              {fetches.map(({ name, level: requiredLevel }) => {
                const canLevel = level >= requiredLevel;
                const isSelected = selectedFetch === name;
                return (
                  <Box
                    key={name}
                    image={ITEM_DETAILS[name].image}
                    isSelected={isSelected}
                    onClick={() => setSelectedFetch(name)}
                    showOverlay={!canLevel}
                    secondaryImage={
                      !canLevel ? SUNNYSIDE.icons.lock : undefined
                    }
                  />
                );
              })}
            </div>
          </div>
        }
      />
      <Modal show={showRewards} onHide={() => setShowRewards(false)}>
        <Panel>
          <ChestRewardsList
            type="Fossil Shell"
            chestDescription={[
              {
                text: "The fossil shell will reward you with a random fetchable resource.",
                icon: ITEM_DETAILS["Fossil Shell"].image,
              },
              {
                text: "Spend 250 pet energy to fetch the fossil shell.",
                icon: SUNNYSIDE.icons.lightning,
              },
            ]}
          />
        </Panel>
      </Modal>
    </>
  );
};
