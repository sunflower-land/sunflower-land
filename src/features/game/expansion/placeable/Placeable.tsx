import React, { useContext, useRef } from "react";
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

const PLACEABLES: Record<string, Record<string, string>> = {
  bakery: { image: bakery },
};

export const Placeable: React.FC = () => {
  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);

  const child = gameService.state.children.editing as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { placeable } = machine.context;

  return (
    <Draggable
      nodeRef={nodeRef}
      grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
      onDrag={(e, data) => {
        console.log("draggin");
        console.log({ e });
        console.log({ data });
      }}
      onStop={(e, data) => {
        console.log("stopped");
        console.log({ e });
        const x = Math.round(data.x / GRID_WIDTH_PX);
        const y = Math.round((data.y / GRID_WIDTH_PX) * -1);

        console.log({ x, y });
      }}
    >
      <div
        ref={nodeRef}
        data-prevent-drag-scroll
        className="flex flex-col items-center"
      >
        <img
          draggable={false}
          className="img-highlight"
          style={{ height: 48 * PIXEL_SCALE, width: 48 * PIXEL_SCALE }}
          src={PLACEABLES[placeable].image}
          alt=""
        />
        <OuterPanel>
          <div className="flex items-stretch">
            <Button>
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
