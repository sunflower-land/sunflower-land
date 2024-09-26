import React, { useContext, useState } from "react";
import boat from "assets/decorations/restock_boat.png";
import { MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { canRestockShipment } from "features/game/events/landExpansion/shipmentRestocked";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Button } from "components/ui/Button";
import confetti from "canvas-confetti";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;
const canRestock = (state: MachineState) =>
  canRestockShipment({ game: state.context.state });

export const RestockBoat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { gameService } = useContext(Context);

  const expansionCount = useSelector(gameService, expansions);
  const showShip = useSelector(gameService, canRestock);

  if (!showShip) return null;
  const wharfCoords = () => {
    if (expansionCount < 7) {
      return { x: -6, y: -3 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: -13, y: -9 };
    } else {
      return { x: -19, y: -15 };
    }
  };

  return (
    <>
      <MapPlacement x={wharfCoords().x} y={wharfCoords().y}>
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
              A shipment has arrived
            </Label>
            <p className="text-sm mb-2">
              Woohoo! A stock shipment has arrived for the shops.
            </p>
            <p className="text-sm mb-2">
              All seeds and tool stock will be replenished at the shops.
            </p>
          </div>
          <Button
            onClick={() => {
              gameService.send("shipment.restocked");
              confetti();
              setIsOpen(false);
              console.log("All done?");
            }}
          >
            Replish stock
          </Button>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
