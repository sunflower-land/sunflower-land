import React from "react";

import { useGame } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "../collectibles/MovableComponent";
import { Bud as _Bud } from "../collectibles/components/Bud";
import { MachineState } from "features/game/expansion/placeable/landscapingMachine";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";

export interface BudProps {
  id: string;
  x: number;
  y: number;
}

const isLandscaping = (state: MachineState) => state.matches("landscaping");
const _buds = (state: GameMachineState) => state.context.state.buds ?? {};

const BudComponent: React.FC<BudProps> = ({ id, x, y }) => {
  const { gameService } = useGame();
  const buds = useSelector(gameService, _buds);
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
