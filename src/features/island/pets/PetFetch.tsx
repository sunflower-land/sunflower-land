import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getPetFetches,
  getPetLevel,
  isPetNapping,
  isPetNeglected,
  Pet,
  PET_RESOURCES,
  PetNFT,
  PetResourceName,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

type Props = {
  data: Pet | PetNFT;
  onShowRewards: () => void;
  onFetch: (fetch: PetResourceName) => void;
};

export const PetFetch: React.FC<Props> = ({ data, onShowRewards, onFetch }) => {
  const { t } = useAppTranslation();

  const { level } = getPetLevel(data.experience);
  const fetches = [...getPetFetches(data).fetches].sort(
    (a, b) => a.level - b.level,
  );
  const isNapping = isPetNapping(data);
  const neglected = isPetNeglected(data);

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
      <div className="flex flex-col gap-1">
        {fetches.map(({ name, level: requiredLevel }) => {
          const hasRequiredLevel = level >= requiredLevel;
          const energyRequired = PET_RESOURCES[name].energy;
          const hasEnoughEnergy = data.energy >= energyRequired;
          const fetchYield = data.fetches?.[name] ?? 1;

          return (
            <div key={`fetch-${name}`} className="flex w-full gap-1">
              <InnerPanel className="w-[80%] flex gap-1 items-center">
                <div
                  className="bg-brown-600 relative mr-0.5 w-5 h-5 flex justify-center items-center"
                  style={{
                    width: `${PIXEL_SCALE * 15}px`,
                    height: `${PIXEL_SCALE * 15}px`,
                    ...pixelDarkBorderStyle,
                  }}
                >
                  <img
                    src={ITEM_DETAILS[name].image}
                    alt={name}
                    className="w-[90%] h-[90%] object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex flex-col flex-1 justify-center -mt-0.5">
                    <p className="text-xs mb-0.5">{`${fetchYield} x ${name}`}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between w-full pt-1">
                    <div className="flex flex-row gap-1 justify-center items-center">
                      <div className="flex flex-row gap-1 justify-center items-center">
                        <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                        <p
                          className={classNames(`text-xxs`, {
                            "text-red-600": !hasEnoughEnergy,
                          })}
                        >{`${data.energy}/${energyRequired} Energy`}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {!hasRequiredLevel && (
                  <Popover key={name}>
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
                className="w-[25%]"
                disabled={
                  isNapping ||
                  neglected ||
                  !hasRequiredLevel ||
                  !hasEnoughEnergy
                }
                onClick={() => onFetch(name)}
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
