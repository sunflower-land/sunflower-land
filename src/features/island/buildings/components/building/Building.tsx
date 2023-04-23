import React, { useContext, useState } from "react";

import { BuildingName } from "features/game/types/buildings";
import { BuildingProduct } from "features/game/types/game";
import { Bar } from "components/ui/ProgressBar";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Modal } from "react-bootstrap";
import { RemovePlaceableModal } from "features/game/expansion/placeable/RemovePlaceableModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { BUILDING_COMPONENTS } from "./BuildingComponents";

interface Prop {
  name: BuildingName;
  id: string;
  readyAt: number;
  createdAt: number;
  crafting?: BuildingProduct;
  isRustyShovelSelected: boolean;
  showTimers: boolean;
  coordinates: Coordinates;
}

export interface BuildingProps {
  buildingId: string;
  craftingState?: BuildingProduct;
  isBuilt?: boolean;
  onRemove?: () => void;
}

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
  crafting,
  isRustyShovelSelected,
  showTimers,
  coordinates,
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
          coordinates={coordinates}
        />
      ) : (
        <BuildingPlaced
          buildingId={id}
          craftingState={crafting}
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

export const Building: React.FC<Prop> = (props) => {
  const { gameService } = useContext(Context);

  const landscaping = useSelector(gameService, isLandscaping);

  if (landscaping) {
    // In Landscaping mode, use readonly building
    return (
      <MoveableComponent
        id={props.id}
        name={props.name}
        coordinates={props.coordinates}
      >
        <BuildingComponent {...props} />
      </MoveableComponent>
    );
  }

  return <BuildingComponent {...props} />;
};
