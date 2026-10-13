import React, { useContext, useLayoutEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { Navigate, useNavigate } from "react-router";
import ScrollContainer from "react-indiana-drag-scroll";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { HudContainer } from "components/ui/HudContainer";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { isCaveBuildingReady } from "features/game/lib/cave";
import { useNow } from "lib/utils/hooks/useNow";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
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
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { getNextCaveTier } from "features/game/types/caveTiers";
import { CAVE_MERCHANT_TIER } from "features/game/types/caveMerchant";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import { CaveMachineModal } from "./components/CaveMachineModal";
import { CaveExpansionModal } from "./components/CaveExpansionModal";
import {
  CAVE_MERCHANT_PARTS,
  CaveMerchantModal,
} from "./components/CaveMerchantModal";
import { CavePatch } from "./components/CavePatch";
import { getCaveRoomImage } from "./lib/caveImages";
import { Hud } from "features/island/hud/Hud";

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
  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
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
  const merchantOpen = cave.tier >= CAVE_MERCHANT_TIER;

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

              {/* The ladder out. A native button so keyboard users can leave. */}
              <button
                type="button"
                aria-label={t("exit")}
                className="absolute cursor-pointer bg-transparent border-0 p-0 hover:img-highlight"
                style={tileStyle(CAVE_LADDER)}
                onClick={() => navigate("/")}
              />

              {/* Goblin Cave Merchant beside the entrance arch, under his sign. A
              native button so keyboard users can reach him. */}
              {merchantOpen && (
                <button
                  type="button"
                  aria-label={t("cave.merchant.title")}
                  className="absolute cursor-pointer bg-transparent border-0 p-0"
                  style={{
                    left: `${(CAVE_MERCHANT_ALCOVE.x + 5) * GRID_WIDTH_PX}px`,
                    top: `${(CAVE_MERCHANT_ALCOVE.y + 2) * GRID_WIDTH_PX}px`,
                  }}
                  onClick={() => setShowMerchant(true)}
                >
                  <NPCPlaceable parts={CAVE_MERCHANT_PARTS} />
                </button>
              )}

              {slots.map((id) => {
                const slot = CAVE_SLOTS[id];
                const batch = cave.machines[String(id)]?.batch;
                const growing = !!batch && batch.readyAt > now;
                const ready =
                  !!batch && batch.readyAt <= now && !isCavePatchCleared(batch);

                return (
                  <React.Fragment key={`slot-${id}`}>
                    {/* The Myco Bin sign the room draws — opens the batch popover. */}
                    <button
                      type="button"
                      aria-label={t("cave.machine", { id })}
                      className="absolute cursor-pointer bg-transparent border-0 p-0 hover:img-highlight"
                      style={tileStyle(slot.sign)}
                      onClick={() => setSelectedMachine(String(id))}
                    >
                      {/* Status above the sign. */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 whitespace-nowrap pointer-events-none">
                        {growing && batch && (
                          <Label
                            type="warning"
                            icon={SUNNYSIDE.icons.stopwatch}
                          >
                            {secondsToString(
                              Math.max(0, (batch.readyAt - now) / 1000),
                              { length: "short" },
                            )}
                          </Label>
                        )}
                        {ready && (
                          <Label type="success">{t("cave.batch.ready")}</Label>
                        )}
                      </div>
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
                        batch={batch}
                        now={now}
                        hasShovel={shovels > 0}
                        hasDrill={drills > 0}
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
                </button>
              )}
            </div>
          </div>
        </div>
      </ScrollContainer>

      <HudContainer>
        {/* Tools left to dig with — mid-left, clear of the balances and the
            HUD's right-hand column. */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-start gap-1">
          <Label
            type={shovels > 0 ? "default" : "danger"}
            icon={ITEM_DETAILS["Sand Shovel"].image}
          >
            {shovels}
          </Label>
          <Label
            type={drills > 0 ? "default" : "danger"}
            icon={ITEM_DETAILS["Sand Drill"].image}
          >
            {drills}
          </Label>
        </div>
      </HudContainer>

      {showExpansion && (
        <CaveExpansionModal onClose={() => setShowExpansion(false)} />
      )}

      {showMerchant && merchantOpen && (
        <CaveMerchantModal onClose={() => setShowMerchant(false)} />
      )}

      {selectedMachine && (
        <CaveMachineModal
          machineId={selectedMachine}
          onClose={() => setSelectedMachine(undefined)}
        />
      )}

      {/* Same HUD as the other interiors (barn, greenhouse, …): the travel slot
          becomes a "back to farm" button for non-farm locations. */}
      <Hud isFarming={false} location="home" />
    </div>
  );
};
