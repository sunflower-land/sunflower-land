import React, { useRef, useState } from "react";
import classNames from "classnames";

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

interface Prop {
  name: BuildingName;
  building: IBuilding;
  id: string;
}

export interface BuildingProps {
  buildingId: string;
  craftingState?: BuildingProduct;
}

export const BUILDING_COMPONENTS: Record<
  BuildingName,
  React.FC<BuildingProps>
> = {
  "Fire Pit": ({ buildingId, craftingState }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <FirePit buildingId={buildingId} />
    </WithCraftingMachine>
  ),
  Workbench: WorkBench,
  Bakery: ({ buildingId, craftingState }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <Bakery buildingId={buildingId} />
    </WithCraftingMachine>
  ),
  Market: Market,
  Tent: Tent,
  "Water Well": WaterWell,
  "Hen House": ChickenHouse,
  Kitchen: ({ buildingId, craftingState }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <Kitchen buildingId={buildingId} />
    </WithCraftingMachine>
  ),
  Deli: ({ buildingId, craftingState }: BuildingProps) => (
    <WithCraftingMachine buildingId={buildingId} craftingState={craftingState}>
      <Deli buildingId={buildingId} />
    </WithCraftingMachine>
  ),
};

const InProgressBuilding: React.FC<Prop & { onClick: () => void }> = ({
  onClick,
  building,
  id: buildingId,
  name,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const shortcuts = getShortcuts();
  const hasRustyShovelSelected = shortcuts[0] === "Rusty Shovel";

  const totalSeconds = (building.readyAt - building.createdAt) / 1000;
  const secondsLeft = Math.floor((building.readyAt - Date.now()) / 1000);

  return (
    <>
      <div
        className="w-full h-full cursor-pointer"
        ref={overlayRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={hasRustyShovelSelected ? onClick : undefined}
      >
        <div className="w-full h-full pointer-events-none opacity-50">
          <BuildingPlaced buildingId={buildingId} />
        </div>
        <div className="absolute bottom-0 w-8 left-1/2 -translate-x-1/2">
          <Bar
            percentage={(1 - secondsLeft / totalSeconds) * 100}
            type="progress"
          />
        </div>
      </div>
      {overlayRef.current && (
        <TimeLeftPanel
          text="Ready in:"
          timeLeft={secondsLeft}
          showTimeLeft={showTooltip}
        />
      )}
    </>
  );
};

export const Building: React.FC<Prop> = ({
  name,
  building,
  id: buildingId,
}) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const inProgress = building.readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  const shortcuts = getShortcuts();
  const hasRustyShovelSelected = shortcuts[0] === "Rusty Shovel";

  const handleOnClick = () => {
    setShowRemoveModal(true);
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
          id={buildingId}
          name={name}
          onClick={handleOnClick}
        />
      ) : (
        <div
          className={classNames({
            "hover:img-highlight cursor-pointer": hasRustyShovelSelected,
          })}
          onClick={hasRustyShovelSelected ? handleOnClick : undefined}
        >
          <div
            className={classNames({
              "pointer-events-none": hasRustyShovelSelected,
            })}
          >
            <BuildingPlaced
              buildingId={buildingId}
              craftingState={building.crafting}
            />
          </div>
        </div>
      )}
      <Modal
        show={showRemoveModal}
        centered
        onHide={() => setShowRemoveModal(false)}
      >
        {showRemoveModal && (
          <RemovePlaceableModal
            type="building"
            name={name}
            placeableId={buildingId}
            onClose={() => setShowRemoveModal(false)}
          />
        )}
      </Modal>
    </>
  );
};
