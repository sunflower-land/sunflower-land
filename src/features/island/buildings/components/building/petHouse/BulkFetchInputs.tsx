import React, { useContext, useMemo } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { NumberInput } from "components/ui/NumberInput";
import { SmallBox } from "components/ui/SmallBox";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  getPetFetches,
  getPetLevel,
  getPetType,
  isPetNapping,
  isPetNeglected,
  PET_RESOURCES,
  type Pet,
  type PetNFT,
  type PetName,
  type PetResourceName,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getKeys } from "lib/object";
import { formatFetchYield } from "features/game/lib/formatFetchYield";
import type { BulkFetchPlan } from "./planBulkFetch";

type Props = {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
  desired: Partial<Record<PetResourceName, number>>;
  onChange: (next: Partial<Record<PetResourceName, number>>) => void;
  plan: BulkFetchPlan;
};

const _inventory = (state: MachineState) => state.context.state.inventory;

export const BulkFetchInputs: React.FC<Props> = ({
  activePets,
  desired,
  onChange,
  plan,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const now = useNow({ live: true });
  const inventory = useSelector(gameService, _inventory);

  // Resources at least one awake, cared-for pet can currently fetch, in a
  // stable order.
  const fetchableResources = useMemo(() => {
    const available = new Set<PetResourceName>();
    activePets.forEach(([, pet]) => {
      if (!pet || isPetNapping(pet, now) || isPetNeglected(pet, now)) return;
      if (!getPetType(pet)) return;
      const { level } = getPetLevel(pet.experience);
      getPetFetches(pet).fetches.forEach((fetch) => {
        // Only surface resources at least one pet can currently afford a fetch
        // of, otherwise the input can only ever produce a shortfall.
        if (
          level >= fetch.level &&
          pet.energy >= PET_RESOURCES[fetch.name].energy
        ) {
          available.add(fetch.name);
        }
      });
    });
    return getKeys(PET_RESOURCES).filter((resource) => available.has(resource));
  }, [activePets, now]);

  if (fetchableResources.length === 0) {
    return (
      <InnerPanel className="p-1 mb-1">
        <Label type="danger">{t("pets.bulkFetch.noPets")}</Label>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className="flex flex-col gap-1 p-1 mb-1">
      <p className="text-xs px-1 pb-1">{t("pets.bulkFetch.description")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {fetchableResources.map((resource) => {
          const requested = desired[resource] ?? 0;
          const projected = plan.fulfilled[resource] ?? new Decimal(0);
          const isShort = !!plan.shortfall[resource];
          const inventoryCount = inventory[resource] ?? new Decimal(0);

          return (
            <InnerPanel
              key={resource}
              className="flex gap-2 items-center w-full"
            >
              <SmallBox
                image={ITEM_DETAILS[resource].image}
                count={inventoryCount}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-xs">{resource}</p>
                <div className="flex flex-row gap-1 items-center">
                  <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                  <p className="text-xxs">
                    {t("pets.bulkFetch.energyEach", {
                      energy: PET_RESOURCES[resource].energy,
                    })}
                  </p>
                </div>
                {requested > 0 && (
                  <p
                    className={classNames("text-xxs", {
                      "text-red-600": isShort,
                    })}
                  >
                    {isShort
                      ? t("pets.bulkFetch.short", {
                          have: formatFetchYield(projected),
                          want: requested,
                        })
                      : t("pets.bulkFetch.willFetch", {
                          amount: formatFetchYield(projected),
                        })}
                  </p>
                )}
              </div>
              <div className="w-16 flex-shrink-0">
                <NumberInput
                  value={requested}
                  maxDecimalPlaces={0}
                  isRightAligned
                  onValueChange={(value) =>
                    onChange({ ...desired, [resource]: value.toNumber() })
                  }
                />
              </div>
            </InnerPanel>
          );
        })}
      </div>
    </InnerPanel>
  );
};
