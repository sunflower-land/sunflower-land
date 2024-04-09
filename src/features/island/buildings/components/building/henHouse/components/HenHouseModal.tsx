import React, { useContext, useState } from "react";

import plus from "assets/icons/plus.png";
import boxChicken from "assets/animals/chickens/box_chicken.png";
import coins from "assets/icons/coins.webp";

import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ANIMALS, getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import classNames from "classnames";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getSupportedChickens } from "features/game/events/landExpansion/utils";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const HenHouseModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const autosaving = gameState.matches("autosaving");

  const inventory = state.inventory;

  // V1 may have ones without coords
  const workingChickenCount = new Decimal(
    getKeys(state.chickens).filter(
      (index) => state.chickens[index].coordinates
    ).length
  );
  const ownedChickenCount = new Decimal(inventory.Chicken || 0);
  const lazyChickenCount = workingChickenCount.greaterThan(ownedChickenCount)
    ? new Decimal(0)
    : ownedChickenCount.minus(workingChickenCount);

  const availableSpots = getSupportedChickens(state);
  const henHouseFull = ownedChickenCount.greaterThanOrEqualTo(availableSpots);
  const workingCapacityFull =
    workingChickenCount.greaterThanOrEqualTo(availableSpots);

  const price = ANIMALS["Chicken"].price;

  const lessFunds = () => {
    if (price === undefined) return true;

    return state.coins < price;
  };

  const canBuyChicken = !henHouseFull && !workingCapacityFull && !lessFunds();
  const canPlaceLazyChicken =
    !workingCapacityFull && lazyChickenCount.greaterThanOrEqualTo(1);

  const [selectedChicken, setSelectedChicken] = useState<
    "working" | "lazy" | "buy"
  >(canPlaceLazyChicken ? "lazy" : canBuyChicken ? "buy" : "working");

  const handleBuy = () => {
    gameService.send("LANDSCAPE", {
      placeable: "Chicken",
      action: "chicken.bought",
      // Not used yet
      requirements: {
        coins: price,
        ingredients: {},
      },
      maximum: availableSpots,
      multiple: true,
    });

    onClose();
  };

  const handlePlace = () => {
    gameService.send("LANDSCAPE", {
      placeable: "Chicken",
      action: "chicken.placed",
      multiple: true,
      // Not used yet
      requirements: {
        coins: 0,
        ingredients: {},
      },
    });
    onClose();
  };

  const Details = () => {
    if (selectedChicken === "buy") {
      return (
        <>
          <div className="flex flex-col justify-center items-center p-2 relative">
            <span className="text-center">{t("chicken")}</span>
            <img
              src={SUNNYSIDE.resource.chicken}
              className="h-16 img-highlight mt-1"
              alt="chicken"
            />
            <span className="text-center mt-2 text-sm">
              {t("henHouse.text.one")}
            </span>
            <>
              <div className="border-t border-white w-full mt-2 pt-1">
                <div className="flex justify-center mt-2 items-center">
                  <img src={coins} className="h-5 mr-1" />
                  <span
                    className={classNames("text-xs text-center ", {
                      "text-red-500": lessFunds(),
                    })}
                  >
                    {`${price?.toString()}`}
                  </span>
                </div>
              </div>
            </>
          </div>
          <Button
            disabled={!canBuyChicken || autosaving}
            className="text-xs mt-3 whitespace-nowrap"
            onClick={handleBuy}
          >
            {autosaving ? t("saving") : t("buy")}
          </Button>
        </>
      );
    }

    if (selectedChicken === "lazy") {
      return (
        <>
          <div className="flex flex-col justify-center items-center p-2 relative">
            <span className="text-center">{t("henHouse.text.two")}</span>
            <img
              src={boxChicken}
              className="h-16 img-highlight mt-1"
              alt="chicken"
            />
            <div className="flex mt-2 relative">
              <span className="text-center text-sm">
                {t("henHouse.text.three")}
              </span>
            </div>
          </div>
          <Button
            className="text-xs mt-3 whitespace-nowrap"
            onClick={handlePlace}
            disabled={!canPlaceLazyChicken || autosaving}
          >
            {autosaving ? t("saving") : "Place"}
          </Button>
        </>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center p-2 relative">
        <span className="text-center">{t("henHouse.text.four")}</span>
        <img
          src={SUNNYSIDE.resource.chicken}
          className="h-16 img-highlight mt-1"
          alt="chicken"
        />
        <span className="text-center mt-2 text-xs">
          {t("henHouse.text.five")}
        </span>
      </div>
    );
  };

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive>
          <img src={SUNNYSIDE.resource.chicken} className="h-5 mr-2" />
          <span className="text-sm">{t("henHouse.chickens")}</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      <div
        className="flex"
        style={{
          minHeight: "200px",
        }}
      >
        <div className="flex items-stretch flex-col-reverse sm:flex-row">
          <div
            className="w-full sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
            style={{ maxHeight: 400 }}
          >
            <div className="flex flex-wrap">
              <Box
                isSelected={selectedChicken === "working"}
                key="working-chicken"
                count={workingChickenCount}
                onClick={() => setSelectedChicken("working")}
                image={SUNNYSIDE.resource.chicken}
              />
              <Box
                isSelected={selectedChicken === "lazy"}
                key="lazy-chicken"
                count={lazyChickenCount}
                onClick={() => setSelectedChicken("lazy")}
                image={boxChicken}
              />
              <Box
                isSelected={selectedChicken === "buy"}
                key="buy-chicken"
                onClick={() => setSelectedChicken("buy")}
                image={plus}
              />
            </div>
            <div className="flex flex-col items-baseline w-full">
              <Label
                type={workingCapacityFull ? "danger" : "info"}
                className="sm:mr-auto m-1"
              >
                {`Capacity ${workingChickenCount}/${availableSpots}`}
              </Label>
              {workingCapacityFull && (
                <p className="text-xs mx-1 mb-1">{t("henHouse.text.six")}</p>
              )}
            </div>
          </div>
          <OuterPanel className="w-full flex-1">{Details()}</OuterPanel>
        </div>
      </div>
    </Panel>
  );
};
