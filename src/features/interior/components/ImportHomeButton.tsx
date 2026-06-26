import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasFeatureAccess } from "lib/flags";
import {
  getHomeImportPlan,
  hasHomeItemsToImport,
  type HomeImportPlan,
} from "features/game/events/landExpansion/importHomeItems";
import {
  MigrationDonePanel,
  MigrationRunningPanel,
  useHomeImport,
} from "./HomeImportMigration";

const _hasHomeItems = (state: MachineState) =>
  hasHomeItemsToImport(state.context.state);

// Migration is a beta-only mechanic.
const _canMigrate = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "HOME_ITEM_MIGRATION");

/**
 * "Import items" button + migration modal, pinned to the top-right of the house
 * layout by the caller (Interior / LevelOne). The button always shows while the
 * old `home` still has any placed items.
 *
 * Confirming runs the shared batched migration (see {@link useHomeImport}) — no
 * bespoke import event; it reuses `collectible.removed` + `collectible.placed`.
 */
export const ImportHomeButton: React.FC = () => {
  const { gameService } = useContext(Context);

  const hasHomeItems = useSelector(gameService, _hasHomeItems);
  const canMigrate = useSelector(gameService, _canMigrate);
  const [open, setOpen] = useState(false);

  if (!hasHomeItems || !canMigrate) return null;

  return (
    <>
      <div style={{ width: `${PIXEL_SCALE * 64}px` }}>
        <Button onClick={() => setOpen(true)}>{"Import items"}</Button>
      </div>
      <ImportHomeFlow open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ImportHomeFlow: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { phase, start, reset, progress, leftover } = useHomeImport();
  const [plan, setPlan] = useState<HomeImportPlan | null>(null);

  // Compute the plan up front from a live snapshot so the confirm screen's
  // counts match what the migration will do.
  useEffect(() => {
    if (!open) return;
    reset();
    setPlan(getHomeImportPlan(gameService.getSnapshot().context.state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const willFit = plan?.placements.length ?? 0;
  const wontFit = plan?.unplaced.length ?? 0;

  return (
    <Modal
      show={open}
      // No backdrop once we start so the player can watch the room fill in.
      backdrop={phase === "idle"}
      onHide={phase === "running" ? undefined : handleClose}
    >
      {phase === "idle" && (
        <CloseButtonPanel onClose={handleClose} title="Import items">
          <div className="p-2 flex flex-col gap-3 mb-1">
            <p className="text-sm">
              {
                "You still have items in your old home. Would you like to instantly import them into your new land? The layout will not be preserved."
              }
            </p>
            <div className="flex flex-col gap-1">
              <Label type="default">
                {`${willFit} item${willFit === 1 ? "" : "s"} will be imported`}
              </Label>
              {wontFit > 0 && (
                <Label type="warning">
                  {`${wontFit} item${
                    wontFit === 1 ? " won't" : "s won't"
                  } fit and will stay in your old home`}
                </Label>
              )}
            </div>
          </div>
          <Button disabled={willFit === 0} onClick={start}>
            {willFit === 0 ? "Nothing to import" : "Import"}
          </Button>
        </CloseButtonPanel>
      )}

      {phase === "running" && (
        <Panel>
          <MigrationRunningPanel progress={progress} />
        </Panel>
      )}

      {phase === "done" && (
        <MigrationDonePanel
          imported={progress.total}
          leftover={leftover}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
};
