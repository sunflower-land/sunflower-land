import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import deliveryBoard from "assets/ui/delivery_board_no_shadow.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import classNames from "classnames";
import { DeliveryHelp } from "features/island/delivery/components/DeliveryHelp";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { Orders } from "./Orders";

const Board: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);

  const delivery = gameState.context.state.delivery;

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 10.5}px`,
          top: `${PIXEL_SCALE * 3.3}px`,
        }}
      >
        <img
          src={deliveryBoard}
          className={classNames("w-full cursor-pointer hover:img-highlight")}
          onClick={() => {
            setShowModal(true);
          }}
        />
        {hasNewOrders(delivery) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute top-2.5 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 3}px`,
            }}
          />
        )}
      </div>

      <DeliveryModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export const DeliveryLog = React.memo(Board);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  return (
    <>
      <Modal
        centered
        show={isOpen}
        onHide={onClose}
        dialogClassName="md:max-w-3xl"
      >
        <CloseButtonPanel
          onClose={onClose}
          tabs={[
            { icon: SUNNYSIDE.icons.expression_chat, name: "Deliveries" },
            { icon: SUNNYSIDE.icons.expression_confused, name: "Help" },
          ]}
          currentTab={tab}
          setCurrentTab={setTab}
        >
          {tab === 0 && (
            <Orders
              selectedId={selectedOrderId}
              onSelect={setSelectedOrderId}
            />
          )}
          {tab === 1 && <DeliveryHelp />}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
