import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ClutterName, FARM_PEST } from "features/game/types/clutter";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import sparkle from "public/world/sparkle2.gif";
import { isHelpComplete } from "features/game/types/monuments";
import { FarmHelped } from "../hud/components/FarmHelped";
import { GameState } from "features/game/types/game";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

interface Props {
  id: string;
  type: ClutterName;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _hasHelpedPlayerToday = (state: MachineState) =>
  state.context.hasHelpedPlayerToday;

export const Clutter: React.FC<{
  clutter: GameState["socialFarming"]["clutter"];
}> = ({ clutter }) => {
  const { gameService } = useContext(Context);
  const [showHelped, setShowHelped] = useState(false);

  const hasHelpedPlayerToday = useSelector(gameService, _hasHelpedPlayerToday);

  if (hasHelpedPlayerToday) {
    return null;
  }

  return (
    <>
      <Modal show={showHelped}>
        <CloseButtonPanel
          bumpkinParts={gameService.state.context.state.bumpkin.equipped}
        >
          <FarmHelped onClose={() => setShowHelped(false)} />
        </CloseButtonPanel>
      </Modal>

      {Object.keys(clutter?.locations ?? {}).flatMap((id) => {
        const { x, y } = clutter!.locations[id];
        const isPest = clutter!.locations[id].type in FARM_PEST;

        return (
          <MapPlacement
            key={`clutter-${id}`}
            x={x}
            y={y}
            height={1}
            width={1}
            z={isPest ? 999999 : 99999999}
            enableOnVisitClick
          >
            <ClutterItem
              onComplete={() => setShowHelped(true)}
              key={`clutter-${id}`}
              id={id}
              type={clutter!.locations[id].type}
            />
          </MapPlacement>
        );
      })}
    </>
  );
};

const _totalHelpedToday = (state: MachineState) =>
  state.context.totalHelpedToday;

export const ClutterItem: React.FC<
  Props & {
    onComplete: () => void;
  }
> = ({ id, type, onComplete }) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const totalHelpedToday = useSelector(gameService, _totalHelpedToday);

  // V2 - local only event
  const handleHelpFarm = async () => {
    gameService.send({
      type: "garbage.collected",
      id,
      visitedFarmId: farmId,
      totalHelpedToday,
    });

    if (
      isHelpComplete({
        game: gameService.getSnapshot().context.state,
      })
    ) {
      onComplete();
    }
  };

  return (
    <>
      <div className="relative w-full h-full">
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center"
          onClick={handleHelpFarm}
        >
          <img
            src={ITEM_DETAILS[type].image}
            alt={`clutter-${type}`}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />

          <img
            src={sparkle}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 6}px`,
              top: `${PIXEL_SCALE * 6}px`,
              left: `${PIXEL_SCALE * 7}px`,
            }}
          />
        </div>
      </div>
    </>
  );
};
