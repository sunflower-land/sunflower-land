import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import {
  Bumpkin,
  Inventory,
  LanternOffering,
  LanternsCraftedByWeek,
} from "features/game/types/game";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ITEM_DETAILS } from "features/game/types/images";
import { Week, characters } from "../lib/characters";
import { OuterPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { NPC } from "features/island/bumpkin/components/NPC";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { setImageWidth } from "lib/images";

interface Props {
  currentWeek: Week;
  lanternsCraftedByWeek: LanternsCraftedByWeek;
  bumpkin: Bumpkin;
  inventory: Inventory;
  availableLantern?: LanternOffering;
}

const _balance = (state: MachineState) => state.context.state.balance;

export const PlayerBumpkin: React.FC<Props> = ({
  bumpkin,
  availableLantern,
  lanternsCraftedByWeek,
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

  // Requirements are multiplied by the number of lanterns crafted + 1 (for the current week)
  // eg. 1st lantern requires 1x, 2nd lantern requires 2x, 3rd lantern requires 3x, etc.
  let multiplier = 1;
  const lanternsCraftedThisWeek = lanternsCraftedByWeek[currentWeek];

  if (lanternsCraftedThisWeek) {
    multiplier = lanternsCraftedThisWeek + 1;
  }

  const hasMissingIngredients = getKeys(
    availableLantern?.ingredients ?? {}
  ).some((name) => {
    const balance = inventory[name] ?? new Decimal(0);
    const amount = (availableLantern?.ingredients[name] ?? new Decimal(0)).mul(
      multiplier
    );

    return balance.lt(amount);
  });

  const lessFunds = balance.lt(
    SFLDiscount(
      gameService.state?.context.state,
      (availableLantern?.sfl ?? new Decimal(0)).mul(multiplier)
    )
  );
  const disableCraft = hasMissingIngredients || lessFunds;

  return (
    <>
      <MapPlacement
        x={characters[currentWeek].bumpkin.x}
        y={characters[currentWeek].bumpkin.y}
        width={1}
      >
        {/* Shift NPC a little on week 8 to fit map position */}
        <div style={{ marginLeft: currentWeek === 8 ? "18px" : 0 }}>
          <NPC parts={bumpkin.equipped} onClick={handleOpen} />
        </div>
      </MapPlacement>
      {availableLantern && (
        <Modal show={showModal} onHide={handleClose} centered>
          <CloseButtonPanel title={availableLantern.name} onClose={handleClose}>
            <div className="p-2 pt-0">
              <p className="text-sm">
                Each crafted lantern will bring light to the darkness and help
                to conquer the darkness hidden in the shadows.
              </p>
              <a
                href="https://docs.sunflower-land.com/player-guides/seasons/dawn-breaker#dawn-breaker-island"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
              >
                Read more
              </a>
              <OuterPanel className="flex p-2 w-3/4 md:w-1/2 mx-auto mt-3 mb-2">
                <div className="flex flex-1 items-center justify-center">
                  <img
                    src={ITEM_DETAILS[availableLantern.name].image}
                    alt={availableLantern.name}
                    onLoad={(e) => setImageWidth(e.currentTarget)}
                  />
                </div>
                <div className="flex flex-1 items-center justify-center flex-col">
                  {availableLantern.sfl && (
                    <RequirementLabel
                      type="sfl"
                      balance={balance}
                      requirement={SFLDiscount(
                        gameService.state?.context.state,
                        availableLantern.sfl.mul(multiplier)
                      )}
                    />
                  )}
                  {availableLantern.ingredients &&
                    getKeys(availableLantern.ingredients).map((name) => (
                      <RequirementLabel
                        key={name}
                        type="item"
                        item={name}
                        requirement={(
                          availableLantern.ingredients[name] ?? new Decimal(0)
                        ).mul(multiplier)}
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
