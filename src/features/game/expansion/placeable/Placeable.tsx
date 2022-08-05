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

const PLACEABLES: Record<string, Record<string, string>> = {
  bakery: { image: bakery },
};

export const Placeable: React.FC = () => {
  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);

  const child = gameService.state.children.editing as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { placeable } = machine.context;

  const [collisionDetected, setCollisionDetected] = useState(true);

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

        const hasCollision = detectCollision(gameService.state.context.state, {
          x,
          y,
          width: 3,
          height: 3,
        });

        if (collisionDetected !== hasCollision) {
          setCollisionDetected(hasCollision);
        }
      }}
      onStop={(e, data) => {
        // console.log("stopped");
        // console.log({ e });
        const x = Math.round(data.x / GRID_WIDTH_PX);
        const y = Math.round((data.y / GRID_WIDTH_PX) * -1);

        // console.log({ x, y });
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
          src={PLACEABLES[placeable].image}
          alt=""
        />
        <OuterPanel>
          <div className="flex items-stretch">
            <Button disabled={collisionDetected}>
              <img src={confirm} alt="confirm" />
            </Button>
            <Button>
              <img src={cancel} alt="cancel" />
            </Button>
          </div>
        </OuterPanel>
      </div>
    </Draggable>
  );
};
