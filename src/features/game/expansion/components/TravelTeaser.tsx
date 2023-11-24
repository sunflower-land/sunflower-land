import React, { useContext, useState } from "react";
import raft from "assets/decorations/raft.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Guide } from "features/helios/components/hayseedHank/components/Guide";
import { SUNNYSIDE } from "assets/sunnyside";
import { PeteHelp } from "./PeteHelp";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { GuidePath } from "features/helios/components/hayseedHank/lib/guide";
import { MapPlacement } from "./MapPlacement";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const isNoob = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) < 3;

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 0;

export const TravelTeaser: React.FC = () => {
  const { gameService } = useContext(Context);
  const showSpeech = useSelector(gameService, isNoob);
  const expansionCount = useSelector(gameService, expansions);
  const { t } = useAppTranslation();

  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [guide, setGuide] = useState<GuidePath>();

  const coords = () => {
    if (expansionCount < 7) {
      return { x: 6, y: -4.5 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: 6, y: -10.5 };
    } else {
      return { x: 6, y: -16.5 };
    }
  };

  const coordinates = coords();

  return (
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
          onClose={() => setShowModal(false)}
          tabs={[
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: t("explore"),
            },
            {
              icon: SUNNYSIDE.icons.expression_confused,
              name: t("guide"),
            },
          ]}
          currentTab={tab}
          setCurrentTab={setTab}
        >
          <div
            style={{ maxHeight: "300px" }}
            className="scrollable overflow-y-auto"
          >
            {tab === 0 && <PeteHelp />}
            {tab === 1 && <Guide selected={guide} onSelect={setGuide} />}
          </div>
        </CloseButtonPanel>
      </Modal>
      <MapPlacement x={coordinates.x} y={coordinates.y} width={3}>
        <div
          className="absolute"
          style={{
            top: `${2 * PIXEL_SCALE}px`,
            left: `${2 * PIXEL_SCALE}px`,
          }}
        >
          <img
            src={raft}
            style={{
              width: `${37 * PIXEL_SCALE}px`,
            }}
          />
          <div
            className="absolute"
            style={{
              top: `${-10 * PIXEL_SCALE}px`,
              left: `${14 * PIXEL_SCALE}px`,
              width: `${1 * GRID_WIDTH_PX}px`,
              transform: "scaleX(-1)",
            }}
          >
            {showSpeech && (
              <img
                src={SUNNYSIDE.icons.expression_chat}
                className="absolute z-10"
                style={{
                  width: `${10 * PIXEL_SCALE}px`,
                  top: `${-5 * PIXEL_SCALE}px`,
                  left: `${8 * PIXEL_SCALE}px`,
                }}
              />
            )}

            <NPC
              parts={NPC_WEARABLES["pumpkin' pete"]}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      </MapPlacement>
    </>
  );
};
