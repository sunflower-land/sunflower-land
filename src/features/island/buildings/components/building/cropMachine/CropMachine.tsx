import React, { useContext, useState } from "react";

import { CropMachineModal } from "./CropMachineModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useInterpret, useSelector } from "@xstate/react";
import {
  Context as CropMachineContext,
  MachineInterpreter,
  cropStateMachine,
  findGrowingCropPackIndex,
  hasReadyCrops,
  CropMachineState,
} from "./lib/cropMachine";
import { Planting } from "./components/planting";
import { Sprouting } from "./components/sprouting";
import { Maturing } from "./components/maturing";
import { Harvesting } from "./components/harvesting";
import { CropMachineBuilding } from "features/game/types/game";

import readyCrops from "assets/cropMachine/readyCrops.webp";
import shadow from "assets/cropMachine/shadow.webp";

const _cropMachine = (id: string) => (state: MachineState) => {
  const machines = state.context.state.buildings["Crop Machine"];

  if (!machines) return null;

  return machines.find((machine) => machine.id === id);
};

const _growingCropPackIndex = (state: CropMachineState) =>
  state.context.growingCropPackIndex;
const _growingCropPackStage = (state: CropMachineState) =>
  state.context.growingCropPackStage;
const _canHarvest = (state: CropMachineState) => state.context.canHarvest;
const _running = (state: CropMachineState) => state.value === "running";
const _idle = (state: CropMachineState) => state.value === "idle";
const _paused = (state: CropMachineState) => state.value === "paused";

interface Props {
  id: string;
}

export const CropMachine: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const cropMachine = useSelector(
    gameService,
    _cropMachine(id)
  ) as CropMachineBuilding;
  const queue = cropMachine?.queue ?? [];

  const cropMachineContext: CropMachineContext = {
    growingCropPackIndex: findGrowingCropPackIndex(queue),

    queue,
    unallocatedOilTime: cropMachine.unallocatedOilTime ?? 0,
    canHarvest: hasReadyCrops(queue),
  };

  const cropMachineService = useInterpret(cropStateMachine, {
    context: cropMachineContext,
    devTools: true,
  }) as unknown as MachineInterpreter;

  const growingCropPackIndex = useSelector(
    cropMachineService,
    _growingCropPackIndex
  );
  const growingCropPackStage = useSelector(
    cropMachineService,
    _growingCropPackStage
  );
  const canHarvest = useSelector(cropMachineService, _canHarvest);
  const growingCropPack = growingCropPackIndex
    ? queue[growingCropPackIndex]
    : undefined;
  const running = useSelector(cropMachineService, _running);
  const idle = useSelector(cropMachineService, _idle);
  const paused = useSelector(cropMachineService, _paused);

  const handleClick = () => {
    setShowModal(true);
  };

  // Crop machine states

  const image = ITEM_DETAILS["Crop Machine"].image;

  return (
    <>
      <BuildingImageWrapper
        name="Crop Machine"
        onClick={handleClick}
        ready={canHarvest}
      >
        <div
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 80}px`,
          }}
        >
          {idle && (
            <img
              src={image}
              className="w-full absolute"
              style={{
                width: `${PIXEL_SCALE * 80}px`,
                bottom: `${PIXEL_SCALE * 0}px`,
              }}
            />
          )}
          {(running || paused) && (
            <>
              <img
                src={shadow}
                className="absolute bottom-0 right-1"
                style={{ width: `${PIXEL_SCALE * 80}px` }}
              />
              <div id="cropMachine" className="border-1 border-black">
                {growingCropPackStage === "planting" && (
                  <Planting paused={paused} />
                )}
                {growingCropPackStage === "sprouting" && (
                  <Sprouting paused={paused} />
                )}
                {growingCropPackStage === "maturing" && (
                  <Maturing paused={paused} />
                )}
                {growingCropPackStage === "harvesting" && (
                  <Harvesting paused={paused} />
                )}
              </div>
            </>
          )}

          {canHarvest && (
            <img
              src={readyCrops}
              className="absolute bottom-2"
              style={{
                height: `${PIXEL_SCALE * 59}px`,
                width: `${PIXEL_SCALE * 15}px`,
              }}
            />
          )}
        </div>
      </BuildingImageWrapper>

      <CropMachineModal
        queue={queue}
        running={running}
        idle={idle}
        paused={paused}
        growingCropPackIndex={growingCropPackIndex}
        growingCropPackStage={growingCropPackStage}
        onClose={() => setShowModal(false)}
        show={true}
      />
    </>
  );
};
