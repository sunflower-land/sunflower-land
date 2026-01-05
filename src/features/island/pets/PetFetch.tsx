import React, { useContext } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getPetFetches,
  getPetLevel,
  isPetNapping,
  isPetNeglected,
  isPetNFT,
  Pet,
  PET_RESOURCES,
  PetNFT,
  PetResourceName,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { getFetchYield } from "features/game/events/pets/fetchPet";
import { SmallBox } from "components/ui/SmallBox";
import { useNow } from "lib/utils/hooks/useNow";

type Props = {
  data: Pet | PetNFT;
  onShowRewards: () => void;
  onFetch: (fetch: PetResourceName) => void;
};

const _inventory = (state: MachineState) => state.context.state.inventory;
const _farmId = (state: MachineState) => state.context.farmId;
const _state = (state: MachineState) => state.context.state;

export const PetFetch: React.FC<Props> = ({ data, onShowRewards, onFetch }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const now = useNow();

  const inventory = useSelector(gameService, _inventory);
  const farmId = useSelector(gameService, _farmId);
  const state = useSelector(gameService, _state);

  const { level } = getPetLevel(data.experience);
  const fetches = [...getPetFetches(data).fetches].sort((a, b) => {
    const aUnlocked = level >= a.level;
    const bUnlocked = level >= b.level;

    // Unlocked fetches first
    if (aUnlocked !== bUnlocked) {
      return aUnlocked ? -1 : 1;
    }

    // Among unlocked fetches, sort by energy required
    if (aUnlocked && bUnlocked) {
      const aEnergy = PET_RESOURCES[a.name].energy;
      const bEnergy = PET_RESOURCES[b.name].energy;

      if (aEnergy !== bEnergy) {
        return aEnergy - bEnergy;
      }

      // Deterministic tie-breakers
      if (a.level !== b.level) {
        return a.level - b.level;
      }

      return a.name.localeCompare(b.name);
    }

    // Locked fetches at the back, sorted by required level
    if (a.level !== b.level) {
      return a.level - b.level;
    }

    return a.name.localeCompare(b.name);
  });
  const isNapping = isPetNapping(data, now);
  const neglected = isPetNeglected(data, now);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 justify-between flex-wrap">
        <Label type="default">{t("pets.fetchableResources")}</Label>
        <p
          className="underline ml-1 font-secondary text-xxs pb-1 -mt-1 mr-1 cursor-pointer hover:text-blue-500"
          onClick={onShowRewards}
        >
          {t("pets.fossilShellRewards")}
        </p>
      </div>
      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollable">
        {fetches.map(({ name: fetchResource, level: requiredLevel }) => {
          const hasRequiredLevel = level >= requiredLevel;
          const energyRequired = PET_RESOURCES[fetchResource].energy;
          const hasEnoughEnergy = data.energy >= energyRequired;
          const { yieldAmount: fetchYield } = getFetchYield({
            petLevel: level,
            fetchResource,
            isPetNFT: isPetNFT(data),
            farmId,
            counter: data.fetches?.[fetchResource] ?? 0,
            state,
          });

          const inventoryCount = inventory[fetchResource] ?? new Decimal(0);

          return (
            <div key={`fetch-${fetchResource}`} className="flex w-full gap-1">
              <InnerPanel className="flex gap-2 items-center w-full">
                <SmallBox
                  image={ITEM_DETAILS[fetchResource].image}
                  count={inventoryCount}
                />

                <div className="flex flex-col flex-1">
                  <div className="flex flex-col flex-1 justify-center -mt-0.5">
                    <p className="  text-xs mb-0.5">{`${fetchYield} x ${fetchResource}`}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between w-full pt-1">
                    <div className="flex flex-row gap-1 items-center">
                      <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                      <p
                        className={classNames(`text-xxs`, {
                          "text-red-600": !hasEnoughEnergy,
                        })}
                      >{`${data.energy}/${energyRequired} Energy`}</p>
                    </div>
                  </div>
                </div>
                {!hasRequiredLevel && (
                  <Popover key={fetchResource}>
                    <PopoverButton as="div" className="cursor-pointer">
                      <div className="flex flex-row gap-1 justify-center items-center mr-1">
                        <img src={SUNNYSIDE.icons.lock} className="w-5" />
                      </div>
                    </PopoverButton>
                    <PopoverPanel
                      anchor={{ to: "left end", offset: 2, gap: 5 }}
                      className="flex pointer-events-none"
                    >
                      <Label type="danger">
                        {t("pets.levelRequired", { level: requiredLevel })}
                      </Label>
                    </PopoverPanel>
                  </Popover>
                )}
              </InnerPanel>
              <Button
                className="flex-shrink-0 w-auto px-2 mr-0.5"
                disabled={
                  isNapping ||
                  neglected ||
                  !hasRequiredLevel ||
                  !hasEnoughEnergy
                }
                onClick={() => onFetch(fetchResource)}
              >
                {t("fetch")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
