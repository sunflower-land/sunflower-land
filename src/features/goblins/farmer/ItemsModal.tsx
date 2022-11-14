import React from "react";
import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";
import coop from "assets/sfts/chicken_coop.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Rare } from "features/goblins/Rare";
import { LimitedItemType } from "features/game/types";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ItemsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel className="relative" hasTabs>
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab isActive>
            <img src={coop} className="h-5 mr-2" />
            <span className="text-sm">Rare</span>
          </Tab>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>

        <div
          style={{
            minHeight: "200px",
          }}
        >
          <Rare
            type={[LimitedItemType.MarketItem, LimitedItemType.BarnItem]}
            onClose={onClose}
          />
        </div>
      </Panel>
    </Modal>
  );
};
