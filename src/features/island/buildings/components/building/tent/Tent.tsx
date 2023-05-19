import React, { useContext, useState } from "react";

import tent from "assets/buildings/tent.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { Modal } from "react-bootstrap";
import { TentModal } from "./TentModal";
import { NPC } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";

export const Tent: React.FC<BuildingProps> = ({
  buildingId,
  isBuilt,
  onRemove,
}) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state, bumpkins },
    },
  ] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);

  const buildingIndex = state.buildings["Tent"]?.findIndex(
    (building) => building.id === buildingId
  );
  const placedIndex =
    buildingIndex !== undefined ? buildingIndex + 1 : undefined;

  const bumpkin = placedIndex !== undefined && bumpkins[placedIndex];

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt && bumpkin) {
      setShowModal(true);
    }
  };

  const placeOnRight = (buildingIndex ?? 0) % 2;

  return (
    <>
      <BuildingImageWrapper onClick={handleClick} nonInteractible={!bumpkin}>
        <img
          src={tent}
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
            <NPC parts={interpretTokenUri(bumpkin.tokenURI).equipped} />
          </div>
        )}
      </BuildingImageWrapper>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <TentModal
          defaultSelectedIndex={placedIndex}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};
