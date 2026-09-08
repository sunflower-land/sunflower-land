import React from "react";
import {
  getPetFetches,
  getPetLevel,
  getPetType,
  PET_RESOURCES,
  type Pet,
  type PetName,
  type PetNFT,
  type PetResourceName,
  isPetNFT,
} from "features/game/types/pets";
import { FetchButtonPanel } from "./FetchButtonPanel";
import type { GameState } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { getFetchYield } from "features/game/events/pets/fetchPet";
import { fetchSelectionKey } from "./PetCard";
import { PetCardShell } from "./PetCardShell";

interface Props {
  petData: Pet | PetNFT;
  petName: number | PetName;
  state: GameState;
  handleFetch: (petName: number | PetName, fetch: PetResourceName) => void;
  handleNeglectPet: (petName: number | PetName) => void;
  handlePetPet: (petName: number | PetName) => void;
  isBulkFetch?: boolean;
  selectedFetchKeys?: Set<string>;
  fetchPlanAmounts?: Map<string, number>;
  onToggleFetch?: (petName: number | PetName, fetch: PetResourceName) => void;
}

export const FetchPetCard: React.FC<Props> = ({
  petData,
  petName,
  state,
  handleFetch,
  handleNeglectPet,
  handlePetPet,
  isBulkFetch,
  selectedFetchKeys,
  fetchPlanAmounts,
  onToggleFetch,
}) => {
  const { t } = useAppTranslation();
  const { inventory } = state;

  return (
    <PetCardShell
      petData={petData}
      petName={petName}
      inventory={inventory}
      handleNeglectPet={handleNeglectPet}
      handlePetPet={handlePetPet}
    >
      <div className="flex flex-col gap-1 w-full">
        <Label type="default">{t("pets.fetchableResources")}</Label>
        <div className="grid grid-cols-3 gap-2 mt-2 w-full">
          {!getPetType(petData) ? (
            <p className="text-xs col-span-3 p-1">{t("pets.typeUnknown")}</p>
          ) : (
            [...getPetFetches(petData).fetches]
              .sort((a, b) => {
                const { level } = getPetLevel(petData.experience);
                const aUnlocked = level >= a.level;
                const bUnlocked = level >= b.level;

                if (aUnlocked !== bUnlocked) {
                  return aUnlocked ? -1 : 1;
                }

                if (aUnlocked && bUnlocked) {
                  const aEnergy = PET_RESOURCES[a.name].energy;
                  const bEnergy = PET_RESOURCES[b.name].energy;
                  if (aEnergy !== bEnergy) return aEnergy - bEnergy;
                  if (a.level !== b.level) return a.level - b.level;
                  return a.name.localeCompare(b.name);
                }

                if (a.level !== b.level) return a.level - b.level;
                return a.name.localeCompare(b.name);
              })
              .map((fetch) => {
                const { level } = getPetLevel(petData.experience);
                const hasRequiredLevel = level >= fetch.level;
                const energyRequired = PET_RESOURCES[fetch.name].energy;
                const hasEnoughEnergy = petData.energy >= energyRequired;
                const inventoryCount = inventory[fetch.name] ?? new Decimal(0);

                const { yieldAmount: fetchAmount } = getFetchYield({
                  petLevel: level,
                  fetchResource: fetch.name,
                  isPetNFT: isPetNFT(petData),
                  state,
                });

                const selectionKey = fetchSelectionKey(petName, fetch.name);
                const plannedAmount = fetchPlanAmounts?.get(selectionKey);
                const inPlan = plannedAmount !== undefined;
                const isSelected =
                  !!isBulkFetch &&
                  (selectedFetchKeys?.has(selectionKey) ?? false);

                // In bulk fetch mode only the planner's picks are
                // interactive (toggle on/off); everything else is inert.
                const isDisabled = isBulkFetch
                  ? !inPlan
                  : !hasRequiredLevel || !hasEnoughEnergy;

                return (
                  <FetchButtonPanel
                    key={fetch.name}
                    fetch={fetch.name}
                    inventoryCount={inventoryCount}
                    energyRequired={energyRequired}
                    disabled={isDisabled}
                    locked={!hasRequiredLevel}
                    selected={isSelected}
                    plannedAmount={isBulkFetch ? plannedAmount : undefined}
                    onClick={
                      isBulkFetch
                        ? () => onToggleFetch?.(petName, fetch.name)
                        : () => handleFetch(petName, fetch.name)
                    }
                    fetchAmount={fetchAmount}
                  />
                );
              })
          )}
        </div>
      </div>
    </PetCardShell>
  );
};
