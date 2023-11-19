import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
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
  const [gameState] = useActor(gameService);
  const buds = gameState.context.state.buds ?? {};
  const landscaping = useSelector(gameService, isLandscaping);
  const bud = buds[Number(id)];

  if (landscaping)
    return (
      <MoveableComponent name="Bud" id={String(id)} index={0} x={x} y={y}>
        <_Bud id={String(id)} type={bud.type} />
      </MoveableComponent>
    );

  return <_Bud id={String(id)} type={bud.type} />;
};

export const Bud = React.memo(BudComponent);
