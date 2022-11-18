import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import boat from "assets/npcs/island_boat_pirate.png";
import close from "assets/icons/close.png";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Tab } from "components/ui/Tab";
import { IslandList } from "./IslandList";
import { Bumpkin } from "features/game/types/game";

interface Props {
  bumpkin: Bumpkin | undefined;
  isVisiting?: boolean;
  isTravelAllowed?: boolean;
  onTravelDialogOpened?: () => void;
  x: number;
  y: number;
}

export const IslandTravel = ({
  bumpkin,
  x,
  y,
  isVisiting = false,
  isTravelAllowed = true,
  onTravelDialogOpened,
}: Props) => {
  const [openIslandList, setOpenIslandList] = useState(false);

  return (
    <>
      <MapPlacement x={x} y={y}>
        <div
          style={{
            width: `${68 * PIXEL_SCALE}px`,
          }}
        >
          <img
            src={boat}
            onClick={() => setOpenIslandList(true)}
            className="relative cursor-pointer hover:img-highlight"
            style={{
              width: `${68 * PIXEL_SCALE}px`,
            }}
          />
        </div>
      </MapPlacement>

      <Modal
        centered
        show={openIslandList}
        onHide={() => setOpenIslandList(false)}
        onShow={onTravelDialogOpened}
      >
        <Panel
          className="relative"
          hasTabs
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Sun Spots",
            pants: "Brown Suspenders",
            shirt: "SFL T-Shirt",
            tool: "Sword",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <div
            className="absolute flex"
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          >
            <Tab isActive>
              <img src={boat} className="h-5 mr-2" />
              <span className="text-sm">Travel To</span>
            </Tab>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={() => setOpenIslandList(false)}
              style={{
                top: `${PIXEL_SCALE * 1}px`,
                right: `${PIXEL_SCALE * 1}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          {isTravelAllowed && (
            <IslandList bumpkin={bumpkin} showVisitList={isVisiting} />
          )}
          {!isTravelAllowed && <span className="loading">Loading</span>}
        </Panel>
      </Modal>
    </>
  );
};
