import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Bumpkin, Inventory, LanternOffering } from "features/game/types/game";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ITEM_DETAILS } from "features/game/types/images";
import { Week, bumpkinPositions } from "../lib/positions";
import { OuterPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { NPC } from "features/island/bumpkin/components/NPC";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

interface Props {
  currentWeek: Week;
  bumpkin: Bumpkin;
  inventory: Inventory;
  availableLantern?: LanternOffering;
}

const _balance = (state: MachineState) => state.context.state.balance;

export const PlayerBumpkin: React.FC<Props> = ({
  bumpkin,
  availableLantern,
  inventory,
  currentWeek,
}) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const balance = useSelector(gameService, _balance);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCraft = () => {
    gameService.send("lantern.crafted", {
      name: availableLantern?.name,
    });

    handleClose();
  };

  const hasMissingIngredients = getKeys(
    availableLantern?.ingredients ?? {}
  ).some((name) => {
    const balance = inventory[name] ?? new Decimal(0);
    const amount = availableLantern?.ingredients[name] ?? new Decimal(0);

    return balance.lt(amount);
  });

  const hasSflRequirement = balance.gte(
    availableLantern?.sfl ?? new Decimal(0)
  );
  const disableCraft = hasMissingIngredients || !hasSflRequirement;

  return (
    <>
      <MapPlacement
        x={bumpkinPositions[currentWeek].x}
        y={bumpkinPositions[currentWeek].y}
        width={1}
      >
        {/* Shift NPC a little on week 8 to fit map position */}
        <div style={{ marginLeft: currentWeek === 8 ? "18px" : 0 }}>
          <NPC parts={{ ...bumpkin.equipped }} onClick={handleOpen} />
        </div>
      </MapPlacement>
      {availableLantern && (
        <Modal show={showModal} onHide={handleClose} centered>
          <CloseButtonPanel title={availableLantern.name} onClose={handleClose}>
            <div className="p-2 pt-0">
              <p className="text-sm">
                Im baby ramps pork belly DSA umami. Ramps wayfarers poutine kogi
                health goth. Health goth iceland meh XOXO, tousled meditation
                dreamcatcher swag skateboard.
              </p>
              <OuterPanel className="flex p-2 w-3/4 lg:w-1/2 mx-auto mt-3 mb-2">
                <div className="flex flex-1 items-center justify-center">
                  <img
                    src={ITEM_DETAILS[availableLantern.name].image}
                    alt={availableLantern.name}
                    className="w-10"
                  />
                </div>
                <div className="flex flex-1 items-center justify-center flex-col">
                  {availableLantern.sfl && (
                    <RequirementLabel
                      type="sellForSfl"
                      requirement={availableLantern.sfl}
                    />
                  )}
                  {availableLantern.ingredients &&
                    getKeys(availableLantern.ingredients).map((name) => (
                      <RequirementLabel
                        key={name}
                        type="item"
                        item={name}
                        requirement={
                          availableLantern.ingredients[name] ?? new Decimal(0)
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
