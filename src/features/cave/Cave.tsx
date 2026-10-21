import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { NPC_WEARABLES } from "lib/npcs";
import { useSelector } from "@xstate/react";
import { Navigate, useNavigate } from "react-router";
import ScrollContainer from "react-indiana-drag-scroll";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { isCaveBuildingReady } from "features/game/lib/cave";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { useNow } from "lib/utils/hooks/useNow";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import {
  CAVE_CONSTRUCTION_SITES,
  CAVE_IMAGE_SIZE,
  CAVE_LADDER,
  CAVE_MERCHANT_ALCOVE,
  CAVE_PATCH_SIZE,
  CAVE_SLOTS,
  caveSlotsForTier,
  type CaveTileRect,
} from "features/game/expansion/placeable/lib/caveLayout";
import { getNextCaveTier } from "features/game/types/caveTiers";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { secondsToString } from "lib/utils/time";
import { CaveMachineModal } from "./components/CaveMachineModal";
import { CaveExpansionModal } from "./components/CaveExpansionModal";
import { CaveMerchantModal } from "./components/CaveMerchantModal";
import { CavePatch } from "./components/CavePatch";
import {
  CAVE_LADDER_IMAGE,
  CAVE_LADDER_SPRITE,
  getCaveMycoBinImage,
  getCaveRoomImage,
} from "./lib/caveImages";
import { Hud } from "features/island/hud/Hud";
import { NPCSpeechBubble } from "features/game/components/NPCSpeechBubble";
import {
  CAVE_TUTORIAL_BUBBLES,
  CaveTutorialHand,
  CaveTutorialPopup,
} from "./components/CaveTutorial";
import {
  acknowledgeCaveTutorial,
  getCaveTutorialSeen,
  getCaveTutorialStep,
  type CaveTutorialSeen,
} from "./lib/onboarding";

const _cave = (state: MachineState) => state.context.state.cave;
const _buildings = (state: MachineState) => state.context.state.buildings;
const _hasCaveAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "CAVE");
const _shovels = (state: MachineState) =>
  state.context.state.inventory["Sand Shovel"]?.toNumber() ?? 0;
const _drills = (state: MachineState) =>
  state.context.state.inventory["Sand Drill"]?.toNumber() ?? 0;

/** CSS for a tile rectangle on the room image. */
const tileStyle = (rect: CaveTileRect): React.CSSProperties => ({
  left: `${rect.x * GRID_WIDTH_PX}px`,
  top: `${rect.y * GRID_WIDTH_PX}px`,
  width: `${rect.width * GRID_WIDTH_PX}px`,
  height: `${rect.height * GRID_WIDTH_PX}px`,
});

/**
 * A sprite drawn over the room inside its button, highlighted while the button
 * is hovered so the outline follows the art rather than the hitbox.
 */
const Sprite: React.FC<{ src: string; style?: React.CSSProperties }> = ({
  src,
  style,
}) => (
  <img
    src={src}
    alt=""
    className="absolute pointer-events-none group-hover:img-highlight"
    style={{
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      imageRendering: "pixelated",
      ...style,
    }}
  />
);

/**
 * The Cave interior, mounted at `/cave`, laid out like the Barn and the home
 * Interior: the art team's render of the room at this tier, with the
 * interactive pieces positioned over it in tiles. Each unlocked slot is a
 * Myco Bin sign (opens the batch popover) above its 5x5 patch (dug tile by
 * tile with the Sand Shovel, or 2x2 with the Sand Drill); the barrier where
 * the next slot opens carries the expansion sign; the Goblin Cave Merchant
 * stands in the alcove by the entrance from his tier; the ladder leaves.
 */
export const Cave: React.FC = () => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();
  const { t } = useAppTranslation();

  const cave = useSelector(gameService, _cave);
  const buildings = useSelector(gameService, _buildings);
  const hasCaveAccess = useSelector(gameService, _hasCaveAccess);
  const shovels = useSelector(gameService, _shovels);
  const drills = useSelector(gameService, _drills);
  const now = useNow({ live: true });
  const [selectedMachine, setSelectedMachine] = useState<string>();
  const [showExpansion, setShowExpansion] = useState(false);
  const [showMerchant, setShowMerchant] = useState(false);
  const [tutorialSeen, setTutorialSeen] = useState(getCaveTutorialSeen);
  const tutorialStep = useSelector(gameService, (state: MachineState) =>
    getCaveTutorialStep(state.context.state, now, tutorialSeen),
  );
  const entryRef = useRef<HTMLDivElement>(null);
  // Patches already fully dug when the player came in show as empty sand,
  // waiting for a new mix. Keyed by the batch's start so a batch started (and
  // dug out) during this visit stays dug until the player leaves.
  const [clearedOnEntry] = useState(() =>
    Object.fromEntries(
      Object.entries(cave?.machines ?? {}).flatMap(([id, { batch }]) =>
        batch && isCavePatchCleared(batch) ? [[id, batch.startedAt]] : [],
      ),
    ),
  );

  // Open on the ladder at the room's top-left, not the room's centre.
  useLayoutEffect(() => {
    entryRef.current?.scrollIntoView({
      behavior: "auto",
      block: "start",
      inline: "start",
    });
  }, []);

  // Reached by URL without access or before the Cave building is placed and
  // finished — send the player back to the farm.
  if (!hasCaveAccess || !cave || !isCaveBuildingReady({ buildings }, now)) {
    return <Navigate to="/" replace />;
  }

  const slots = caveSlotsForTier(cave.tier);
  const site = getNextCaveTier(cave.tier)
    ? CAVE_CONSTRUCTION_SITES[cave.tier]
    : undefined;
  const construction = cave.construction;
  const constructionReady = !!construction && construction.readyAt <= now;

  const acknowledgeTutorial = (key: keyof CaveTutorialSeen) => {
    acknowledgeCaveTutorial(key);
    setTutorialSeen(getCaveTutorialSeen());
  };
  // Gloomwick says what a step is about first (unless a Cave popup is already
  // open); his bubble and the hand follow once he has.
  const showTutorialPopup =
    !!tutorialStep &&
    !tutorialSeen[tutorialStep] &&
    !selectedMachine &&
    !showExpansion &&
    !showMerchant;
  const guiding =
    tutorialStep && tutorialSeen[tutorialStep] ? tutorialStep : undefined;

  return (
    <div className="absolute inset-0 bg-[#181425] overflow-hidden">
      {/* Same scroll setup as the home Interior: click-and-drag panning over a
          big gameboard with the room centred in it. */}
      <ScrollContainer
        className="!overflow-scroll relative w-full h-full page-scroll-container overscroll-none"
        ignoreElements={"*[data-prevent-drag-scroll]"}
      >
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${64 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative"
              style={{
                width: `${CAVE_IMAGE_SIZE.width * GRID_WIDTH_PX}px`,
                height: `${CAVE_IMAGE_SIZE.height * GRID_WIDTH_PX}px`,
              }}
            >
              <img
                src={getCaveRoomImage(cave.tier)}
                id={Section.GenesisBlock}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ imageRendering: "pixelated" }}
                alt=""
              />

              {/* Where the view opens: its top-left corner sits 2 tiles above
              and 5 tiles left of the ladder. */}
              <div
                ref={entryRef}
                className="absolute pointer-events-none"
                style={tileStyle({
                  x: CAVE_LADDER.x - 5,
                  y: CAVE_LADDER.y - 2,
                  width: 1,
                  height: 1,
                })}
              />

              {/* The ladder out. A native button so keyboard users can leave. */}
              <button
                type="button"
                aria-label={t("exit")}
                className="group absolute cursor-pointer bg-transparent border-0 p-0"
                style={tileStyle(CAVE_LADDER)}
                onClick={() => navigate("/")}
              >
                <Sprite
                  src={CAVE_LADDER_IMAGE}
                  style={{
                    top: `${CAVE_LADDER_SPRITE.top * PIXEL_SCALE}px`,
                    width: `${CAVE_LADDER_SPRITE.width * PIXEL_SCALE}px`,
                    height: `${CAVE_LADDER_SPRITE.height * PIXEL_SCALE}px`,
                  }}
                />
              </button>

              {/* Goblin Cave Merchant beside the entrance arch, under his sign. A
              native button so keyboard users can reach him. */}
              <button
                type="button"
                aria-label={t("cave.merchant.title")}
                className="absolute cursor-pointer bg-transparent border-0 p-0 hover:img-highlight"
                style={{
                  left: `${(CAVE_MERCHANT_ALCOVE.x + CAVE_MERCHANT_ALCOVE.width - 4) * GRID_WIDTH_PX}px`,
                  top: `${(CAVE_MERCHANT_ALCOVE.y + 2) * GRID_WIDTH_PX}px`,
                }}
                onClick={() => setShowMerchant(true)}
              >
                {guiding && (
                  <NPCSpeechBubble
                    text={t(CAVE_TUTORIAL_BUBBLES[guiding])}
                    // Anchored top-left (Gloomwick hangs below this button's
                    // top edge) so the tail sits just over his head however
                    // long the text is.
                    style={{
                      top: `${PIXEL_SCALE * -6}px`,
                      left: `${PIXEL_SCALE * 6}px`,
                    }}
                  />
                )}
                <NPCPlaceable parts={NPC_WEARABLES.gloomwick} flipped />
                {guiding === "buy-shovels" && !showMerchant && (
                  <CaveTutorialHand />
                )}
              </button>

              {slots.map((id) => {
                const slot = CAVE_SLOTS[id];
                const batch = cave.machines[String(id)]?.batch;

                return (
                  <React.Fragment key={`slot-${id}`}>
                    {/* The Myco Bin, showing what it is composting — opens the
                    batch popover. */}
                    <button
                      type="button"
                      aria-label={t("cave.machine", { id })}
                      className="group absolute cursor-pointer bg-transparent border-0 p-0"
                      style={tileStyle(slot.sign)}
                      onClick={() => setSelectedMachine(String(id))}
                    >
                      <Sprite src={getCaveMycoBinImage(batch, now)} />
                      {id === 1 &&
                        guiding === "start-batch" &&
                        !selectedMachine && <CaveTutorialHand />}
                    </button>

                    {/* 5x5 digging patch on the slot's sand. */}
                    <div
                      className="absolute"
                      style={{
                        left: `${slot.patch.x * GRID_WIDTH_PX}px`,
                        top: `${slot.patch.y * GRID_WIDTH_PX}px`,
                        width: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                        height: `${CAVE_PATCH_SIZE * GRID_WIDTH_PX}px`,
                      }}
                    >
                      <CavePatch
                        machineId={String(id)}
                        batch={
                          batch?.startedAt === clearedOnEntry[String(id)]
                            ? undefined
                            : batch
                        }
                        now={now}
                        hasShovel={shovels > 0}
                        hasDrill={drills > 0}
                        tutorialTile={
                          id === 1 && guiding === "dig"
                            ? { x: 2, y: 2 }
                            : undefined
                        }
                      />
                    </div>
                  </React.Fragment>
                );
              })}

              {/* The barrier where the next slot opens: expand, wait out the
              construction (or finish it with Gems), then open the new slot. */}
              {site && (
                <button
                  type="button"
                  className="absolute cursor-pointer bg-transparent border-0 p-0 flex items-center justify-center"
                  style={tileStyle(site)}
                  onClick={() => {
                    if (guiding === "expand") acknowledgeTutorial("done");

                    if (constructionReady) {
                      gameService.send({ type: "cave.expansionCompleted" });
                    } else {
                      setShowExpansion(true);
                    }
                  }}
                >
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                    {!construction && (
                      <Label type="default" icon={SUNNYSIDE.icons.expand}>
                        {t("cave.expand.expand")}
                      </Label>
                    )}
                    {construction && !constructionReady && (
                      <Label type="warning" icon={SUNNYSIDE.icons.hammer}>
                        {secondsToString(
                          Math.max(0, (construction.readyAt - now) / 1000),
                          { length: "short" },
                        )}
                      </Label>
                    )}
                    {constructionReady && (
                      <Label type="success" icon={SUNNYSIDE.icons.hammer}>
                        {t("cave.expand.ready")}
                      </Label>
                    )}
                  </div>
                  {guiding === "expand" && !showExpansion && (
                    <CaveTutorialHand
                      style={{
                        left: "50%",
                        top: `${PIXEL_SCALE * 4}px`,
                      }}
                    />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </ScrollContainer>

      {showExpansion && (
        <CaveExpansionModal onClose={() => setShowExpansion(false)} />
      )}

      {showMerchant && (
        <CaveMerchantModal onClose={() => setShowMerchant(false)} />
      )}

      {selectedMachine && (
        <CaveMachineModal
          machineId={selectedMachine}
          onClose={() => setSelectedMachine(undefined)}
          showTutorialHand={guiding === "start-batch"}
        />
      )}

      {showTutorialPopup && tutorialStep && (
        <CaveTutorialPopup
          step={tutorialStep}
          onClose={() => acknowledgeTutorial(tutorialStep)}
        />
      )}

      {/* Same HUD as the other interiors (barn, greenhouse, …): the travel slot
          becomes a "back to farm" button for non-farm locations. */}
      <Hud isFarming={false} location="home" />
    </div>
  );
};
