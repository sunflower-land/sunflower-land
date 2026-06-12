import React, { useContext, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";

import { PIXEL_SCALE } from "features/game/lib/constants";
import type { BuildingProps } from "../Building";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { Modal } from "components/ui/Modal";
import { TentModal } from "./TentModal";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import type { BuildingName } from "features/game/types/buildings";
import type { MachineState } from "features/game/lib/gameMachine";
import type { PlacedItem } from "features/game/types/game";
import type { OnChainBumpkin } from "lib/blockchain/BumpkinDetails";
import { useVisiting } from "lib/utils/visitUtils";
import { useNavigate } from "react-router";
import { getHomeRoute } from "features/island/buildings/lib/getHomeRoute";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";

const selectBuildings = (state: MachineState) => state.context.state.buildings;

const compareBuildings = (
  prev: Partial<Record<BuildingName, PlacedItem[]>>,
  next: Partial<Record<BuildingName, PlacedItem[]>>,
) => {
  return prev.Tent?.length === next.Tent?.length;
};

export const Tent: React.FC<BuildingProps> = ({ buildingId, isBuilt }) => {
  const { gameService } = useContext(Context);

  const buildings = useSelector(gameService, selectBuildings, compareBuildings);
  const navigate = useNavigate();
  const { isVisiting } = useVisiting();

  const [showModal, setShowModal] = useState(false);

  const buildingIndex = buildings["Tent"]?.findIndex(
    (building) => building.id === buildingId,
  );

  const [walletBumpkins] = useState<OnChainBumpkin[]>([]);

  const bumpkin = buildingIndex !== undefined && walletBumpkins[buildingIndex];

  const handleClick = () => {
    if (isBuilt && bumpkin) {
      saveIslandScrollPosition();
      const { state, farmId } = gameService.getSnapshot().context;
      navigate(getHomeRoute({ game: state, isVisiting, farmId }));
      setShowModal(true);
    }
  };

  const placeOnRight = (buildingIndex ?? 0) % 2;

  return (
    <>
      <BuildingImageWrapper
        name="Tent"
        onClick={handleClick}
        nonInteractible={!bumpkin}
      >
        <img
          src={SUNNYSIDE.building.tent}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 46}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
        {isBuilt && bumpkin && (
          <div
            className={classNames("absolute", { "-scale-x-100": placeOnRight })}
            style={{
              top: `${PIXEL_SCALE * 9}px`,
              ...(!placeOnRight ? { left: `${PIXEL_SCALE * 5}px` } : {}),
              ...(placeOnRight ? { right: `${PIXEL_SCALE * 5}px` } : {}),
            }}
          >
            <NPCPlaceable
              parts={interpretTokenUri(bumpkin.tokenURI).equipped}
            />
          </div>
        )}
      </BuildingImageWrapper>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <TentModal
          defaultSelectedIndex={buildingIndex}
          onClose={() => setShowModal(false)}
          bumpkins={walletBumpkins}
        />
      </Modal>
    </>
  );
};
