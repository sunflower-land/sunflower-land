import React, { useContext, useEffect, useSyncExternalStore } from "react";
import { useSelector } from "@xstate/react";
import { Navigate } from "react-router";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { isCaveBuildingReady } from "features/game/lib/cave";
import { useNow } from "lib/utils/hooks/useNow";
import { CaveMachineModal } from "features/cave/components/CaveMachineModal";
import { CaveExpansionModal } from "features/cave/components/CaveExpansionModal";
import { CaveMerchantModal } from "features/cave/components/CaveMerchantModal";
import { CaveTutorialPopup } from "features/cave/components/CaveTutorial";
import { getCaveTutorialSeen } from "features/cave/lib/onboarding";
import type { GameBridge } from "../bridge/GameBridge";
import {
  acknowledgeCaveGuide,
  openCaveModal,
  readCaveGuide,
} from "../entities/cave/caveGuide";

/**
 * React chrome for the Cave [cave/Cave.tsx]: the panels its in-world pieces
 * open (Myco Bin, merchant, expansion), Gloomwick's tutorial popup, and the
 * redirect home when the Cave isn't there to visit. The room, its furniture
 * and the dig patches are Phaser; a click there names a panel in
 * `bridge.caveUi` and this component renders it.
 */

const _cave = (state: MachineState) => state.context.state.cave;
const _buildings = (state: MachineState) => state.context.state.buildings;

export const CaveUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const { gameService } = useContext(Context);
  const cave = useSelector(gameService, _cave);
  const buildings = useSelector(gameService, _buildings);
  const now = useNow({ live: true });

  const ui = useSyncExternalStore(
    (onChange) => bridge.caveUi.subscribe(onChange),
    () => bridge.caveUi.get(),
  );
  const { modal } = ui;

  // Read the acknowledgements once, into the store both sides share.
  useEffect(() => {
    if (bridge.caveUi.get().tutorialSeen) return;
    bridge.caveUi.set({
      ...bridge.caveUi.get(),
      tutorialSeen: getCaveTutorialSeen(),
    });
  }, [bridge]);
  const tutorialSeen = ui.tutorialSeen;

  const guide = useSelector(
    gameService,
    (state: MachineState) =>
      tutorialSeen
        ? readCaveGuide(state.context.state, now, tutorialSeen, modal)
        : undefined,
    (a, b) =>
      a?.step === b?.step &&
      a?.guiding === b?.guiding &&
      a?.showPopup === b?.showPopup,
  );
  const tutorialStep = guide?.step;
  const showTutorialPopup = !!guide?.showPopup;
  const guiding = guide?.guiding;

  // Reached by URL without access or before the Cave building is placed and
  // finished — send the player back to the farm.
  if (!cave || !isCaveBuildingReady({ buildings }, now)) {
    return <Navigate to="/" replace />;
  }

  const close = () => openCaveModal(bridge, null);

  return (
    <>
      {modal?.name === "expansion" && <CaveExpansionModal onClose={close} />}

      {modal?.name === "merchant" && <CaveMerchantModal onClose={close} />}

      {modal?.name === "machine" && (
        <CaveMachineModal
          machineId={modal.machineId}
          onClose={close}
          showTutorialHand={guiding === "start-batch"}
        />
      )}

      {showTutorialPopup && tutorialStep && (
        <CaveTutorialPopup
          step={tutorialStep}
          onClose={() => acknowledgeCaveGuide(bridge, tutorialStep)}
        />
      )}
    </>
  );
};
