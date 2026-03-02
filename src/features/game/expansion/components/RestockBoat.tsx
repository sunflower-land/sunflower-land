import React, { useContext, useState } from "react";
import boat from "assets/decorations/restock_boat.png";
import { Coordinates, MapPlacement } from "./MapPlacement";
import {
  INITIAL_STOCK,
  PIXEL_SCALE,
  StockableName,
} from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  canRestockShipment,
  SHIPMENT_STOCK,
} from "features/game/events/landExpansion/shipmentRestocked";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Button } from "components/ui/Button";
import confetti from "canvas-confetti";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import Decimal from "decimal.js-light";
import { SEEDS } from "features/game/types/seeds";
import { WORKBENCH_TOOLS, TREASURE_TOOLS } from "features/game/types/tools";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;
const canRestock = (state: MachineState) =>
  canRestockShipment({ game: state.context.state }) &&
  !!state.context.state.shipments.restockedAt;

const _state = (state: MachineState) => state.context.state;

export const RestockBoat: React.FC = () => {
  const { t } = useAppTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { gameService, showAnimations } = useContext(Context);

  const expansionCount = useSelector(gameService, expansions);
  const state = useSelector(gameService, _state);
  const showShip = useSelector(gameService, canRestock);
  if (!showShip) return null;
  const getShipmentAmount = (item: StockableName, amount: number): Decimal => {
    const totalStock = INITIAL_STOCK(state)[item];
    const remainingStock = state.stock[item] ?? new Decimal(0);
    // If shipment amount will exceed total stock
    if (remainingStock.add(amount).gt(totalStock)) {
      // return the difference between total and remaining stock
      return totalStock.sub(remainingStock);
    } else {
      // else return shipment stock
      return new Decimal(amount);
    }
  };

  const restockTools = Object.entries(SHIPMENT_STOCK)
    .filter((item) => item[0] in { ...WORKBENCH_TOOLS, ...TREASURE_TOOLS })
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockSeeds = Object.entries(SHIPMENT_STOCK)
    .filter((item) => item[0] in SEEDS)
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockIsEmpty = [...restockSeeds, ...restockTools].length <= 0;

  if (restockIsEmpty) return null;

  const wharfCoords = (): Coordinates => {
    if (expansionCount < 7) {
      return { x: -1, y: -7 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: 0, y: -10 };
    } else {
      return { x: 0, y: -17 };
    }
  };

  return (
    <>
      <MapPlacement {...wharfCoords()}>
        <img
          src={boat}
          style={{
            width: `${68 * PIXEL_SCALE}px`,
          }}
          className="cursor-pointer hover:img-highlight"
          onClick={() => setIsOpen(true)}
        />
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          onClose={() => setIsOpen(false)}
        >
          <div className="p-1">
            <Label type="default" className="mb-2">
              {t("gems.shipment.arrived")}
            </Label>
            <p className="text-sm mb-2">{t("gems.shipment.success")}</p>
            <p className="text-sm mb-2">{t("gems.shipment.shops")}</p>
          </div>
          <div className="mt-1 h-auto overflow-y-auto overflow-x-hidden scrollable pl-1">
            {restockTools.length > 0 && (
              <Label
                icon={ITEM_DETAILS.Axe.image}
                type="default"
                className="ml-2 mb-1"
              >
                {t("tools")}
              </Label>
            )}
            <div className="flex flex-wrap mb-2">
              {restockTools.map(([item, amount]) => {
                const shipmentAmount = getShipmentAmount(
                  item as StockableName,
                  amount,
                );
                return (
                  <Box
                    key={item}
                    count={shipmentAmount}
                    image={ITEM_DETAILS[item as StockableName].image}
                  />
                );
              })}
            </div>
            {restockSeeds.length > 0 && (
              <Label
                icon={CROP_LIFECYCLE["Basic Biome"].Sunflower.seed}
                type="default"
                className="ml-2 mb-1"
              >
                {t("seeds")}
              </Label>
            )}
            <div className="flex flex-wrap mb-2">
              {restockSeeds.map(([item, amount]) => {
                const shipmentAmount = getShipmentAmount(
                  item as StockableName,
                  amount,
                );
                return (
                  <Box
                    key={item}
                    count={shipmentAmount}
                    image={ITEM_DETAILS[item as StockableName].image}
                  />
                );
              })}
            </div>
          </div>
          <Button
            onClick={() => {
              gameService.send({ type: "shipment.restocked" });

              if (showAnimations) confetti();
              setIsOpen(false);
            }}
          >
            {t("gems.replenish")}
          </Button>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
