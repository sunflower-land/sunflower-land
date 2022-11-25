import React, { useState } from "react";

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
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Prop {
  name: BuildingName;
  building: IBuilding;
  onRemove?: () => void;
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
};

const InProgressBuilding: React.FC<Prop> = ({ building, name, onRemove }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const totalSeconds = (building.readyAt - building.createdAt) / 1000;
  const secondsLeft = Math.floor((building.readyAt - Date.now()) / 1000);

  return (
    <>
      <div
        className="w-full h-full opacity-50"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <BuildingPlaced buildingId={building.id} onRemove={onRemove} />
      </div>
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

export const Building: React.FC<Prop> = ({ name, building }) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const inProgress = building.readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  const shortcuts = getShortcuts();
  const hasRustyShovelSelected = shortcuts[0] === "Rusty Shovel";

  const handleRemove = () => {
    setShowRemoveModal(true);
  };

  const handleClose = () => {
    setShowRemoveModal(false);
  };

  /**
   * If a player has the Rusty Shovel selected then the onClick action of the building will open the RemoveModal
   * Otherwise the onClick with be the regular onClick located inside the individual buildings component
   */

  return (
    <>
      {inProgress ? (
        <InProgressBuilding
          building={building}
          name={name}
          onRemove={hasRustyShovelSelected ? handleRemove : undefined}
        />
      ) : (
        <BuildingPlaced
          buildingId={building.id}
          craftingState={building.crafting}
          onRemove={hasRustyShovelSelected ? handleRemove : undefined}
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
