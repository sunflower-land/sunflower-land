import React, { useContext, useEffect, useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PeteHelp } from "./PeteHelp";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { MapPlacement } from "./MapPlacement";
import { getWharfCoordinates } from "../lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import Decimal from "decimal.js-light";
import { getKeys } from "lib/object";
import { CROPS } from "features/game/types/crops";
import { BUILDINGS } from "features/game/types/buildings";
import { EXPANSION_REQUIREMENTS } from "features/game/types/expansions";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { translate } from "lib/i18n/translate";
import { isAsciiText } from "lib/utils/textSupport";
import { getResolvedFontFamily } from "lib/utils/fonts";
import { Guide } from "features/helios/components/hayseedHank/components/Guide";
import type { GuidePath } from "features/helios/components/hayseedHank/lib/guide";
import {
  hasFulfilledFirstDelivery,
  needsFirstDelivery,
} from "features/island/delivery/lib/onboarding";
import { getTutorialNudge } from "features/island/lib/tutorialNudge";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 0;

const hint = (state: MachineState) => {
  const game = state.context.state;
  const activity = game.farmActivity;
  const inventory = game.inventory;
  const ascension = getAscensionLevel({
    experience: game.bumpkin.experience ?? 0,
    ascensionLevel: game.island.ascensionLevel ?? 0,
  });

  if (meetsLevelRequirement(ascension, { ascension: 0, level: 2 })) {
    // Peggy's tart orders recur through the work cycle, so only call one
    // out while a tart is actually in hand - while the Rhubarb is still
    // growing, the well/mine/expand cues below own the guidance.
    const hasDeliverableTart = game.delivery.orders.some(
      (order) =>
        order.from === "peggy" &&
        !order.completedAt &&
        !!order.items["Rhubarb Tart"] &&
        (inventory["Rhubarb Tart"] ?? new Decimal(0)).gte(
          order.items["Rhubarb Tart"] ?? 0,
        ),
    );
    if (game.island.type === "basic" && hasDeliverableTart) {
      return translate("pete.teaser.deliverTart");
    }

    // Pete never promises deliveries that don't exist: with an empty board
    // (the server's onboarding rescue aside) he falls back to exploring.
    const hasOpenDelivery = game.delivery.orders.some(
      (order) => !order.completedAt,
    );
    const moreDeliveries = hasOpenDelivery
      ? translate("pete.teaser.moreDeliveries")
      : "Explore";

    const basicLand = inventory["Basic Land"]?.toNumber() ?? 3;

    // The post-expansion work cycle: deliveries bankroll the Water Well
    // while the Rhubarb regrows, then Pete points at the Well itself.
    // (Before the sixth expansion the next-expansion cues below apply.)
    if (
      game.island.type === "basic" &&
      basicLand >= 6 &&
      !game.buildings["Water Well"]?.length
    ) {
      return game.coins >= (BUILDINGS["Water Well"].coins ?? 0)
        ? translate("pete.teaser.waterWell")
        : moreDeliveries;
    }

    // Working toward the next expansion (the Stone expansion, then the
    // stretch expansion): deliveries fund the Pickaxes and the coins, then
    // the Stone gets mined. Keyed off whatever the expansion actually asks
    // for, so the ate-both-tarts path gets the right cue too.
    const requirements = EXPANSION_REQUIREMENTS.basic[basicLand + 1];
    if (game.island.type === "basic" && basicLand <= 6 && requirements) {
      const resources = requirements.resources;
      const missing = getKeys(resources).filter((name) =>
        (inventory[name] ?? new Decimal(0)).lt(resources[name] ?? 0),
      );

      if (missing.includes("Wood")) {
        return translate("pete.teaser.one");
      }

      if (missing.includes("Stone")) {
        const stoneShort =
          (resources.Stone ?? 0) - (inventory.Stone?.toNumber() ?? 0);
        const pickaxesNeeded = Math.max(
          0,
          Math.ceil(stoneShort) - (inventory.Pickaxe?.toNumber() ?? 0),
        );
        const pickaxeCoins = pickaxesNeeded * WORKBENCH_TOOLS.Pickaxe.price;

        return game.coins >= (requirements.coins ?? 0) + pickaxeCoins
          ? translate("pete.teaser.mineStone")
          : moreDeliveries;
      }

      return game.coins >= (requirements.coins ?? 0)
        ? translate("expand.land")
        : moreDeliveries;
    }

    return "Explore";
  }

  const choppedTrees = activity["Tree Chopped"] ?? 0;
  if (choppedTrees === 0 && !inventory.Axe?.gt(0)) {
    return translate("pete.teaser.zero");
  }

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

  if (needsFirstDelivery(game)) {
    return translate("pete.teaser.deliver");
  }

  // After the first delivery the coins fund the next expansion - say the
  // same thing the farm's pointer shows (see getTutorialNudge)
  const nudge = getTutorialNudge(game);
  if (nudge === "workbench-axes" && hasFulfilledFirstDelivery(game)) {
    return translate("pete.teaser.zero");
  }
  if (nudge === "chop-trees") return translate("pete.teaser.one");
  if (nudge === "expand-land") return translate("expand.land");

  const soldCrops = getKeys(CROPS).reduce(
    (total, crop) => total + (activity?.[`${crop} Sold`] ?? 0),
    0,
  );

  const boughtCrops = getKeys(CROPS).reduce(
    (total, crop) => total + (activity?.[`${crop} Seed Bought`] ?? 0),
    0,
  );

  if ((hasFulfilledFirstDelivery(game) || soldCrops > 0) && boughtCrops === 0) {
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

  if (inventory["Basic Scarecrow"] && ascension.level === 1) {
    return translate("pete.teaser.eight");
  }

  return null;
};

export const TravelTeaser: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const peteHint = useSelector(gameService, hint);
  const expansionCount = useSelector(gameService, expansions);
  const { t } = useAppTranslation();
  // "Teeny" is a pixel font with printable-ASCII-only glyphs; scripts it
  // can't render (Cyrillic, CJK, etc.) fall back to the player's regular UI
  // font instead. That font runs wider than Teeny, so the layout below
  // (word spacing, offsets, min width) is tuned separately per case.
  const isTeenySupported = isAsciiText(peteHint ?? "");

  const [peteState, setPeteState] = useState<"idle" | "typing">("idle");

  type Tab = "explore" | "guide";
  const [tab, setTab] = useState<Tab>("explore");
  const [showModal, setShowModal] = useState(false);
  const [guide, setGuide] = useState<GuidePath>();

  useEffect(() => {
    const speak = async () => {
      setPeteState("typing");

      await new Promise(() => setTimeout(() => setPeteState("idle"), 1000));
    };

    speak();
  }, [peteHint]);

  // Pumpkin Pete's boat sits east of the dock/salt and moves with the dock.
  const coords = () => {
    const wharf = getWharfCoordinates(expansionCount);
    return { x: wharf.x + 13, y: wharf.y - 1.5 };
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
              id: "explore",
              icon: SUNNYSIDE.icons.expression_chat,
              name: t("explore"),
            },
            {
              id: "guide",
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
            {tab === "explore" && <PeteHelp />}
            {tab === "guide" && <Guide selected={guide} onSelect={setGuide} />}
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
                  fontFamily: isTeenySupported
                    ? "Teeny"
                    : getResolvedFontFamily(),
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
                  fontSize: isTeenySupported ? "8px" : "var(--text-xxxs-size)",
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
                      style={
                        isTeenySupported
                          ? {
                              fontSize: "10px",
                              position: "relative",
                              bottom: "4px",
                              left: "4px",
                              wordSpacing: "-4px",
                              color: "#262b45",
                            }
                          : {
                              fontSize: "var(--text-xxxs-size)",
                              lineHeight: "var(--text-xxxs-line-height)",
                              position: "relative",
                              bottom: "2px",
                              color: "#262b45",
                            }
                      }
                    >
                      {peteHint}
                    </span>
                  )}

                  {peteState === "typing" && (
                    <span
                      style={
                        isTeenySupported
                          ? {
                              fontSize: "10px",
                              position: "relative",
                              bottom: "4px",
                              left: "4px",
                              wordSpacing: "-4px",
                              color: "#262b45",
                            }
                          : {
                              fontSize: "var(--text-xxxs-size)",
                              lineHeight: "var(--text-xxxs-line-height)",
                              position: "relative",
                              bottom: "2px",
                              color: "#262b45",
                            }
                      }
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

            <NPCPlaceable
              parts={NPC_WEARABLES["pumpkin' pete"]}
              onClick={() => setShowModal(true)}
            />
          </div>
        </div>
      </MapPlacement>
    </>
  );
};
