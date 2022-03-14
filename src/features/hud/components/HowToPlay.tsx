import React from "react";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";

import sunflower from "assets/crops/sunflower/planted.png";
import seedling from "assets/crops/sunflower/seedling.png";
import cursor from "assets/ui/cursor.png";

import market from "assets/buildings/market_building.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const handleTweetClick = () => {};

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      //dialogClassName="w-full sm:w-2/3 max-w-6xl"
    >
      <Panel>
        <Modal.Header className="justify-content-space-between">
          <h1 className="ml-2">How to Play?</h1>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1 justify-content-end"
            onClick={onClose}
          />
        </Modal.Header>
        <Modal.Body>
          <div className="flex items-center">
            <p className="text-sm p-2">1. Harvest crops when they are ready</p>
            <div className="relative">
              <img src={sunflower} className="w-12" />
              <img src={cursor} className="w-4 absolute right-0 bottom-0" />
            </div>
          </div>
          <div className="flex flex-row-reverse items-center mt-2">
            <p className="text-sm p-2">2. Sell crops at the shop for SFL</p>
            <div className="relative">
              <img src={market} className="w-14" />
              <img src={cursor} className="w-4 absolute right-0 bottom-0" />
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-sm p-2">3. Buy seeds at the shop</p>

            <div className="relative">
              <img src={market} className="w-14" />
              <img src={cursor} className="w-4 absolute right-0 bottom-0" />
            </div>
          </div>
          <div className="flex flex-row-reverse items-center mt-2">
            <p className="text-sm p-2">4. Plant the seeds and wait</p>
            <div className="relative">
              <img src={seedling} className="w-12" />
              <img src={cursor} className="w-4 absolute right-0 bottom-0" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="text-s w-1/4 px-1" onClick={handleTweetClick}>
            Next
          </Button>
        </Modal.Footer>
      </Panel>
    </Modal>
  );
};
