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
import { produce } from "immer";
import {
  applyFarmLayout,
  defaultLayoutName,
  snapshotFarm,
} from "features/game/events/landExpansion/lib/layouts";
import type { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import chestIcon from "assets/icons/chest.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
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
  const now = useNow();
  const layouts = game.layouts ?? [];

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

  const flash = (message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const currentSnapshot = useMemo(() => snapshotFarm(game), [game]);

  const isCurrent = selected === 0;
  const layout = isCurrent ? undefined : layouts[selected - 1];
  // Selection can go stale after a delete; fall back to the current farm.
  const showCurrent = isCurrent || !layout;
  const previewLayout = showCurrent ? currentSnapshot : layout!;
  const atCap = layouts.length >= MAX_SAVED_LAYOUTS;
  const hasAscensionLayout = layouts.some((l) => l.auto);

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
    gameService.send({ type: "layout.saved", ...(name ? { name } : {}) });
    setNewName("");
    setError(null);
    setSelected(layouts.length + 1);
    flash(
      t("savedLayouts.toastSaved", {
        name: name || defaultLayoutName(layouts),
      }),
    );
  };

  const setAscension = () => {
    // The snapshot (trimmed to 30 lands, land count stamped to 30) is built
    // server-side. Promote the selected saved layout, or — on the current-farm
    // view — snapshot the live farm.
    gameService.send({
      type: "layout.ascensionSaved",
      ...(showCurrent ? {} : { layoutId: selected - 1 }),
    });
    setMode("idle");
    flash(t("savedLayouts.toastAscensionSaved"));
  };

  const doRename = () => {
    const name = renameDraft.trim();
    if (!name || !layout) {
      setError(t("savedLayouts.nameRequired"));
      return;
    }
    gameService.send({ type: "layout.renamed", layoutId: selected - 1, name });
    setMode("idle");
    setError(null);
    flash(t("savedLayouts.toastRenamed"));
  };

  const confirmYes = () => {
    const layoutId = selected - 1;
    if (mode === "confirmApply") {
      // Best-effort apply never throws — run it on a throwaway draft just to
      // learn how many layout positions won't be filled (blocked, or no item
      // owned), so the toast can say so.
      let notPlaced = 0;
      produce(game, (draft) => {
        const result = applyFarmLayout(draft, layouts[layoutId], now);
        notPlaced = result.skipped + result.noInventory;
      });
      gameService.send({ type: "layout.applied", layoutId });
      setMode("idle");
      flash(
        notPlaced > 0
          ? t("savedLayouts.toastAppliedPartial", { skipped: notPlaced })
          : t("savedLayouts.toastApplied"),
      );
    } else if (mode === "confirmOverwrite") {
      gameService.send({
        type: "layout.saved",
        name: layouts[layoutId].name,
        layoutId,
      });
      setMode("idle");
      flash(t("savedLayouts.toastOverwritten"));
    } else if (mode === "confirmDelete") {
      gameService.send({ type: "layout.deleted", layoutId });
      setSelected(0);
      setMode("idle");
      flash(t("savedLayouts.toastDeleted"));
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
          <Button onClick={() => setMode("idle")}>{t("cancel")}</Button>
          <Button onClick={isAscension ? setAscension : confirmYes}>
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
            <Button onClick={() => setMode("idle")}>{t("cancel")}</Button>
            <Button onClick={doRename}>{t("savedLayouts.saveName")}</Button>
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
                  <Button onClick={saveNew}>
                    <div className="flex items-center justify-center gap-1">
                      <img src={chestIcon} className="w-4" />
                      <span>{t("savedLayouts.saveAsNew")}</span>
                    </div>
                  </Button>
                </>
              )}
              {/* The Ascension Layout is exempt from the layout cap, so this
                  stays available even when the manual slots are full. */}
              <Button onClick={() => setMode("confirmAscension")}>
                <div className="flex items-center justify-center gap-1">
                  <img src={SUNNYSIDE.icons.stopwatch} className="w-4" />
                  <span>{t("savedLayouts.setAscension")}</span>
                </div>
              </Button>
            </div>
          )
        ) : mode === "idle" ? (
          <div className="flex flex-col gap-2">
            <Button onClick={() => setMode("confirmApply")}>
              <div className="flex items-center justify-center gap-1">
                <img src={SUNNYSIDE.icons.confirm} className="w-4" />
                <span>{t("savedLayouts.apply")}</span>
              </div>
            </Button>
            {/* The Ascension Layout is protected: it can only be applied — not
                renamed, overwritten, deleted, or promoted onto itself (those all
                throw server-side). Manual layouts get the full set of actions. */}
            {layout!.auto ? (
              <span className="text-xxs">
                {t("savedLayouts.ascensionProtected")}
              </span>
            ) : (
              <>
                <div className="flex gap-1">
                  <Button onClick={() => setMode("rename")}>
                    {t("savedLayouts.rename")}
                  </Button>
                  <Button onClick={() => setMode("confirmOverwrite")}>
                    {t("savedLayouts.overwrite")}
                  </Button>
                  <Button onClick={() => setMode("confirmDelete")}>
                    {t("savedLayouts.delete")}
                  </Button>
                </div>
                <Button onClick={() => setMode("confirmAscension")}>
                  <div className="flex items-center justify-center gap-1">
                    <img src={SUNNYSIDE.icons.stopwatch} className="w-4" />
                    <span>{t("savedLayouts.setAscension")}</span>
                  </div>
                </Button>
              </>
            )}
          </div>
        ) : (
          confirmPanel()
        )}
      </div>
    );
  };

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
