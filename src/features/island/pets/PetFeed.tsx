import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import {
  getPetEnergy,
  getPetExperience,
  getPetFoodRequests,
} from "features/game/events/pets/feedPet";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getPetLevel,
  getPetRequestXP,
  isPetNFT,
  Pet,
  PetNFT,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import xpIcon from "assets/icons/xp.png";
import { Button } from "components/ui/Button";

type Props = {
  data: Pet | PetNFT;
  onResetClick: () => void;
  onFeed: (food: CookableName) => void;
};

const _game = (state: MachineState) => state.context.state;

export const PetFeed: React.FC<Props> = ({ data, onFeed, onResetClick }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);

  const isNFTPet = isPetNFT(data);
  const { level } = getPetLevel(data.experience);
  const foodRequests = getPetFoodRequests(data, level);
  const lastFedAt = data.requests.fedAt;
  const todayDate = new Date(Date.now()).toISOString().split("T")[0];
  const lastFedAtDate = new Date(lastFedAt ?? 0).toISOString().split("T")[0];
  const fedToday = lastFedAtDate === todayDate;
  const sortedFoodRequests = [...data.requests.food].sort((a, b) => {
    const aIsRequested = foodRequests.includes(a);
    const bIsRequested = foodRequests.includes(b);

    // If both are requested or both are not requested, maintain original order
    if (aIsRequested === bIsRequested) {
      return 0;
    }

    // Requested foods (available) come first
    return aIsRequested ? -1 : 1;
  });

  const getRequestDetails = (food: CookableName) => {
    const isRequested = foodRequests.includes(food);
    const isComplete =
      isRequested && fedToday && data.requests.foodFed?.includes(food);

    const baseFoodXp = getPetRequestXP(food);
    const foodXp = getPetExperience({
      basePetXP: baseFoodXp,
      game,
      petLevel: level,
      isPetNFT: isNFTPet,
    });
    const petEnergy = getPetEnergy({
      petLevel: level,
      basePetEnergy: baseFoodXp,
    });

    return {
      isRequested,
      isComplete,
      foodXp,
      petEnergy,
    };
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Label type="default">{t("pets.requestsToday")}</Label>
        <p
          className="underline font-secondary text-xxs pb-1 -mt-1 mr-1 cursor-pointer hover:text-blue-500"
          onClick={onResetClick}
        >
          {t("pets.resetRequests")}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        {sortedFoodRequests.map((food) => {
          const foodAvailable = (
            game.inventory[food] ?? new Decimal(0)
          ).toNumber();

          const { isRequested, isComplete, foodXp, petEnergy } =
            getRequestDetails(food);

          return (
            <div key={`food-request-${food}`} className="flex w-full gap-1">
              <InnerPanel className="w-[80%] flex gap-1">
                <div
                  className="bg-brown-600 relative mr-0.5 w-5 h-5 flex justify-center items-center"
                  style={{
                    width: `${PIXEL_SCALE * 15}px`,
                    height: `${PIXEL_SCALE * 15}px`,
                    ...pixelDarkBorderStyle,
                  }}
                >
                  <img
                    src={ITEM_DETAILS[food].image}
                    className="w-[90%] h-[90%] object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-center -mt-0.5">
                  <p className="text-xs mb-0.5">{food}</p>
                  <p className="text-xxs">
                    {t("count.available", { count: foodAvailable })}
                  </p>
                </div>
                <div>
                  <div className="flex flex-row gap-1">
                    <span className="text-xs text-right">{`+${foodXp}`}</span>
                    <div className="flex flex-row w-5 h-5 justify-center items-center">
                      <img src={xpIcon} className="w-[80%] object-contain" />
                    </div>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <span className="text-xs">{`+${petEnergy}`}</span>
                    <div className="flex flex-row w-5 h-5">
                      <img
                        src={SUNNYSIDE.icons.lightning}
                        className="w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </InnerPanel>
              <Button
                className="w-[20%]"
                disabled={isComplete || foodAvailable === 0}
                onClick={() => onFeed(food)}
              >
                {isComplete ? (
                  <img src={SUNNYSIDE.icons.confirm} className="w-6" />
                ) : (
                  <p>{t("pets.feed")}</p>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
