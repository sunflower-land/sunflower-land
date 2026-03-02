import React, { useContext } from "react";
import { Label } from "components/ui/Label";
import { useState } from "react";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import oilBarrel from "assets/icons/oil_barrel.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  BuildingName,
  CookingBuildingName,
} from "features/game/types/buildings";
import { BUILDING_DAILY_OIL_CAPACITY } from "features/game/events/landExpansion/supplyCookingOil";
import {
  BUILDING_DAILY_OIL_CONSUMPTION,
  BUILDING_OIL_BOOSTS,
  isCookingBuilding,
} from "features/game/events/landExpansion/cook";
import { Context } from "features/game/GameProvider";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

interface OilTankProps {
  buildingName: BuildingName;
  buildingId: string;
}

const OIL_INCREMENT_AMOUNT = 1;

export const BuildingOilTank: React.FC<OilTankProps> = ({
  buildingName,
  buildingId,
}) => {
  const { gameService } = useContext(Context);
  const [showAddOilModal, setShowAddOilModal] = useState<boolean>(false);
  const { t } = useAppTranslation();
  const game = gameService.getSnapshot().context.state;

  const [totalOilToAdd, setTotalOilToAdd] = useState(0);

  const building = game.buildings[buildingName]?.find(
    (building) => building.id === buildingId,
  );

  const oilRemainingInBuilding = building?.oil ?? 0;

  const incrementOil = () => {
    setTotalOilToAdd((prev) => prev + OIL_INCREMENT_AMOUNT);
  };

  const decrementOil = () => {
    setTotalOilToAdd((prev) => Math.max(prev - OIL_INCREMENT_AMOUNT, 0));
  };

  const amountToFull =
    BUILDING_DAILY_OIL_CAPACITY[buildingName as CookingBuildingName] -
    oilRemainingInBuilding;
  const incrementMaxOil = () => {
    setTotalOilToAdd(amountToFull);
  };

  function getOilTimeInMillis(oil: number): number {
    if (!isCookingBuilding(buildingName)) {
      return 0;
    }

    const dailyOilConsumption = BUILDING_DAILY_OIL_CONSUMPTION[buildingName];
    const hoursPerDay = 24;
    const oilTimeInHours = (oil / dailyOilConsumption) * hoursPerDay;

    // Convert hours to milliseconds
    const millisecondsPerHour = 60 * 60 * 1000;
    const oilTimeInMillis = oilTimeInHours * millisecondsPerHour;

    return oilTimeInMillis;
  }

  const handleSupplyOil = (amount: number) => {
    gameService.send({
      type: "cookingOil.supplied",
      building: buildingName,
      buildingId,
      oilQuantity: amount,
    });

    gameService.send({ type: "SAVE" });

    setShowAddOilModal(false);
    setTotalOilToAdd(0);
  };

  const canAddOil = () => {
    if (!isCookingBuilding(buildingName)) {
      return false;
    }

    return (
      oilRemainingInBuilding <= BUILDING_DAILY_OIL_CAPACITY[buildingName] - 1
    );
  };

  const canIncrementOil = () => {
    const oilBalance = game.inventory.Oil ?? new Decimal(0);
    if (!canAddOil() || !isCookingBuilding(buildingName) || oilBalance.lt(1))
      return false;

    const hasEnoughOil = oilBalance.toNumber() >= totalOilToAdd;
    const buildingNotFull =
      oilRemainingInBuilding + totalOilToAdd <=
      BUILDING_DAILY_OIL_CAPACITY[buildingName] - 1;

    return hasEnoughOil && buildingNotFull;
  };

  const calculatePercentageFull = (buildingName: BuildingName) => {
    const totalOilMillis = calculateOilTimeRemaining() * 1000;

    if (!isCookingBuilding(buildingName)) {
      return 0;
    }

    const buildingTimeCapacity = getOilTimeInMillis(
      BUILDING_DAILY_OIL_CAPACITY[buildingName],
    );

    const percentage = (totalOilMillis / buildingTimeCapacity) * 100;

    return percentage;
  };

  const calculateOilTimeRemaining = () => {
    if (!isCookingBuilding(buildingName)) {
      return 0;
    }

    return getOilTimeInMillis(oilRemainingInBuilding) / 1000;
  };

  const oilInTank = calculatePercentageFull(buildingName);
  const runtime = calculateOilTimeRemaining();
  const boostPercentage =
    BUILDING_OIL_BOOSTS(game.bumpkin.skills)[
      buildingName as CookingBuildingName
    ] * 100;

  useUiRefresher();

  return (
    <>
      <div className="relative w-full mb-1">
        {runtime === 0 ? (
          <Label
            type={"default"}
            className="ml-1.5 mt-2.5 cursor-pointer"
            icon={ITEM_DETAILS.Oil.image}
            secondaryIcon={SUNNYSIDE.ui.add_button}
            onClick={() => setShowAddOilModal(true)}
          >
            {t("cooking.building.oil.boost")}
          </Label>
        ) : (
          <div>
            <Label
              type={"default"}
              className="ml-1.5 mt-2.5"
              icon={ITEM_DETAILS.Oil.image}
              secondaryIcon={SUNNYSIDE.ui.add_button}
              onClick={() => setShowAddOilModal(true)}
            >
              {t("cropMachine.oilTank")}
            </Label>
            <div className="flex justify-between w-full">
              <div className="flex my-2 ml-1.5 space-x-2 items-center">
                <img
                  src={oilBarrel}
                  style={{ width: `${PIXEL_SCALE * 13}px` }}
                />
                <div className="flex flex-col justify-evenly h-full space-y-1">
                  <ResizableBar
                    percentage={oilInTank}
                    type={oilInTank < 10 ? "error" : "quantity"}
                    outerDimensions={{ width: 40, height: 8 }}
                  />
                  <div className="flex">
                    <div className="text-xs">
                      {t("cooking.building.runtime", {
                        time: secondsToString(runtime, {
                          length: "medium",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        }),
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalOverlay
        show={showAddOilModal}
        className="top-11"
        onBackdropClick={() => {
          setShowAddOilModal(false);
          setTotalOilToAdd(0);
        }}
      >
        <InnerPanel>
          {
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Label
                    type="default"
                    icon={ITEM_DETAILS.Oil.image}
                    className="m-1.5"
                  >
                    {t("cropMachine.addOil")}
                  </Label>
                </div>
                <img
                  src={SUNNYSIDE.icons.close}
                  className="cursor-pointer m-0.5"
                  onClick={() => {
                    setShowAddOilModal(false);
                    setTotalOilToAdd(0);
                  }}
                  style={{
                    width: `${PIXEL_SCALE * 9}px`,
                    height: `${PIXEL_SCALE * 9}px`,
                  }}
                />
              </div>
              <span className="px-2 text-xs pb-1">
                {t("cooking.building.oil.description", {
                  boost: boostPercentage,
                  buildingName: buildingName,
                })}
              </span>
              <div className="flex justify-between items-center">
                <Label
                  type={
                    (game.inventory.Oil?.toNumber() ?? 0) < 1
                      ? "danger"
                      : "info"
                  }
                  className="mx-1.5 mt-2"
                >
                  {t("cropMachine.availableInventory", {
                    amount: formatNumber(
                      (game.inventory.Oil?.toNumber() ?? 0) - totalOilToAdd,
                    ),
                  })}
                </Label>
              </div>
              <div className="flex ml-1">
                <Box image={oilBarrel} />
                <div className="flex w-full justify-between">
                  <div className="flex flex-col justify-center text-xs space-y-1">
                    <span>
                      {t("cropMachine.oilToAdd", {
                        amount: formatNumber(totalOilToAdd),
                      })}
                    </span>
                    <span>
                      {t("cropMachine.totalRuntime", {
                        time: secondsToString(
                          getOilTimeInMillis(totalOilToAdd) / 1000,
                          {
                            length: "full",
                            isShortFormat: true,
                            removeTrailingZeros: true,
                          },
                        ),
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mr-2">
                    <Button
                      className="w-11"
                      disabled={totalOilToAdd === 0}
                      onClick={decrementOil}
                    >{`-${OIL_INCREMENT_AMOUNT}`}</Button>
                    <Button
                      className="w-11"
                      onClick={incrementOil}
                      disabled={!canIncrementOil()}
                    >{`+${OIL_INCREMENT_AMOUNT}`}</Button>
                    <Button className="w-auto" onClick={incrementMaxOil}>
                      {t("max")}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                disabled={totalOilToAdd === 0}
                onClick={() => handleSupplyOil(totalOilToAdd)}
              >
                {t("cropMachine.addOil")}
              </Button>
            </div>
          }
        </InnerPanel>
      </ModalOverlay>
    </>
  );
};
