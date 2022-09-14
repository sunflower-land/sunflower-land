import React, { useContext, useState } from "react";
import { useInterpret, useSelector } from "@xstate/react";
import { BuildingProp } from "./Building";
import { Context } from "features/game/GameProvider";
import {
  CraftingContext,
  craftingMachine,
  MachineInterpreter,
  MachineState,
} from "../../lib/craftingMachine";
import { FirePitProps } from "./FirePit";
import { CraftingTimerModal } from "../ui/CraftingTimerModal";

type Props = Pick<BuildingProp, "crafting" | "id"> & {
  children: React.ReactElement<FirePitProps>;
};

const isIdle = (state: MachineState) => state.matches("idle");
const isCrafting = (state: MachineState) => state.matches("crafting");
const isReady = (state: MachineState) => state.matches("ready");
const itemName = (state: MachineState) => state.context.name;

export const WithCraftingMachine = ({
  crafting: craftingState,
  id,
  children,
}: Props) => {
  const [showTimer, setShowTimer] = useState(false);
  const { gameService } = useContext(Context);
  const craftingContext: Partial<CraftingContext> | undefined = {
    gameService,
    buildingId: id,
    ...(craftingState && {
      name: craftingState.name,
      readyAt: craftingState.readyAt,
    }),
  };

  const craftingService = useInterpret(craftingMachine, {
    context: craftingContext,
    devTools: true,
  }) as unknown as MachineInterpreter;

  const idle = useSelector(craftingService, isIdle);
  const crafting = useSelector(craftingService, isCrafting);
  const ready = useSelector(craftingService, isReady);
  const name = useSelector(craftingService, itemName);

  const clonedChildren = React.cloneElement(children, {
    idle,
    crafting,
    ready,
    name,
    id,
    craftingService,
    handleShowCraftingTimer: () => {
      setShowTimer(true);
    },
  });

  return (
    <>
      {clonedChildren}
      <CraftingTimerModal
        show={showTimer}
        service={craftingService}
        onClose={() => setShowTimer(false)}
      />
    </>
  );
};
