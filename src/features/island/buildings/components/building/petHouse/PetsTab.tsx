import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import {
  type Pet,
  type PetNFT,
  type PetName,
  type PetResourceName,
  isPetNapping,
  isPetNeglected,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useMemo, useState } from "react";
import { FetchPetCard } from "./FetchPetCard";
import { PetInfo } from "./PetInfo";
import { BulkFetchInputs } from "./BulkFetchInputs";
import { planBulkFetch, type BulkFetchPlan } from "./planBulkFetch";
import { fetchSelectionKey } from "./PetCard";
import { useNow } from "lib/utils/hooks/useNow";
import {
  sortActivePets,
  getPetSort,
  setPetSort,
  type PetSortOption,
} from "./sortActivePets";
import { PetSortToggle } from "./PetSortToggle";

const EMPTY_BULK_FETCH_PLAN: BulkFetchPlan = {
  fetches: [],
  fulfilled: {},
  shortfall: {},
  energyAfter: {},
};

// `now` here only drives nap (2h) and neglect (daily) state, so the panel clock
// ticks every 30s instead of every second — far fewer re-renders, no visible
// difference.
const PET_STATE_REFRESH_MS = 30_000;

type Props = {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
};

/**
 * The list of active pets and their Fetch (resource collection) controls.
 * Feeding lives in its own tab (see FeedTab.tsx) so this tab only shows what
 * relates to browsing pets and fetching resources.
 */
export const PetsTab: React.FC<Props> = ({ activePets }) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true, intervalMs: PET_STATE_REFRESH_MS });
  const { gameService } = useContext(Context);
  const [isBulkFetch, setIsBulkFetch] = useState(false);
  const [sort, setSortState] = useState<PetSortOption>(() => getPetSort());
  const setSort = (next: PetSortOption) => {
    setSortState(next);
    setPetSort(next);
  };
  // Quantities typed in bulk fetch mode, and the plan entries the player has
  // deselected on the pet cards.
  const [desiredFetch, setDesiredFetch] = useState<
    Partial<Record<PetResourceName, number>>
  >({});
  const [deselectedFetchKeys, setDeselectedFetchKeys] = useState<string[]>([]);

  const state = useSelector(gameService, (state) => state.context.state);

  // The planner turns the typed quantities into concrete per-pet fetches; the
  // pet cards then show those pre-selected, minus anything deselected. Only
  // computed in bulk fetch mode — otherwise it would re-run every `now` tick
  // for nothing.
  const fetchPlan = useMemo(
    () =>
      isBulkFetch
        ? planBulkFetch({ activePets, state, desired: desiredFetch, now })
        : EMPTY_BULK_FETCH_PLAN,
    [isBulkFetch, activePets, state, desiredFetch, now],
  );
  const fetchPlanAmounts = useMemo(() => {
    const amounts = new Map<string, number>();
    fetchPlan.fetches.forEach((entry) =>
      amounts.set(fetchSelectionKey(entry.petId, entry.fetch), entry.amount),
    );
    return amounts;
  }, [fetchPlan]);
  const deselectedFetch = useMemo(
    () => new Set(deselectedFetchKeys),
    [deselectedFetchKeys],
  );
  const selectedFetchEntries = fetchPlan.fetches.filter(
    (entry) =>
      !deselectedFetch.has(fetchSelectionKey(entry.petId, entry.fetch)),
  );
  const selectedFetchKeys = new Set(
    selectedFetchEntries.map((entry) =>
      fetchSelectionKey(entry.petId, entry.fetch),
    ),
  );
  const selectedFetchCount = selectedFetchEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  const handleDesiredFetchChange = (
    next: Partial<Record<PetResourceName, number>>,
  ) => {
    setDesiredFetch(next);
    // Changing quantities re-plans, so start from a fresh full selection.
    setDeselectedFetchKeys([]);
  };

  const handleToggleFetch = (
    petId: PetName | number,
    fetch: PetResourceName,
  ) => {
    const key = fetchSelectionKey(petId, fetch);
    setDeselectedFetchKeys((prev) =>
      prev.includes(key)
        ? prev.filter((value) => value !== key)
        : [...prev, key],
    );
  };

  const resetBulkFetch = () => {
    setDesiredFetch({});
    setDeselectedFetchKeys([]);
    setIsBulkFetch(false);
  };

  const handleConfirmFetch = () => {
    if (selectedFetchEntries.length === 0) return;
    gameService.send("pets.bulkFetch", { fetches: selectedFetchEntries });
    resetBulkFetch();
  };

  const handleBulkPet = () => {
    nappingPets.forEach(([petName, pet]) => {
      if (pet) {
        gameService.send("pet.pet", { petId: petName });
      }
    });
  };

  const handleBulkNeglect = () => {
    neglectedPets.forEach(([petName, pet]) => {
      if (pet) {
        gameService.send("pet.neglected", { petId: petName });
      }
    });
  };

  const activePetsSortedByType = sortActivePets(activePets, sort, now);

  const nappingPets = activePets.filter(([, pet]) => isPetNapping(pet, now));
  const neglectedPets = activePets.filter(([, pet]) =>
    isPetNeglected(pet, now),
  );

  const areSomePetsNapping = nappingPets.length > 0;
  const areSomePetsNeglected = neglectedPets.length > 0;

  const handleFetch = (petId: PetName | number, fetch: PetResourceName) => {
    gameService.send("pet.fetched", { petId, fetch });
  };

  const handleNeglectPet = (petId: PetName | number) => {
    gameService.send("pet.neglected", { petId });
  };

  const handlePetPet = (petId: PetName | number) => {
    gameService.send("pet.pet", { petId });
  };

  return (
    <>
      <InnerPanel className="flex flex-col justify-between mb-1 p-1 gap-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-1">
          <div className="flex flex-col sm:flex-row items-start gap-1">
            <Label type={isBulkFetch ? "vibrant" : "formula"}>
              {isBulkFetch
                ? t("pets.bulkFetchMode")
                : t("pets.yourPets", { count: activePets.length })}
            </Label>
            {isBulkFetch && (
              <Label type="warning">
                {t("pets.fetchSelected", { count: selectedFetchCount })}
              </Label>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-1 w-full">
          {areSomePetsNeglected && !isBulkFetch && (
            <Button className="flex-1 min-w-0" onClick={handleBulkNeglect}>
              {`Cheer All`}
            </Button>
          )}
          {areSomePetsNapping && !areSomePetsNeglected && !isBulkFetch && (
            <Button className="flex-1 min-w-0" onClick={handleBulkPet}>
              {`Pet All`}
            </Button>
          )}
          {!isBulkFetch && (
            <Button
              className="flex-1 min-w-0"
              disabled={activePets.length === 0}
              onClick={() => setIsBulkFetch(true)}
            >
              {t("pets.bulkFetch")}
            </Button>
          )}
          {isBulkFetch && (
            <>
              <Button
                className="flex-1 min-w-0"
                disabled={selectedFetchEntries.length === 0}
                onClick={handleConfirmFetch}
              >
                {t("pets.confirmFetch")}
              </Button>
              <Button className="flex-1 min-w-0" onClick={resetBulkFetch}>
                {t("cancel")}
              </Button>
            </>
          )}
        </div>
        {!isBulkFetch && <PetSortToggle sort={sort} onChange={setSort} />}
      </InnerPanel>
      {isBulkFetch && (
        <BulkFetchInputs
          activePets={activePets}
          desired={desiredFetch}
          onChange={handleDesiredFetchChange}
          plan={fetchPlan}
        />
      )}
      <div className="flex flex-col gap-1">
        {activePetsSortedByType.map(([petName, pet]) => {
          if (!pet) return null;
          return (
            <PetInfo key={petName} petData={pet} nftPets={state.pets?.nfts}>
              <FetchPetCard
                petData={pet}
                petName={petName}
                state={state}
                handleFetch={handleFetch}
                handleNeglectPet={handleNeglectPet}
                handlePetPet={handlePetPet}
                isBulkFetch={isBulkFetch}
                selectedFetchKeys={selectedFetchKeys}
                fetchPlanAmounts={fetchPlanAmounts}
                onToggleFetch={handleToggleFetch}
              />
            </PetInfo>
          );
        })}
      </div>
    </>
  );
};
