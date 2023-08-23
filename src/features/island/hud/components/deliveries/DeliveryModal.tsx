import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { DeliveryHelp } from "features/island/delivery/components/DeliveryHelp";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";

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
            { icon: SUNNYSIDE.icons.expression_chat, name: "Chores" },
            { icon: SUNNYSIDE.icons.expression_confused, name: "Help" },
          ]}
          currentTab={tab}
          setCurrentTab={setTab}
        >
          {tab === 0 && (
            <DeliveryOrders
              selectedId={selectedOrderId}
              onSelect={setSelectedOrderId}
            />
          )}
          {tab === 1 && <ChoreV2 isReadOnly />}
          {tab === 2 && <DeliveryHelp />}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
