import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { ButtonPanel, ColorPanel, Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  getHomeImportPlan,
  hasHomeItemsToImport,
  type HomeImportPlan,
} from "features/game/events/landExpansion/importHomeItems";
import {
  MigrationDonePanel,
  MigrationRunningPanel,
  useHomeImport,
  type ImportMode,
} from "./HomeImportMigration";

const _hasHomeItems = (state: MachineState) =>
  hasHomeItemsToImport(state.context.state);

// Migration is a beta-only mechanic.

/**
 * Whether the flow has already opened itself this page load.
 *
 * Module-level rather than component state on purpose: the widget is mounted by
 * the Hud, which remounts on every interior route change, so component state
 * would re-prompt each time the player took the stairs between floors. One
 * prompt per page load, then the bar below is the way back in.
 */
let hasAutoOpened = false;

/**
 * HUD notice shown while the player's old home still holds placed items.
 *
 * Replaces the in-world "Import items" button that used to float above the
 * roof: it lives in the bottom HUD widget column alongside the other notices
 * (see {@link Hud}), so it stacks predictably and never lands on the artwork.
 * Self-hides once the old home is empty.
 *
 * Opens itself the first time a player with un-migrated items walks into the
 * house — the old home is being retired, so this is a prompt rather than
 * something to discover. It stays dismissible.
 */
export const ImportHomeWidget: React.FC = () => {
  const { gameService } = useContext(Context);

  const hasHomeItems = useSelector(gameService, _hasHomeItems);
  // Opened from the initialiser rather than an effect so there's no first frame
  // with the modal shut — same shape as Home's intro and VisitingHud's guide.
  const [open, setOpen] = useState(() => hasHomeItems && !hasAutoOpened);

  useEffect(() => {
    if (open) hasAutoOpened = true;
  }, [open]);

  // The prompt goes away as soon as the old home is empty — which happens
  // *during* a successful import. The flow itself has to outlive that, or the
  // migration would unmount (aborting it) and the player would never see the
  // completion summary. So only the panel is conditional; while the modal is
  // open the flow stays mounted regardless.
  const showPrompt = hasHomeItems;
  if (!showPrompt && !open) return null;

  return (
    <>
      {/* Click target is the whole bar — see HomeUpgradeWidget. */}
      {showPrompt && (
        <ColorPanel
          type="vibrant"
          className="flex items-center w-52 p-1 py-2 cursor-pointer hover:brightness-110"
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
          <div className="pr-1 min-w-0">
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

/** One of the two mutually exclusive destinations on the import modal's first
 *  page. Selecting is separate from confirming, so the player can compare what
 *  each choice would do (the counts below react to the selection) before
 *  committing with the button. */
const ImportOption: React.FC<{
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}> = ({ icon, title, description, selected, onClick }) => (
  <ButtonPanel
    selected={selected}
    onClick={onClick}
    className="flex items-center gap-2 p-1"
  >
    <img
      src={icon}
      className="object-contain shrink-0 ml-1"
      style={{
        width: `${PIXEL_SCALE * 9}px`,
        height: `${PIXEL_SCALE * 9}px`,
      }}
    />
    <div className="min-w-0">
      <p className="text-xs leading-tight">{title}</p>
      <p className="text-xxs leading-tight">{description}</p>
    </div>
  </ButtonPanel>
);

const ImportHomeFlow: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const {
    phase,
    mode,
    start,
    sendToInventory,
    reset,
    digUp,
    progress,
    imported,
    importedCount,
    leftover,
    leftoverCount,
  } = useHomeImport();
  const [plan, setPlan] = useState<HomeImportPlan | null>(null);
  const [choice, setChoice] = useState<ImportMode>("place");

  // Compute the plan up front from a live snapshot so the confirm screen's
  // counts match what the migration will do.
  useEffect(() => {
    if (!open) return;
    reset();
    setChoice("place");
    setPlan(getHomeImportPlan(gameService.getSnapshot().context.state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const willFit = plan?.placements.length ?? 0;
  const wontFit = plan?.unplaced.length ?? 0;
  const total = plan?.total ?? 0;

  // Placing needs somewhere for at least one item to land; sending everything to
  // the inventory only needs there to be something in the old home at all.
  const confirmCount = choice === "place" ? willFit : total;

  return (
    <Modal
      show={open}
      // No backdrop once we start so the player can watch the room fill in.
      backdrop={phase === "idle"}
      onHide={phase === "running" ? undefined : handleClose}
    >
      {phase === "idle" && (
        <CloseButtonPanel onClose={handleClose} title="Import items">
          <div className="p-2 flex flex-col gap-2 mb-1">
            <p className="text-sm">
              {`You still have ${total} item${
                total === 1 ? "" : "s"
              } in your old home. What would you like to do with them?`}
            </p>

            <div className="flex flex-col gap-1">
              <ImportOption
                icon={SUNNYSIDE.icons.hammer}
                title="Place them for me"
                description="Items are moved straight into your new home. The layout will not be preserved."
                selected={choice === "place"}
                onClick={() => setChoice("place")}
              />
              <ImportOption
                icon={SUNNYSIDE.icons.basket}
                title="Send to my inventory"
                description="Items go back into your inventory so you can place them yourself."
                selected={choice === "inventory"}
                onClick={() => setChoice("inventory")}
              />
            </div>

            <div className="flex flex-col gap-1">
              {choice === "place" ? (
                <>
                  <Label type="default">
                    {`${willFit} item${
                      willFit === 1 ? "" : "s"
                    } will be imported`}
                  </Label>
                  {wontFit > 0 && (
                    <Label type="warning">
                      {`${wontFit} item${
                        wontFit === 1 ? " won't" : "s won't"
                      } fit and will stay in your old home`}
                    </Label>
                  )}
                </>
              ) : (
                <Label type="default">
                  {`${total} item${
                    total === 1 ? "" : "s"
                  } will be sent to your inventory`}
                </Label>
              )}
            </div>
          </div>
          <Button
            disabled={confirmCount === 0}
            onClick={choice === "place" ? start : sendToInventory}
          >
            {confirmCount === 0
              ? "Nothing to import"
              : choice === "place"
                ? "Import"
                : "Send to inventory"}
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
          mode={mode}
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
