import React from "react";
import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";
import coop from "assets/nfts/chicken_coop.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { BARN_ITEMS, MARKET_ITEMS } from "features/game/types/craftables";
import { Rare } from "features/goblins/Rare";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ItemsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel className="pt-5 relative">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab isActive>
              <img src={coop} className="h-5 mr-2" />
              <span className="text-sm text-shadow">Rare</span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={onClose}
          />
        </div>

        <div
          style={{
            minHeight: "200px",
          }}
        >
          <Rare items={{ ...MARKET_ITEMS, ...BARN_ITEMS }} onClose={onClose} />
        </div>
      </Panel>
    </Modal>
  );
};
