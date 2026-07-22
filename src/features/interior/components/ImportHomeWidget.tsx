import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { ColorPanel, Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
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
 * HUD notice shown while the player's old home still holds placed items.
 *
 * Replaces the in-world "Import items" button that used to float above the
 * roof: it lives in the bottom HUD widget column alongside the other notices
 * (see {@link Hud}), so it stacks predictably and never lands on the artwork.
 * Self-hides once the old home is empty.
 */
export const ImportHomeWidget: React.FC = () => {
  const { gameService } = useContext(Context);

  const hasHomeItems = useSelector(gameService, _hasHomeItems);
  const canMigrate = useSelector(gameService, _canMigrate);
  const [open, setOpen] = useState(false);

  // The prompt goes away as soon as the old home is empty — which happens
  // *during* a successful import. The flow itself has to outlive that, or the
  // migration would unmount (aborting it) and the player would never see the
  // completion summary. So only the panel is conditional; while the modal is
  // open the flow stays mounted regardless.
  const showPrompt = hasHomeItems && canMigrate;
  if (!showPrompt && !open) return null;

  return (
    <>
      {showPrompt && (
        <ColorPanel
          type="vibrant"
          className="flex items-center p-1 py-2 cursor-pointer hover:brightness-110"
          onClick={() => setOpen(true)}
        >
          <img
            src={SUNNYSIDE.icons.basket}
            className="object-contain mr-2 ml-1 shrink-0"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              height: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="pr-1">
            <p className="text-xs leading-tight">
              {"Some items are in your old home."}
            </p>
            <p className="text-xxs underline">{"Import them now."}</p>
          </div>
        </ColorPanel>
      )}

      <ImportHomeFlow open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ImportHomeFlow: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const {
    phase,
    start,
    reset,
    digUp,
    progress,
    imported,
    importedCount,
    leftover,
    leftoverCount,
  } = useHomeImport();
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
                "You still have items in your old home. Would you like to instantly import them into your new home? The layout will not be preserved."
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
          imported={imported}
          importedCount={importedCount}
          leftover={leftover}
          leftoverCount={leftoverCount}
          onDigUp={digUp}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
};
