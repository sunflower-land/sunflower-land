import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { canRestartCaveBatch } from "features/game/types/cavePatch";
import { useNow } from "lib/utils/hooks/useNow";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { CaveMixPicker } from "./CaveMixPicker";
import { CaveBatchGrowing } from "./CaveBatchGrowing";
import { CaveBatchReady } from "./CaveBatchReady";

const _game = (state: MachineState) => state.context.state;

interface Props {
  machineId: string;
  onClose: () => void;
  /** Point the Cave tutorial hand at what starts the first batch. */
  showTutorialHand?: boolean;
}

/**
 * The Myco Bin batch popover, laid out like the Aging Shed: the mix picker
 * (idle, or once the patch is cleared or every Beetle is found), or the
 * batch's progress (growing, or ready and being dug).
 */
export const CaveMachineModal: React.FC<Props> = ({
  machineId,
  onClose,
  showTutorialHand,
}) => {
  const { gameService } = useContext(Context);

  const game = useSelector(gameService, _game);
  const batch = game.cave?.machines[machineId]?.batch;

  const now = useNow({ live: true, autoEndAt: batch?.readyAt });

  // The recipe picker shows once the patch is fully dug, or once every Beetle
  // is found (the player may keep digging or start the next batch).
  const isCleared = !!batch && isCavePatchCleared(batch);
  const canReplace = !!batch && !isCleared && canRestartCaveBatch(batch);
  const isIdle = !batch || isCleared || canReplace;
  const isReady = !!batch && !isIdle && batch.readyAt <= now;
  const isGrowing = !!batch && !isIdle && !isReady;

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel onClose={onClose} container={OuterPanel}>
        {isGrowing && batch && <CaveBatchGrowing batch={batch} now={now} />}
        {isReady && batch && <CaveBatchReady batch={batch} onDig={onClose} />}
        {isIdle && (
          <CaveMixPicker
            machineId={machineId}
            batch={batch}
            onStarted={onClose}
            showTutorialHand={showTutorialHand}
          />
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
