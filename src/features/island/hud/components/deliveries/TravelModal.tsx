import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { DeliveryOrders } from "features/island/delivery/components/Orders";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import world from "assets/icons/world_small.png";
import lockIcon from "assets/skills/lock.png";

import { IslandList } from "features/game/expansion/components/travel/IslandList";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { NPC_WEARABLES } from "lib/npcs";
import { Panel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { hasNewChores } from "features/helios/components/hayseedHank/lib/chores";
import { Label } from "components/ui/Label";
import { getBumpkinLevel } from "features/game/lib/level";
import { translate } from "lib/i18n/translate";
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
  isVisiting?: boolean;
  onClose: () => void;
}

const CONTENT_HEIGHT = 380;

export const TravelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isVisiting = false,
}) => {
  const [tab, setTab] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const delivery = gameState.context.state.delivery;
  const chores = gameState.context.state.chores;

  const { t } = useAppTranslation();

  if (isVisiting) {
    return (
      <Modal
        centered
        show={isOpen}
        onHide={onClose}
        dialogClassName="md:max-w-3xl"
      >
        <CloseButtonPanel
          onClose={onClose}
          tabs={[{ icon: world, name: "Travel" }]}
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
                bumpkin={undefined}
                showVisitList={true}
                gameState={gameState.context.state}
                travelAllowed={true}
                hasBetaAccess={false}
                onClose={onClose}
              />
            )}
          </div>
        </CloseButtonPanel>
      </Modal>
    );
  }

  const isLocked =
    getBumpkinLevel(gameState.context.state.bumpkin?.experience ?? 0) < 3;

  return (
    <Modal
      centered
      show={isOpen}
      onHide={onClose}
      onShow={() => gameService.send("SAVE")}
      dialogClassName="md:max-w-3xl"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {isLocked && (
          <CloseButtonPanel onClose={onClose}>
            <div className="flex flex-col items-center">
              <Label className="mt-2" icon={lockIcon} type="danger">
                {t("warning.level.required")}
                {": 3"}
              </Label>
              <img src={world} className="w-10 mx-auto my-2" />
              <p className="text-sm text-center mb-1">
                {t("travelRequirement.notice")}
              </p>
              <p className="text-xs text-center mb-2">
                {t("statements.visit.firePit")}
              </p>
            </div>
          </CloseButtonPanel>
        )}
        {!isLocked && showIntro && (
          <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
            <SpeakingText
              message={[
                {
                  text: translate("traveller.ready"),
                },
                {
                  text: translate("sunflowerLand.islandDescription"),
                },
                {
                  text: translate("sunflowerLand.opportunitiesDescription"),
                },
                {
                  text: translate("sunflowerLand.returnHomeInstruction"),
                },
              ]}
              onClose={() => {
                acknowledgeRead();
                setShowIntro(false);
              }}
            />
          </Panel>
        )}
        {!isLocked && !showIntro && (
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
      </div>
    </Modal>
  );
};
