import React, { useContext } from "react";
import { NPCPlaceable } from "./NPC";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import { PlaceableLocation } from "features/game/types/collectibles";
import { PlayerNPC } from "./PlayerNPC";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");

export const PlacedBumpkin: React.FC<{
  location?: PlaceableLocation;
}> = ({ location = "farm" }) => {
  const { gameService } = useContext(Context);
  const bumpkin = useSelector(gameService, _bumpkin);
  const isLandscaping = useSelector(gameService, _isLandscaping);

  if (!bumpkin) return null;

  if (!bumpkin.coordinates) {
    return <NPCPlaceable parts={bumpkin.equipped} isManuallyPlaced={true} />;
  }

  if (!isLandscaping) {
    return (
      <>
        <div style={{ position: "relative", top: "-24px" }}>
          <PlayerNPC parts={bumpkin.equipped} isManuallyPlaced={true} />
        </div>
      </>
    );
  }

  return (
    <MoveableComponent
      name="Bumpkin"
      id="main"
      index={0}
      x={bumpkin.coordinates.x}
      y={bumpkin.coordinates.y}
      location={location}
    >
      <NPCPlaceable parts={bumpkin.equipped} isManuallyPlaced={true} />
    </MoveableComponent>
  );
};
