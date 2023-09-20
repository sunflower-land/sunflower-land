import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "../collectibles/MovableComponent";
import { Bud as _Bud } from "../collectibles/components/Bud";
import { MachineState } from "../buildings/lib/craftingMachine";

export interface BudProps {
  id: string;
  x: number;
  y: number;
}

const isLandscaping = (state: MachineState) => state.matches("landscaping");

const BudComponent: React.FC<BudProps> = ({ id, x, y }) => {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, isLandscaping);

  if (landscaping)
    return (
      <MoveableComponent name="Bud" id={String(id)} x={x} y={y}>
        <_Bud id={String(id)} />
      </MoveableComponent>
    );

  return <_Bud id={String(id)} />;
};

export const Bud = React.memo(BudComponent);
