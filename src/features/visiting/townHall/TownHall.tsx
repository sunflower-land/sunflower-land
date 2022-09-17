import React from "react";
import { Modal } from "react-bootstrap";

import townHall from "assets/buildings/townhall.png";
import heart from "assets/icons/heart.png";
import close from "assets/icons/close.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { Panel } from "components/ui/Panel";
import { Contributors } from "features/farming/townHall/components/Contributors";
import { Tab } from "components/ui/Tab";

export const TownHall: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

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
        <Panel className="pt-5 relative max-w-5xl">
          <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
            <div className="flex">
              <Tab isActive>
                <img src={heart} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Contributors</span>
              </Tab>
            </div>
            <img
              src={close}
              className="h-6 cursor-pointer mr-2 mb-1"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <Contributors onClose={() => setIsOpen(false)} />
        </Panel>
      </Modal>
    </div>
  );
};
