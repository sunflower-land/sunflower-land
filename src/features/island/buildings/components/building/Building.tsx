import React, { useContext, useState } from "react";

import { BuildingName } from "features/game/types/buildings";
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
import { SmoothieShack } from "./smoothieShack/SmoothieShack";
import { Warehouse } from "./warehouse/Warehouse";
import { Toolshed } from "./toolshed/Toolshed";
import { CookableName } from "features/game/types/consumables";
import { TownCenter } from "./townCenter/TownCenter";
import { useSelector } from "@xstate/react";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";

interface Prop {
  name: BuildingName;
  id: string;
  readyAt: number;
  createdAt: number;
  craftingItemName?: CookableName;
  craftingReadyAt?: number;
  isRustyShovelSelected: boolean;
  showTimers: boolean;
  coordinates?: Coordinates;
}

export interface BuildingProps {
  buildingId: string;
  craftingItemName?: CookableName;
  craftingReadyAt?: number;
  isBuilt?: boolean;
  onRemove?: () => void;
}

export const BUILDING_COMPONENTS: Record<
  BuildingName,
  React.FC<BuildingProps>
> = {
  "Fire Pit": ({
    buildingId,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
    >
      <FirePit buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  Workbench: WorkBench,
  Bakery: ({
    buildingId,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
    >
      <Bakery buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  Market: Market,
  Tent: Tent,
  "Town Center": TownCenter,
  "Water Well": WaterWell,
  Warehouse: Warehouse,
  Toolshed: Toolshed,
  "Hen House": ChickenHouse,
  Kitchen: ({
    buildingId,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
    >
      <Kitchen buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  Deli: ({
    buildingId,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
    >
      <Deli buildingId={buildingId} isBuilt={isBuilt} onRemove={onRemove} />
    </WithCraftingMachine>
  ),
  "Smoothie Shack": ({
    buildingId,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    onRemove,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
    >
      <SmoothieShack
        buildingId={buildingId}
        isBuilt={isBuilt}
        onRemove={onRemove}
      />
    </WithCraftingMachine>
  ),
};

const InProgressBuilding: React.FC<Prop> = ({
  name,
  id,
  readyAt,
  createdAt,
  showTimers,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const totalSeconds = (readyAt - createdAt) / 1000;
  const secondsLeft = Math.floor((readyAt - Date.now()) / 1000);

  return (
    <>
      <div
        className="w-full h-full"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="w-full h-full pointer-events-none opacity-50">
          <BuildingPlaced buildingId={id} />
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
  id,
  readyAt,
  createdAt,
  craftingItemName,
  craftingReadyAt,
  isRustyShovelSelected,
  showTimers,
}) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const inProgress = readyAt > Date.now();

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
          key={id}
          name={name}
          id={id}
          readyAt={readyAt}
          createdAt={createdAt}
          isRustyShovelSelected={false}
          showTimers={showTimers}
        />
      ) : (
        <BuildingPlaced
          buildingId={id}
          craftingItemName={craftingItemName}
          craftingReadyAt={craftingReadyAt}
          onRemove={isRustyShovelSelected ? handleRemove : undefined}
          isBuilt
        />
      )}
      <Modal show={showRemoveModal} centered onHide={handleClose}>
        {showRemoveModal && (
          <RemovePlaceableModal
            type="building"
            name={name}
            placeableId={id}
            onClose={handleClose}
          />
        )}
      </Modal>
    </>
  );
};

const isLandscaping = (state: MachineState) => state.matches("landscaping");

const MemorizedBuildingComponent = React.memo(BuildingComponent);

export const Building: React.FC<Prop> = (props) => {
  const { gameService } = useContext(Context);

  const landscaping = useSelector(gameService, isLandscaping);

  if (landscaping) {
    return (
      <MoveableComponent
        id={props.id}
        x={props.coordinates?.x}
        y={props.coordinates?.y}
        {...(props as any)}
      >
        <MemorizedBuildingComponent {...props} />
      </MoveableComponent>
    );
  }

  return <MemorizedBuildingComponent {...props} />;
};
