import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import world from "assets/icons/world.png";
import { IslandList } from "features/game/expansion/components/travel/IslandList";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CONTENT_HEIGHT = 380;

export const TravelModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

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
            { icon: world, name: "Travel" },
            { icon: SUNNYSIDE.icons.heart, name: "Deliveries" },
            { icon: SUNNYSIDE.icons.expression_chat, name: "Chores" },
          ]}
          currentTab={tab}
          setCurrentTab={setTab}
        >
          <div
            style={{ maxHeight: CONTENT_HEIGHT }}
            className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
          >
            {tab === 0 && (
              // TODO - save flow + tutorial (intro to travel)
              <IslandList
                bumpkin={gameState.context.state.bumpkin}
                showVisitList={false}
                inventory={gameState.context.state.inventory}
                travelAllowed={true}
                hasBetaAccess={!!gameState.context.state.inventory["Beta Pass"]}
                onClose={onClose}
              />
            )}
            {tab === 1 && (
              <DeliveryOrders
                selectedId={selectedOrderId}
                onSelect={setSelectedOrderId}
              />
            )}
            {tab === 2 && (
              <div className="pt-1">
                <ChoreV2 isReadOnly />
              </div>
            )}
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
