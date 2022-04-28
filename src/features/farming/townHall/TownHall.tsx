import React from "react";
import { Modal } from "react-bootstrap";

import townHall from "assets/buildings/townhall.png";
import heart from "assets/icons/heart.png";
import logo from "assets/brand/logo.png";
import bumpkin from "assets/npcs/bumpkin.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { Panel } from "components/ui/Panel";

export const TownHall: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  const open = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 5}px`,
        left: `${GRID_WIDTH_PX * 8.8}px`,
        top: `${GRID_WIDTH_PX * -4.6}px`,
      }}
    >
      <div className={"cursor-pointer hover:img-highlight"}>
        <img src={townHall} alt="market" onClick={open} className="w-full" />
        <Action
          className="absolute bottom-24 left-8"
          text="Town Hall"
          icon={heart}
          onClick={open}
        />
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel>
          <div className="flex flex-col items-center w-full">
            <img src={logo} className="w-1/2" />
            <p className="text-sm text-center pt-4">
              Sunflower Land is an open source project and we are so grateful to
              the contributors who have helped out.
            </p>
            <p className="text-sm text-center pt-4">
              If you like their work, visit their farm and buy them a coffee!
            </p>
            <div className="flex w-full mt-8">
              <img src={bumpkin} className="w-8 h-8 mr-4" />
              <div>
                <p className="text-sm">
                  Joe Blogg <span className="underline">#4</span>
                </p>
                <p className="text-sm">Developer (Easter Egg Hunt)</p>
              </div>
            </div>
            <div className="flex w-full mt-8">
              <img src={bumpkin} className="w-8 h-8 mr-4" />
              <div>
                <p className="text-sm">
                  George Blogg <span className="underline">#9</span>
                </p>
                <p className="text-sm">Designer (Easter Egg Hunt)</p>
              </div>
            </div>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
