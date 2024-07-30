import React, { useContext, useState } from "react";

import { ANIMALS, getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { getSupportedChickens } from "features/game/events/landExpansion/utils";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { GenericItemDetails } from "components/ui/layouts/GenericItemDetails";

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
      (index) => state.chickens[index].coordinates,
    ).length,
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

  const itemDetails =
    selectedChicken === "buy"
      ? {
          icon: SUNNYSIDE.resource.chicken,
          title: t("chicken"),
          description: t("henHouse.text.one"),
          coinsRequirement: price,
        }
      : selectedChicken === "lazy"
        ? {
            icon: SUNNYSIDE.animals.boxChicken,
            title: t("henHouse.text.two"),
            description: t("henHouse.text.three"),
          }
        : {
            icon: SUNNYSIDE.resource.chicken,
            title: t("henHouse.text.four"),
            description: t("henHouse.text.five"),
          };

  const getAction = () => {
    if (selectedChicken === "buy") {
      return (
        <Button disabled={!canBuyChicken || autosaving} onClick={handleBuy}>
          {autosaving ? t("saving") : t("buy")}
        </Button>
      );
    }

    if (selectedChicken === "lazy") {
      return (
        <Button
          onClick={handlePlace}
          disabled={!canPlaceLazyChicken || autosaving}
        >
          {autosaving ? t("saving") : "Place"}
        </Button>
      );
    }

    return <></>;
  };

  const getContent = () => (
    <>
      <div className="flex flex-wrap mb-2">
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
          image={SUNNYSIDE.animals.boxChicken}
        />
        <Box
          isSelected={selectedChicken === "buy"}
          key="buy-chicken"
          onClick={() => setSelectedChicken("buy")}
          image={SUNNYSIDE.icons.plus}
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
    </>
  );

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          icon: SUNNYSIDE.resource.chicken,
          name: t("henHouse.chickens"),
        },
      ]}
    >
      <SplitScreenView
        panel={
          <GenericItemDetails
            gameState={state}
            details={{
              icon: itemDetails.icon,
              title: itemDetails.title,
              description: itemDetails.description,
            }}
            requirements={
              itemDetails.coinsRequirement
                ? { coins: itemDetails.coinsRequirement }
                : undefined
            }
            actionView={getAction()}
          />
        }
        content={getContent()}
      />
    </CloseButtonPanel>
  );
};
