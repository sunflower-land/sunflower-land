import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getObjectEntries } from "lib/object";
import { hasFeatureAccess } from "lib/flags";
import type { GameState } from "features/game/types/game";
import { hasHomeItemsToImport } from "features/game/events/landExpansion/importHomeItems";
import {
  MigrationDonePanel,
  MigrationRunningPanel,
  useHomeImport,
} from "./HomeImportMigration";

const hasPlaced = (collectibles: GameState["home"]["collectibles"]) =>
  getObjectEntries(collectibles).some(([, items]) =>
    (items ?? []).some((item) => !!item.coordinates),
  );

// Show the migrate prompt only to beta testers who still have old-home items.
const _canMigrateHomeItems = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "HOME_ITEM_MIGRATION") &&
  hasHomeItemsToImport(state.context.state);

/** True when neither interior floor has any placed collectible. */
const isInteriorEmpty = (state: GameState) => {
  const ground = hasPlaced(state.interior.ground.collectibles);
  const levelOne = state.interior.level_one
    ? hasPlaced(state.interior.level_one.collectibles)
    : false;
  return !ground && !levelOne;
};

/**
 * One-off welcome shown when the player enters an empty interior. Introduces the
 * feature and, if they still have items in their old home, offers to migrate
 * them across (reusing the shared batched migration). Mounted by Interior.tsx.
 */
export const InteriorWelcomeModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const { phase, start, reset, progress, leftover } = useHomeImport();

  const showMigrate = useSelector(gameService, _canMigrateHomeItems);

  // Capture emptiness at mount (entry) so placing items mid-session doesn't
  // re-trigger the welcome; it only ever shows on a fresh, empty entry.
  const [open, setOpen] = useState(() =>
    isInteriorEmpty(gameService.getSnapshot().context.state),
  );

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Modal
      show={open}
      // No backdrop once the migration starts so the room fills in behind it.
      backdrop={phase === "idle"}
      onHide={phase === "running" ? undefined : handleClose}
    >
      {phase === "idle" && (
        <CloseButtonPanel onClose={handleClose} title="Welcome home">
          <div className="p-2 flex flex-col gap-2 mb-1">
            <p className="text-sm">
              {
                "Welcome to the new interior. Here you can place items and upgrade to new rooms as you explore new islands."
              }
            </p>
            <p className="text-xs italic">
              {
                "Decorate each floor however you like — it's your own cozy corner of the farm."
              }
            </p>

            {showMigrate && (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs">
                  {
                    "You have items in your old home. Would you like to move them across?"
                  }
                </p>
              </div>
            )}
          </div>

          {showMigrate ? (
            <div className="flex space-x-1">
              <Button onClick={handleClose}>{"Maybe later"}</Button>
              <Button onClick={start}>{"Move them across"}</Button>
            </div>
          ) : (
            <Button onClick={handleClose}>{"Let's go"}</Button>
          )}
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
