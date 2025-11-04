import { useSelector } from "@xstate/react";
import { MachineState } from "features/world/mmoMachine";
import React, { useContext } from "react";
import { MoveableComponent } from "../collectibles/MovableComponent";
import { Context } from "features/game/GameProvider";
import { PetNFT as _PetNFT } from "../collectibles/components/petNFT/PetNFT";

export interface PetNFTProps {
  id: string;
  x: number;
  y: number;
}

const isLandscaping = (state: MachineState) => state.matches("landscaping");

const PetNFTComponent: React.FC<PetNFTProps> = ({ id, x, y }) => {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, isLandscaping);

  if (landscaping)
    return (
      <MoveableComponent name="Pet" id={String(id)} index={0} x={x} y={y}>
        <_PetNFT id={String(id)} />
      </MoveableComponent>
    );

  return <_PetNFT id={String(id)} />;
};

export const PetNFT = React.memo(PetNFTComponent);
