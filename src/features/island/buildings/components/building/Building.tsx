import React, { useContext, useState } from "react";

import { BuildingName } from "features/game/types/buildings";
import {
  BuildingProduct,
  PlacedItem as IBuilding,
} from "features/game/types/game";
import { FirePit } from "./firePit/FirePit";
import { Bar } from "components/ui/ProgressBar";
import { WithCraftingMachine } from "./WithCraftingMachine";
import { Market } from "./market/Market";
import { WorkBench } from "./workBench/WorkBench";
import { Tent } from "./tent/Tent";
import { WaterWell } from "./waterWell/WaterWell";
import { ChickenHouse } from "./henHouse/HenHouse";
import { Bakery } from "./bakery/Bakery";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Kitchen } from "./kitchen/Kitchen";
import { Deli } from "./deli/Deli";
import { Modal } from "react-bootstrap";
import { RemovePlaceableModal } from "features/game/expansion/placeable/RemovePlaceableModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { SmoothieShack } from "./smoothieShack/SmoothieShack";
import { Warehouse } from "./warehouse/Warehouse";
import { Toolshed } from "./toolshed/Toolshed";

interface Prop {
  name: BuildingName;
  building: IBuilding;
  isRustyShovelSelected: boolean;
}

export interface BuildingProps {
  buildingId: string;
  craftingState?: BuildingProduct;
  isBuilt?: boolean;
  onRemove?: () => void;
}

export const BUILDING_COMPONENTS: Record<
  BuildingName,
  React.FC<BuildingProps>
> = {
  "Fire Pit": ({
    buildingId,
    craftingState,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <FirePit buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  Workbench: WorkBench,
  Bakery: ({ buildingId, craftingState, isBuilt, onRemove }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <Bakery buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  Market: Market,
  Tent: Tent,
  "Water Well": WaterWell,
  Warehouse: Warehouse,
  Toolshed: Toolshed,
  "Hen House": ChickenHouse,
  Kitchen: ({
    buildingId,
    craftingState,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <Kitchen buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  Deli: ({ buildingId, craftingState, isBuilt, onRemove }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <Deli buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  "Smoothie Shack": ({
    buildingId,
    craftingState,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <SmoothieShack
        buildingId={buildingId}
        isBuilt={isBuilt}
        onRemove={onRemove}
      />
    </WithCraftingMachine>
  ),
};

const InProgressBuilding: React.FC<Prop> = ({ building, name }) => {
  const { showTimers } = useContext(Context);
  const [showTooltip, setShowTooltip] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const totalSeconds = (building.readyAt - building.createdAt) / 1000;
  const secondsLeft = Math.floor((building.readyAt - Date.now()) / 1000);

  return (
    <>
      <div
        className="w-full h-full"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="w-full h-full pointer-events-none opacity-50">
          <BuildingPlaced buildingId={building.id} />
        </div>
        {showTimers && (
          <div
            className="absolute bottom-0 left-1/2"
            style={{
              marginLeft: `${PIXEL_SCALE * -8}px`,
            }}
          >
            <Bar
              percentage={(1 - secondsLeft / totalSeconds) * 100}
              type="progress"
            />
          </div>
        )}
      </div>
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -20}px`,
        }}
      >
        <TimeLeftPanel
          text="Ready in:"
          timeLeft={secondsLeft}
          showTimeLeft={showTooltip}
        />
      </div>
    </>
  );
};

const BuildingComponent: React.FC<Prop> = ({
  name,
  building,
  isRustyShovelSelected: isRustyShovelSelected,
}) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const inProgress = building.readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  const handleRemove = () => {
    setShowRemoveModal(true);
  };

  const handleClose = () => {
    setShowRemoveModal(false);
  };

  /**
   * If a player has the Rusty Shovel selected then the onClick action of the building will open the RemovePlaceableModal
   * Otherwise the onClick with be the regular onClick located inside the individual buildings component
   */
  return (
    <>
      {inProgress ? (
        <InProgressBuilding
          building={building}
          name={name}
          isRustyShovelSelected={false}
        />
      ) : (
        <BuildingPlaced
          buildingId={building.id}
          craftingState={building.crafting}
          onRemove={isRustyShovelSelected ? handleRemove : undefined}
          isBuilt
        />
      )}
      <Modal show={showRemoveModal} centered onHide={handleClose}>
        {showRemoveModal && (
          <RemovePlaceableModal
            type="building"
            name={name}
            placeableId={building.id}
            onClose={handleClose}
          />
        )}
      </Modal>
    </>
  );
};

export const Building = React.memo(BuildingComponent);
