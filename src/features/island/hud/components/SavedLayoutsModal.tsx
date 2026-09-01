import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { TextInput } from "components/ui/TextInput";
import { Context } from "features/game/GameProvider";
import {
  MAX_LAYOUT_NAME_LENGTH,
  MAX_SAVED_LAYOUTS,
  type GameState,
  type SavedLayout,
} from "features/game/types/game";
import { snapshotFarm } from "features/game/events/landExpansion/lib/layouts";
import type { MachineState } from "features/game/lib/gameMachine";
import { loadLayouts } from "features/game/actions/loadLayouts";
import {
  type LayoutsData,
  applyLayoutEffect,
  createLayoutEffect,
  deleteLayoutEffect,
  editLayoutEffect,
  flushPendingActions,
} from "features/game/actions/layoutEffects";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import chestIcon from "assets/icons/chest.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { LayoutPreview } from "./LayoutPreview";

interface Props {
  show: boolean;
  onHide: () => void;
}

type Mode =
  | "idle"
  | "rename"
  | "confirmApply"
  | "confirmOverwrite"
  | "confirmDelete"
  | "confirmAscension";

const _state = (state: MachineState): GameState => state.context.state;

export const SavedLayoutsModal: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _state);

  // Layouts live in their own collection server-side and never ride the
  // session/autosave payloads: fetched lazily on first open, then kept in
  // sync from each layout effect's response. `undefined` = not loaded yet.
  const [layoutsData, setLayoutsData] = useState<LayoutsData | undefined>();
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  // One effect in flight at a time — buttons disable while it runs.
  const [busy, setBusy] = useState(false);

  const layouts = layoutsData?.layouts ?? [];
  const ascensionLayoutId = layoutsData?.ascensionLayoutId;

  // 0 = current farm; 1..n = saved layout at index (selected - 1).
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [renameDraft, setRenameDraft] = useState("");
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (!show || layoutsData) return;

    let cancelled = false;
    setLoadFailed(false);

    const token = gameService.getSnapshot().context.rawToken as string;

    loadLayouts({ token })
      .then((loaded) => {
        if (cancelled) return;
        setLayoutsData(loaded);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, layoutsData, loadAttempt]);

  const flash = (message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const effectError = (e: unknown): string => {
    const code = e instanceof Error ? e.message : "";

    if (code === "LAYOUT_CAP_REACHED") {
      return t("savedLayouts.cap", { max: MAX_SAVED_LAYOUTS });
    }

    return t("savedLayouts.actionFailed");
  };

  /**
   * Shared effect runner: flushes queued autosave actions first (server
   * snapshots/applies against the farm it loads), posts the effect, and
   * refreshes the layouts list from its response.
   */
  const runEffect = async (
    fn: (args: { farmId: number; token: string }) => Promise<LayoutsData>,
    onSuccess?: (data: LayoutsData) => void,
  ) => {
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await flushPendingActions(gameService);

      const { farmId, rawToken } = gameService.getSnapshot().context;
      const data = await fn({
        farmId: farmId as number,
        token: rawToken as string,
      });

      setLayoutsData({
        layouts: data.layouts,
        ascensionLayoutId: data.ascensionLayoutId,
      });
      onSuccess?.(data);
    } catch (e) {
      setError(effectError(e));
    } finally {
      setBusy(false);
    }
  };

  const currentSnapshot = useMemo(() => snapshotFarm(game), [game]);

  const isCurrent = selected === 0;
  const layout = isCurrent ? undefined : layouts[selected - 1];
  // Selection can go stale after a delete; fall back to the current farm.
  const showCurrent = isCurrent || !layout;
  const previewLayout = showCurrent ? currentSnapshot : layout!;
  const atCap = layouts.length >= MAX_SAVED_LAYOUTS;
  const hasAscensionLayout = !!ascensionLayoutId;

  // Land the layout was saved on (biome + size) — a layout saved on a bigger
  // farm than the player has now will skip the items that fall off the land.
  const previewLand = previewLayout.land;
  const currentExpansions = game.inventory["Basic Land"]?.toNumber() ?? 3;
  const savedOnLargerFarm =
    !showCurrent && !!previewLand && previewLand.expansions > currentExpansions;

  const close = () => {
    setSelected(0);
    setMode("idle");
    setRenameDraft("");
    setNewName("");
    setError(null);
    onHide();
  };

  const pick = (i: number) => {
    setSelected(i);
    setMode("idle");
    setError(null);
  };

  const saveNew = () => {
    const name = newName.trim();
    // Name is optional — a blank name becomes "Layout N" server-side.
    runEffect(
      (args) =>
        createLayoutEffect({ ...args, state: game, ...(name ? { name } : {}) }),
      (data) => {
        setNewName("");
        setSelected(data.layouts.length);
        flash(
          t("savedLayouts.toastSaved", {
            name: data.layouts[data.layouts.length - 1].name,
          }),
        );
      },
    );
  };

  const setAscension = () => {
    // Mark the selected saved layout as the post-ascension re-apply target,
    // or — on the current-farm view — save the live farm as a new (normal,
    // cap-counted) layout and mark that.
    runEffect(
      (args) =>
        showCurrent
          ? createLayoutEffect({ ...args, state: game, markAscension: true })
          : editLayoutEffect({
              ...args,
              state: game,
              id: layout!.id,
              markAscension: true,
            }),
      () => {
        setMode("idle");
        flash(t("savedLayouts.toastAscensionSaved"));
      },
    );
  };

  const doRename = () => {
    const name = renameDraft.trim();
    if (!name || !layout) {
      setError(t("savedLayouts.nameRequired"));
      return;
    }
    runEffect(
      (args) => editLayoutEffect({ ...args, state: game, id: layout.id, name }),
      () => {
        setMode("idle");
        flash(t("savedLayouts.toastRenamed"));
      },
    );
  };

  const confirmYes = () => {
    if (!layout) return;

    if (mode === "confirmApply") {
      // The apply happens server-side; the effect returns the rearranged
      // farm (pushed into the machine) plus how many positions could not be
      // filled (blocked, or item not owned) for the toast.
      runEffect(
        async (args) => {
          const { gameState, applied, skipped, noInventory, ...data } =
            await applyLayoutEffect({
              ...args,
              id: layout.id,
              state: gameService.getSnapshot().context.state,
            });

          gameService.send({ type: "LAYOUT_APPLIED", state: gameState });

          const notPlaced = skipped + noInventory;
          flash(
            notPlaced > 0
              ? t("savedLayouts.toastAppliedPartial", { skipped: notPlaced })
              : t("savedLayouts.toastApplied"),
          );

          return data;
        },
        () => setMode("idle"),
      );
    } else if (mode === "confirmOverwrite") {
      runEffect(
        (args) =>
          editLayoutEffect({
            ...args,
            state: game,
            id: layout.id,
            updateSnapshot: true,
          }),
        () => {
          setMode("idle");
          flash(t("savedLayouts.toastOverwritten"));
        },
      );
    } else if (mode === "confirmDelete") {
      runEffect(
        (args) => deleteLayoutEffect({ ...args, id: layout.id }),
        () => {
          setSelected(0);
          setMode("idle");
          flash(t("savedLayouts.toastDeleted"));
        },
      );
    }
  };

  const card = (
    name: string,
    preview: Pick<SavedLayout, "collectibles" | "buildings" | "resources">,
    index: number,
    meta: React.ReactNode,
  ) => (
    <ButtonPanel
      key={index}
      variant="card"
      selected={selected === index}
      onClick={() => pick(index)}
      className="flex items-center gap-2 !p-1"
    >
      <div className="flex-none" style={{ width: 44 }}>
        <LayoutPreview layout={preview} game={game} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs truncate">{name}</span>
        {meta}
      </div>
    </ButtonPanel>
  );

  const confirmPanel = () => {
    const name = layout?.name ?? "";
    const isAscension = mode === "confirmAscension";
    const message = isAscension
      ? showCurrent
        ? hasAscensionLayout
          ? t("savedLayouts.confirmAscensionReplace")
          : t("savedLayouts.confirmAscension")
        : hasAscensionLayout
          ? t("savedLayouts.confirmAscensionReplaceFromLayout", { name })
          : t("savedLayouts.confirmAscensionFromLayout", { name })
      : mode === "confirmApply"
        ? t("savedLayouts.confirmApply", { name })
        : mode === "confirmOverwrite"
          ? t("savedLayouts.confirmOverwrite", { name })
          : t("savedLayouts.confirmDelete", { name });
    const label = isAscension
      ? t("savedLayouts.setAscension")
      : mode === "confirmApply"
        ? t("savedLayouts.applyConfirm")
        : mode === "confirmOverwrite"
          ? t("savedLayouts.overwrite")
          : t("savedLayouts.delete");

    return (
      <InnerPanel className="p-2 flex flex-col gap-2">
        <span className="text-xs">{message}</span>
        <div className="flex gap-1">
          <Button disabled={busy} onClick={() => setMode("idle")}>
            {t("cancel")}
          </Button>
          <Button
            disabled={busy}
            onClick={isAscension ? setAscension : confirmYes}
          >
            {label}
          </Button>
        </div>
      </InnerPanel>
    );
  };

  const detail = () => {
    if (mode === "rename" && layout) {
      return (
        <div className="flex flex-col gap-2">
          <TextInput
            value={renameDraft}
            onValueChange={setRenameDraft}
            maxLength={MAX_LAYOUT_NAME_LENGTH}
            placeholder={t("savedLayouts.namePlaceholder")}
          />
          <div className="flex gap-1">
            <Button disabled={busy} onClick={() => setMode("idle")}>
              {t("cancel")}
            </Button>
            <Button disabled={busy} onClick={doRename}>
              {t("savedLayouts.saveName")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm truncate">
            {showCurrent ? t("savedLayouts.currentFarm") : layout!.name}
          </span>
          <span className="text-xxs whitespace-nowrap">
            {showCurrent
              ? t("savedLayouts.activeNow")
              : t("savedLayouts.updated", {
                  date: new Date(layout!.updatedAt).toLocaleDateString(),
                })}
          </span>
        </div>

        {previewLand && (
          <div className="flex flex-wrap items-center gap-1">
            <Label
              type="default"
              icon={ITEM_DETAILS[getCurrentBiome(previewLand.island)].image}
            >
              {getCurrentBiome(previewLand.island)}
            </Label>
            <Label type="default" icon={ITEM_DETAILS["Basic Land"].image}>
              {t("savedLayouts.expansions", { count: previewLand.expansions })}
            </Label>
            {savedOnLargerFarm && (
              <Label type="warning">
                {t("savedLayouts.savedOnLargerFarm")}
              </Label>
            )}
          </div>
        )}

        {showCurrent ? (
          mode === "confirmAscension" ? (
            confirmPanel()
          ) : (
            <div className="flex flex-col gap-2">
              <Label type="info">{t("savedLayouts.current")}</Label>
              <span className="text-xs">
                {t("savedLayouts.currentDescription")}
              </span>
              {atCap ? (
                <InnerPanel className="p-2">
                  <span className="text-xs">
                    {t("savedLayouts.cap", { max: MAX_SAVED_LAYOUTS })}
                  </span>
                </InnerPanel>
              ) : (
                <>
                  <TextInput
                    value={newName}
                    onValueChange={setNewName}
                    maxLength={MAX_LAYOUT_NAME_LENGTH}
                    placeholder={t("savedLayouts.nameThis")}
                  />
                  <Button disabled={busy} onClick={saveNew}>
                    <div className="flex items-center justify-center gap-1">
                      <img src={chestIcon} className="w-4" />
                      <span>{t("savedLayouts.saveAsNew")}</span>
                    </div>
                  </Button>
                  {/* Saving the current farm as the ascension layout creates
                      a normal cap-counted layout, so it is only offered while
                      a slot is free. */}
                  <Button
                    disabled={busy}
                    onClick={() => setMode("confirmAscension")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <img src={SUNNYSIDE.icons.stopwatch} className="w-4" />
                      <span>{t("savedLayouts.setAscension")}</span>
                    </div>
                  </Button>
                </>
              )}
            </div>
          )
        ) : mode === "idle" ? (
          <div className="flex flex-col gap-2">
            <Button disabled={busy} onClick={() => setMode("confirmApply")}>
              <div className="flex items-center justify-center gap-1">
                <img src={SUNNYSIDE.icons.confirm} className="w-4" />
                <span>{t("savedLayouts.apply")}</span>
              </div>
            </Button>
            <div className="flex gap-1">
              <Button disabled={busy} onClick={() => setMode("rename")}>
                {t("savedLayouts.rename")}
              </Button>
              <Button
                disabled={busy}
                onClick={() => setMode("confirmOverwrite")}
              >
                {t("savedLayouts.overwrite")}
              </Button>
              <Button disabled={busy} onClick={() => setMode("confirmDelete")}>
                {t("savedLayouts.delete")}
              </Button>
            </div>
            {layout!.id === ascensionLayoutId ? (
              <Label type="formula" icon={SUNNYSIDE.icons.stopwatch}>
                {t("savedLayouts.ascensionBadge")}
              </Label>
            ) : (
              <Button
                disabled={busy}
                onClick={() => setMode("confirmAscension")}
              >
                <div className="flex items-center justify-center gap-1">
                  <img src={SUNNYSIDE.icons.stopwatch} className="w-4" />
                  <span>{t("savedLayouts.setAscension")}</span>
                </div>
              </Button>
            )}
          </div>
        ) : (
          confirmPanel()
        )}
      </div>
    );
  };

  if (!layoutsData) {
    return (
      <Modal show={show} onHide={close} size="lg">
        <CloseButtonPanel title={t("savedLayouts.title")} onClose={close}>
          <div className="flex flex-col items-center gap-2 p-2">
            {loadFailed ? (
              <>
                <Label type="danger">{t("savedLayouts.loadFailed")}</Label>
                <Button
                  onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                >
                  {t("retry")}
                </Button>
              </>
            ) : (
              <span className="text-sm loading">{t("loading")}</span>
            )}
          </div>
        </CloseButtonPanel>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={close} size="lg">
      <CloseButtonPanel title={t("savedLayouts.title")} onClose={close}>
        <div className="flex flex-col sm:flex-row gap-2 p-1">
          {/* LEFT: layout list */}
          <div className="sm:w-[42%] flex-none flex flex-col gap-1">
            <span className="text-xxs pl-0.5">
              {t("savedLayouts.slots", {
                count: layouts.length,
                max: MAX_SAVED_LAYOUTS,
              })}
            </span>

            {card(
              t("savedLayouts.currentFarm"),
              currentSnapshot,
              0,
              <Label type="info" className="text-xxs">
                {t("savedLayouts.current")}
              </Label>,
            )}

            {layouts.map((l, i) =>
              card(
                l.name,
                l,
                i + 1,
                <span className="text-xxs">
                  {t("savedLayouts.updated", {
                    date: new Date(l.updatedAt).toLocaleDateString(),
                  })}
                </span>,
              ),
            )}

            <button
              type="button"
              className="flex items-center justify-center gap-1 border-2 border-dashed rounded-md py-1.5 cursor-pointer w-full bg-transparent"
              style={{ borderColor: "#9a6a47" }}
              onClick={() => pick(0)}
            >
              <span className="text-sm leading-none">{"＋"}</span>
              <span className="text-xxs">
                {t("savedLayouts.saveCurrentFarm")}
              </span>
            </button>
          </div>

          {/* RIGHT: detail */}
          <div className="flex-1 min-w-0 flex flex-col gap-2 relative">
            {toast && (
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-10">
                <Label type="success">{toast}</Label>
              </div>
            )}

            <InnerPanel className="p-1">
              <LayoutPreview layout={previewLayout} game={game} />
            </InnerPanel>

            {error && (
              <Label type="danger" className="whitespace-normal">
                {error}
              </Label>
            )}

            {detail()}
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
