import React, { useContext, useEffect, useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Guide } from "features/helios/components/guide/components/Guide";
import { SUNNYSIDE } from "assets/sunnyside";
import { PeteHelp } from "./PeteHelp";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { GuidePath } from "features/helios/components/guide/lib/guide";
import { MapPlacement } from "./MapPlacement";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { getKeys } from "features/game/types/craftables";
import { CROPS } from "features/game/types/crops";
import { translate } from "lib/i18n/translate";

const isNoob = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) < 3;

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 0;

const hint = (state: MachineState) => {
  const activity = state.context.state.bumpkin?.activity;
  const inventory = state.context.state.inventory;
  const level = getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

  if (level >= 2) {
    return "Explore";
  }

  const choppedTrees = activity?.["Tree Chopped"] ?? 0;
  if (choppedTrees < 3) {
    return translate("pete.teaser.one");
  }

  if (inventory["Basic Land"]?.lte(3)) {
    return translate("expand.land");
  }

  const harvestedCrops = getKeys(CROPS).reduce(
    (total, crop) => total + (activity?.[`${crop} Harvested`] ?? 0),
    0,
  );

  if (inventory.Shovel && harvestedCrops < 3) {
    return translate("pete.teaser.three");
  }

  const soldCrops = getKeys(CROPS).reduce(
    (total, crop) => total + (activity?.[`${crop} Sold`] ?? 0),
    0,
  );

  if (inventory.Sunflower && soldCrops < 3) {
    return translate("pete.teaser.four");
  }

  const boughtCrops = getKeys(CROPS).reduce(
    (total, crop) => total + (activity?.[`${crop} Seed Bought`] ?? 0),
    0,
  );

  if (soldCrops > 0 && boughtCrops === 0) {
    return translate("pete.teaser.five");
  }

  const plantedCrops = getKeys(CROPS).reduce(
    (total, crop) => total + (activity?.[`${crop} Planted`] ?? 0),
    0,
  );

  if (inventory["Sunflower Seed"] && plantedCrops === 0) {
    return translate("pete.teaser.six");
  }

  if (
    plantedCrops >= 3 &&
    !inventory["Sunflower Seed"]?.gt(0) &&
    !inventory["Basic Scarecrow"]
  ) {
    return translate("pete.teaser.seven");
  }

  if (inventory["Basic Scarecrow"] && level === 1) {
    return translate("pete.teaser.eight");
  }

  return null;
};

export const TravelTeaser: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const showSpeech = useSelector(gameService, isNoob);
  const peteHint = useSelector(gameService, hint);
  const expansionCount = useSelector(gameService, expansions);
  const { t } = useAppTranslation();

  const [peteState, setPeteState] = useState<"idle" | "typing">("idle");

  const [tab, setTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [guide, setGuide] = useState<GuidePath>();

  useEffect(() => {
    const speak = async () => {
      setPeteState("typing");

      await new Promise((res) => setTimeout(() => setPeteState("idle"), 1000));
    };

    speak();
  }, [peteHint]);

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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
            src={SUNNYSIDE.decorations.raft}
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
            {peteHint && peteHint !== "Explore" && (
              <div
                className={
                  "absolute uppercase" +
                  (showAnimations ? " animate-float" : "")
                }
                style={{
                  fontFamily: "Teeny",
                  color: "black",
                  textShadow: "none",
                  top: `${PIXEL_SCALE * -8}px`,
                  left: `${PIXEL_SCALE * 6}px`,

                  borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
                  borderStyle: "solid",
                  borderTopWidth: `${PIXEL_SCALE * 2}px`,
                  borderRightWidth: `${PIXEL_SCALE * 2}px`,
                  borderBottomWidth: `${PIXEL_SCALE * 4}px`,
                  borderLeftWidth: `${PIXEL_SCALE * 5}px`,

                  borderImageSlice: "2 2 4 5 fill",
                  imageRendering: "pixelated",
                  borderImageRepeat: "stretch",
                  fontSize: "8px",
                }}
              >
                <div
                  style={{
                    transform: "scaleX(-1)",
                    height: "12px",
                    minWidth: "30px",
                  }}
                >
                  {peteState === "idle" && (
                    <span
                      className="whitespace-nowrap"
                      style={{
                        fontSize: "10px",
                        position: "relative",
                        bottom: "4px",
                        left: "4px",
                        wordSpacing: "-4px",
                        color: "#262b45",
                      }}
                    >
                      {peteHint}
                    </span>
                  )}

                  {peteState === "typing" && (
                    <span
                      style={{
                        fontSize: "10px",
                        position: "relative",
                        bottom: "4px",
                        left: "4px",
                        wordSpacing: "-4px",
                        color: "#262b45",
                      }}
                    >
                      {"..."}
                    </span>
                  )}
                </div>
              </div>
            )}

            {peteHint === "Explore" && (
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
