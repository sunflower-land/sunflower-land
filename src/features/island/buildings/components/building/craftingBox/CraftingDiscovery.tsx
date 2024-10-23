import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { useContext, useState } from "react";

import page from "assets/decorations/page.png";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

const CRAFTING_DISCOVERY = {
  "Basic Hair": 7,
};

const _craftingBoxAcknowledgements = (state: MachineState) =>
  state.context.state.craftingBox.acknowledgements;

export const CraftingDiscovery: React.FC = () => {
  const { gameService } = useContext(Context);

  const experience = useSelector(
    gameService,
    (state) => state.context.state.bumpkin.experience,
  );
  const bumpkinLevel = getBumpkinLevel(experience);

  const hasDiscoveries = Object.entries(CRAFTING_DISCOVERY).some(
    ([name, level]) => bumpkinLevel >= level,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {hasDiscoveries && (
        <div
          className="absolute z-20"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            height: `${PIXEL_SCALE * 16}px`,
            left: `${GRID_WIDTH_PX * 1.5}px`,
            top: `${GRID_WIDTH_PX * 1}px`,
          }}
        >
          <img
            id="crafting-discovery"
            className="cursor-pointer "
            onClick={() => setIsModalOpen(true)}
            src={page}
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              height: `${PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
      )}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <InnerPanel>
          <div>CraftingDiscovery</div>
          <div>{JSON.stringify(hasDiscoveries)}</div>
        </InnerPanel>
      </Modal>
    </>
  );
};
