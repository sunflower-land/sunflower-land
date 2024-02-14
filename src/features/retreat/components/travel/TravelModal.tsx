import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import world from "assets/icons/world_small.png";
import { IslandList } from "features/game/expansion/components/travel/IslandList";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { hasNewChores } from "features/helios/components/hayseedHank/lib/chores";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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

  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);

  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const delivery = gameState.context.state.delivery;
  const chores = gameState.context.state.chores;
  const { t } = useAppTranslation();
  return (
    <>
      <Modal
        centered
        show={isOpen}
        onHide={onClose}
        dialogClassName="md:max-w-3xl"
      >
        {showIntro ? (
          <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
            <SpeakingText
              message={[
                {
                  text: t("traveller.ready"),
                },
                {
                  text: t("sunflowerLand.islandDescription"),
                },
                {
                  text: t("sunflowerLand.opportunitiesDescription"),
                },
                {
                  text: t("sunflowerLand.returnHomeInstruction"),
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
              { icon: world, name: t("travel") },
              {
                icon: SUNNYSIDE.icons.heart,
                name: t("deliveries"),
                alert: hasNewOrders(delivery),
              },
              {
                icon: SUNNYSIDE.icons.expression_chat,
                name: t("chores"),
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
                  gameState={gameState.context.state}
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
