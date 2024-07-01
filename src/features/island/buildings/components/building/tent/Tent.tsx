import React, { useContext, useEffect, useState } from "react";

import tent from "assets/buildings/tent.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { Modal } from "components/ui/Modal";
import { TentModal } from "./TentModal";
import { NPC } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { BuildingName } from "features/game/types/buildings";
import { MachineState } from "features/game/lib/gameMachine";
import { PlacedItem } from "features/game/types/game";
import { OnChainBumpkin, loadBumpkins } from "lib/blockchain/BumpkinDetails";
import { wallet } from "lib/blockchain/wallet";

const selectBuildings = (state: MachineState) => state.context.state.buildings;

const compareBuildings = (
  prev: Partial<Record<BuildingName, PlacedItem[]>>,
  next: Partial<Record<BuildingName, PlacedItem[]>>,
) => {
  return prev.Tent?.length === next.Tent?.length;
};

export const Tent: React.FC<BuildingProps> = ({
  buildingId,
  isBuilt,
  onRemove,
}) => {
  const { gameService } = useContext(Context);

  const buildings = useSelector(gameService, selectBuildings, compareBuildings);

  const [showModal, setShowModal] = useState(false);

  const buildingIndex = buildings["Tent"]?.findIndex(
    (building) => building.id === buildingId,
  );

  const [walletBumpkins, setWalletBumpkins] = useState<OnChainBumpkin[]>([]);

  useEffect(() => {
    const load = async () => {
      const walletBumpkins = await loadBumpkins(
        wallet.web3Provider,
        wallet.myAccount as string,
      );

      setWalletBumpkins(walletBumpkins);
    };

    load();
  }, []);

  const bumpkin = buildingIndex !== undefined && walletBumpkins[buildingIndex];

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
      <BuildingImageWrapper
        name="Tent"
        onClick={handleClick}
        nonInteractible={!bumpkin}
      >
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
