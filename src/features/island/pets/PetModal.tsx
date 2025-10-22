import React, { useCallback, useContext, useState } from "react";
import {
  isPetNFT,
  Pet,
  PetNFT,
  PetType,
  getPetType,
  PET_CATEGORIES,
  getPetLevel,
  getPetRequestXP,
} from "features/game/types/pets";
import { Modal } from "components/ui/Modal";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

import levelUp from "assets/icons/level_up.png";
import xpIcon from "assets/icons/xp.png";
import { ResizableBar } from "components/ui/ProgressBar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import {
  getPetEnergy,
  getPetExperience,
  getPetFoodRequests,
} from "features/game/events/pets/feedPet";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Decimal } from "decimal.js-light";
import { CookableName } from "features/game/types/consumables";
import { ResetFoodRequests } from "./ResetFoodRequests";

interface Props {
  show: boolean;
  onClose: () => void;
  data?: Pet | PetNFT;
  isNeglected: boolean;
  isTypeFed?: boolean;
  petType?: PetType;
}

const _game = (state: MachineState) => state.context.state;

export const PetModal: React.FC<Props> = ({
  show,
  onClose,
  data,
  isNeglected,
  isTypeFed,
  petType,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [action, setAction] = useState<"feeding" | "fetching" | "resetting">(
    "feeding",
  );

  const game = useSelector(gameService, _game);

  const handleFeed = useCallback(
    (food: CookableName) => {
      if (!data?.name) return;
      gameService.send("pet.fed", { petId: data?.name, food });
    },
    [gameService, data?.name],
  );

  const handleResetRequests = () => {
    if (!data?.name) return;

    gameService.send("REVEAL", {
      event: {
        type: "reset.petRequests",
        petId: data.name,
        createdAt: new Date(),
      },
    });
  };

  if (!data) return null;

  const isNFTPet = isPetNFT(data);
  const image = ITEM_DETAILS[isNFTPet ? "Ramsey" : data.name].image;
  const type = getPetType(data) as PetType;
  const petCategory = PET_CATEGORIES[type];
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getPetLevel(data.experience);
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

  return (
    <Modal show={show} onHide={onClose}>
      <OuterPanel className="flex flex-col gap-1">
        <div className="flex items-center p-1 justify-between">
          <Label type="default">{data.name}</Label>
          <img
            onClick={onClose}
            src={SUNNYSIDE.icons.close}
            alt={data.name}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        {/* Pet Information Panel */}
        <InnerPanel>
          <div className="flex px-4 py-3 gap-4 w-full items-center">
            <div className="flex justify-center w-1/4 items-center gap-2">
              <img
                src={image}
                alt={data.name}
                className="w-16 object-contain"
              />
            </div>
            <div className="flex flex-col">
              {/* Pet Type and Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                <Label type="info" className="text-xs">
                  {getPetType(data)}
                </Label>
                <Label type="chill" className="text-xs">
                  {petCategory.primary}
                </Label>
                {petCategory.secondary && (
                  <Label type="formula" className="text-xs">
                    {petCategory.secondary}
                  </Label>
                )}
                {petCategory.tertiary && (
                  <Label type="vibrant" className="text-xs">
                    {petCategory.tertiary}
                  </Label>
                )}
              </div>

              {/* Level and Experience */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <img src={levelUp} className="w-4" />
                  <span className="ml-1 text-xs">
                    {t("pets.level", { level })}
                  </span>
                </div>
                {/* Energy */}
                <div className="flex items-center gap-2 text-xs mb-1">
                  <img src={SUNNYSIDE.icons.lightning} className="h-5" />
                  <span>{t("pets.energy", { energy: data.energy })}</span>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img src={xpIcon} className="w-5" />
                <ResizableBar
                  percentage={percentage}
                  type="progress"
                  outerDimensions={{ width: 30, height: 7 }}
                />
                <span className="text-xs mb-1">
                  {t("pets.xp", {
                    currentProgress,
                    experienceBetweenLevels: experienceBetweenLevels,
                  })}
                </span>
              </div>
            </div>
          </div>
        </InnerPanel>

        {/* Feeding & Fetching UI */}
        {(action === "feeding" || action === "fetching") && (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1.5 my-1">
              <Button
                className="h-10"
                disabled={action === "feeding"}
                onClick={() => setAction("feeding")}
              >
                {t("pets.feed")}
              </Button>
              <Button
                className="h-10"
                disabled={action === "fetching"}
                onClick={() => setAction("fetching")}
              >
                {t("pets.fetch")}
              </Button>
            </div>
            {action === "feeding" && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <Label type="default">{t("pets.requestsToday")}</Label>
                  <p
                    className="underline font-secondary text-xxs pb-1 -mt-1 mr-1 cursor-pointer hover:text-blue-500"
                    onClick={() => setAction("resetting")}
                  >
                    {t("pets.resetRequests")}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {sortedFoodRequests.map((food) => {
                    const isRequested = foodRequests.includes(food);
                    const isComplete =
                      isRequested &&
                      fedToday &&
                      data.requests.foodFed?.includes(food);
                    const isUpcoming = !isRequested;

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
                    const foodAvailable = (
                      game.inventory[food] ?? new Decimal(0)
                    ).toNumber();

                    return (
                      <div
                        key={`food-request-${food}`}
                        className="flex w-full gap-1"
                      >
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
                                <img
                                  src={xpIcon}
                                  className="w-[80%] object-contain"
                                />
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
                          onClick={() => handleFeed(food)}
                        >
                          {isComplete ? (
                            <img
                              src={SUNNYSIDE.icons.confirm}
                              className="w-5"
                            />
                          ) : (
                            <p>{t("pets.feed")}</p>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {action === "resetting" && (
          <ResetFoodRequests
            petData={data}
            inventory={game.inventory}
            todayDate={todayDate}
            handleResetRequests={handleResetRequests}
            onAcknowledged={() => {
              gameService.send("CONTINUE");
            }}
            onBack={() => setAction("feeding")}
          />
        )}
      </OuterPanel>
    </Modal>
  );
};
