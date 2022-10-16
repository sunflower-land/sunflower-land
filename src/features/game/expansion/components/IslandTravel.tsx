import React, { useEffect, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import boat from "assets/npcs/water_boat.png";
import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Tab } from "components/ui/Tab";
import { IslandList } from "./IslandList";
import { Bumpkin } from "features/game/types/game";
import { useScrollIntoView, Section } from "lib/utils/hooks/useScrollIntoView";

interface Props {
  bumpkin: Bumpkin | undefined;
  x: number;
  y: number;
}

export const IslandTravel = ({ bumpkin, x, y }: Props) => {
  const [openIslandList, setOpenIslandList] = useState(false);
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => scrollIntoView(Section.Boat), []);

  return (
    <>
      <MapPlacement x={x} y={y} width={40 * PIXEL_SCALE}>
        <img
          src={boat}
          id={Section.Boat}
          onClick={() => setOpenIslandList(true)}
          className="relative cursor-pointer hover:img-highlight"
          style={{
            width: `${40 * PIXEL_SCALE}px`,
            transform: "scaleX(-1)",
          }}
        />
      </MapPlacement>

      <Modal
        centered
        show={openIslandList}
        onHide={() => setOpenIslandList(false)}
      >
        <Panel className="pt-5 relative">
          <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
            <div className="flex">
              <Tab isActive>
                <img src={hammer} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Travel To</span>
              </Tab>
            </div>
            <img
              src={close}
              className="h-6 cursor-pointer mr-2 mb-1"
              onClick={() => setOpenIslandList(false)}
            />
          </div>
          <div
            style={{
              minHeight: "200px",
            }}
          >
            <IslandList bumpkin={bumpkin} />
          </div>
        </Panel>
      </Modal>
    </>
  );
};
