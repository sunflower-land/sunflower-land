import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineInterpreter } from "./editingMachine";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import bakery from "assets/buildings/bakery_TEST2.gif";
import confirm from "assets/icons/confirm.png";
import cancel from "assets/icons/cancel.png";
import Draggable from "react-draggable";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { detectCollision } from "./lib/collisionDetection";
import classNames from "classnames";
import { Coordinates } from "../components/MapPlacement";

interface Placeable {
  image: string;
  height: number;
  width: number;
}
const PLACEABLES: Record<string, Placeable> = {
  bakery: { image: bakery, height: 3, width: 3 },
};

export const Placeable: React.FC = () => {
  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);

  const child = gameService.state.children.editing as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { placeable } = machine.context;
  const { image, width, height } = PLACEABLES[placeable];

  const [collisionDetected, setCollisionDetected] = useState(true);
  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });

  const handleDrag = ({ x, y }: Coordinates) => {
    setCoordinates({ x, y });

    const hasCollision = detectCollision(gameService.state.context.state, {
      x,
      y,
      width,
      height,
    });

    if (collisionDetected !== hasCollision) {
      setCollisionDetected(hasCollision);
    }
  };

  const handleConfirmPlacement = () => {
    send({ type: "PLACE", coordinates });
  };

  const handleCancelPlacement = () => {
    send("CANCEL");
  };

  if (machine.matches("placed")) {
    return (
      <div
        className="absolute"
        style={{
          left: coordinates.x * GRID_WIDTH_PX,
          top: -coordinates.y * GRID_WIDTH_PX,
          height: 48 * PIXEL_SCALE,
          width: 48 * PIXEL_SCALE,
        }}
      >
        <img
          draggable="false"
          className="bulge h-full w-full"
          src={image}
          alt=""
        />
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
      onStart={() => {
        send("DRAG");
      }}
      onDrag={(_, data) => {
        const x = Math.round(data.x / GRID_WIDTH_PX);
        const y = Math.round((data.y / GRID_WIDTH_PX) * -1);

        handleDrag({ x, y });
      }}
      onStop={(_, data) => {
        const x = Math.round(data.x / GRID_WIDTH_PX);
        const y = Math.round((data.y / GRID_WIDTH_PX) * -1);

        handleDrag({ x, y });

        send("DROP");
      }}
    >
      <div
        ref={nodeRef}
        data-prevent-drag-scroll
        className={classNames("flex flex-col items-center", {
          "cursor-grab": !machine.matches("dragging"),
          "cursor-grabbing": machine.matches("dragging"),
        })}
      >
        <img
          draggable="false"
          className="img-highlight"
          style={{ height: 48 * PIXEL_SCALE, width: 48 * PIXEL_SCALE }}
          src={image}
          alt=""
        />
        <OuterPanel>
          <div className="flex items-stretch">
            <Button
              disabled={collisionDetected}
              onClick={handleConfirmPlacement}
            >
              <img src={confirm} alt="confirm" />
            </Button>
            <Button onClick={handleCancelPlacement}>
              <img src={cancel} alt="cancel" />
            </Button>
          </div>
        </OuterPanel>
      </div>
    </Draggable>
  );
};
