import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { SUNNYSIDE } from "assets/sunnyside";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import world from "assets/icons/world_small.png";
import { IslandList } from "features/game/expansion/components/travel/IslandList";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { hasNewChores } from "features/helios/components/hayseedHank/lib/chores";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `travel-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

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

  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const delivery = gameState.context.state.delivery;
  const chores = gameState.context.state.chores;

  return (
    <>
      <Modal
        centered
        show={isOpen}
        onHide={onClose}
        onShow={() => gameService.send("SAVE")}
        dialogClassName="md:max-w-3xl"
      >
        {showIntro ? (
          <Panel bumpkinParts={NPC_WEARABLES["daphne"]}>
            <SpeakingText
              message={[
                {
                  text: "Hey Traveller! Ready to explore?",
                },
                {
                  text: "Sunflower Land is filled with exciting islands where you can complete deliveries, craft rare NFTs and even dig for treasure!",
                },
                {
                  text: "Different locations bring different opportunities to spend your hard earned resources.",
                },
                {
                  text: "At any time click the travel button to return home.",
                },
              ]}
              onClose={() => {
                acknowledgeRead();
                setShowIntro(false);
              }}
            />
          </Panel>
        ) : (
          <CloseButtonPanel
            onClose={onClose}
            tabs={[
              { icon: world, name: "Travel" },
              {
                icon: SUNNYSIDE.icons.heart,
                name: "Deliveries",
                alert: hasNewOrders(delivery),
              },
              {
                icon: SUNNYSIDE.icons.expression_chat,
                name: "Chores",
                alert: chores && hasNewChores(chores),
              },
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
                  hasBetaAccess={
                    !!gameState.context.state.inventory["Beta Pass"]
                  }
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
        )}
      </Modal>
    </>
  );
};
