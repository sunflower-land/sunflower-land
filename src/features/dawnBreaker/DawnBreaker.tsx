import React, { useContext, useLayoutEffect, useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useScrollIntoView, Section } from "lib/utils/hooks/useScrollIntoView";
import { Hud } from "features/island/hud/Hud";

import background from "assets/land/dawn_breaker.webp";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useActor, useSelector } from "@xstate/react";
import { NPC } from "features/island/bumpkin/components/NPC";
import {
  Bumpkin,
  DawnBreaker as DawnBreakerType,
  Inventory,
  LanternOffering,
} from "features/game/types/game";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { lanternPositions } from "./lib/positions";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _dawnBreaker = (state: MachineState) =>
  state.context.state.dawnBreaker ?? ({} as DawnBreakerType);
const _inventory = (state: MachineState) => state.context.state.inventory;
const _autosaving = (state: MachineState) => state.matches("autosaving");

export const DawnBreaker: React.FC = () => {
  const { gameService } = useContext(Context);
  const [scrollIntoView] = useScrollIntoView();

  const bumpkin = useSelector(gameService, _bumpkin);
  const dawnBreaker = useSelector(gameService, _dawnBreaker);
  const inventory = useSelector(gameService, _inventory);
  const autosaving = useSelector(gameService, _autosaving);

  const { availableLantern, lanternsCraftedByWeek } = dawnBreaker;

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.DawnBreakerBackGround, "auto");
  }, []);

  const getLaternsCraftedCount = () => {
    if (!availableLantern) return 0;

    return lanternsCraftedByWeek[availableLantern.startAt] ?? 0;
  };

  const laternsCraftedThisWeek =
    availableLantern && lanternsCraftedByWeek[availableLantern.startAt];

  return (
    <>
      <div
        className="blur-to-focus absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${40 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      >
        <img
          src={background}
          className="absolute inset-0 w-full h-full"
          id={Section.DawnBreakerBackGround}
        />
        <IslandTravel
          bumpkin={bumpkin}
          inventory={inventory}
          x={-5}
          y={-16}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          travelAllowed={!autosaving}
        />
        <Bumpkin
          bumpkin={bumpkin as Bumpkin}
          lantern={availableLantern}
          inventory={inventory}
        />
        {availableLantern &&
          [...Array(getLaternsCraftedCount()).keys()].map((_, index) => {
            const { name, startAt } = availableLantern;
            const positions = lanternPositions[startAt];

            return (
              <MapPlacement
                key={index}
                x={positions[index].x}
                y={positions[index].y}
                width={1}
              >
                <div className="w-full flex justify-center">
                  <img
                    src={ITEM_DETAILS[name].image}
                    alt={name}
                    style={{ width: `${11 * PIXEL_SCALE}px` }}
                  />
                </div>
              </MapPlacement>
            );
          })}
      </div>

      <Hud isFarming={false} />
      {/* <ClickableGridCoordinatesBuilder gridCols={40} gridRows={40} /> */}
    </>
  );
};

const Bumpkin = ({
  bumpkin,
  lantern = {} as LanternOffering,
  inventory,
}: {
  bumpkin: Bumpkin;
  inventory: Inventory;
  lantern?: LanternOffering;
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCraft = () => {
    gameService.send("lantern.crafted", {
      name: lantern?.name,
    });

    handleClose();
  };

  const hasMissingIngredients = getKeys(lantern?.ingredients ?? {}).some(
    (name) => {
      const balance = inventory[name] ?? new Decimal(0);
      const amount = lantern?.ingredients[name] ?? new Decimal(0);

      return balance.lt(amount);
    }
  );

  const hasSflRequirement = gameState.context.state.balance.gte(
    lantern?.sfl ?? new Decimal(0)
  );
  const disableCraft = hasMissingIngredients || !hasSflRequirement;

  return (
    <>
      <MapPlacement x={-11} y={5} width={1}>
        <NPC {...bumpkin.equipped} onClick={handleOpen} />
      </MapPlacement>
      {lantern && (
        <Modal show={showModal} onHide={handleClose} centered>
          <CloseButtonPanel title={lantern.name} onClose={handleClose}>
            <div className="p-2 pt-0">
              <p className="text-sm">
                Im baby ramps pork belly DSA umami. Ramps wayfarers poutine kogi
                health goth. Health goth iceland meh XOXO, tousled meditation
                dreamcatcher swag skateboard.
              </p>
              <OuterPanel className="flex p-2 w-1/2 mx-auto mt-3 mb-2">
                <div className="flex flex-1 items-center justify-center">
                  <img
                    src={ITEM_DETAILS[lantern.name].image}
                    alt={lantern.name}
                    className="w-10"
                  />
                </div>
                <div className="flex flex-1 items-center justify-center flex-col">
                  {lantern.sfl && (
                    <RequirementLabel
                      type="sellForSfl"
                      requirement={lantern.sfl}
                    />
                  )}
                  {lantern.ingredients &&
                    getKeys(lantern.ingredients).map((name) => (
                      <RequirementLabel
                        key={name}
                        type="item"
                        item={name}
                        requirement={
                          lantern.ingredients[name] ?? new Decimal(0)
                        }
                        balance={inventory[name] ?? new Decimal(0)}
                      />
                    ))}
                </div>
              </OuterPanel>
            </div>
            <Button onClick={handleCraft} disabled={disableCraft}>
              Craft Lantern
            </Button>
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
