import React from "react";
import { Modal } from "react-bootstrap";

import goldenCauliflower from "assets/nfts/golden_cauliflower.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";

import { Rare } from "features/goblins/Rare";
import { MARKET_ITEMS } from "features/game/types/craftables";
import { Tab } from "components/ui/Tab";

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
              <img src={goldenCauliflower} className="h-5 mr-2" />
              <span className="text-sm text-shadow">Rare</span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={onClose}
          />
        </div>

        <Rare items={MARKET_ITEMS} onClose={onClose} />
      </Panel>
    </Modal>
  );
};
