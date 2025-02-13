import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const _wellLevel = (state: MachineState) => state.context.state.waterWell.level;

export const UpgradeWaterWell: React.FC<Props> = ({ open, onClose }) => {
  const { gameService } = useGame();
  const wellLevel = useSelector(gameService, _wellLevel);
  const handleUpgradeWaterWell = () => {
    gameService.send("building.upgraded", {
      buildingType: "Water Well",
    });
  };

  return (
    <Modal show={open} onHide={onClose}>
      <Panel>
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            {`Upgrade your water well to increase your water production.`}
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
