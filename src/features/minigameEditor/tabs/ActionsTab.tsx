import React, { useCallback, useState } from "react";
import { InnerPanel, Panel, ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { SUNNYSIDE } from "assets/sunnyside";
import type { ActionForm, ActionType, EditorFormState } from "../lib/types";
import {
  ACTION_TYPE_OPTIONS,
  EMPTY_MINT_ROW,
  EMPTY_BURN_ROW,
  EMPTY_CUSTOM_MINT_ROW,
  EMPTY_CUSTOM_BURN_ROW,
  getActionTypeLabel,
} from "../lib/types";
import { ShopCard } from "../components/ShopCard";
import { CustomCard } from "../components/CustomCard";
import { ProduceCard } from "../components/ProduceCard";
import { PIXEL_SCALE } from "features/game/lib/constants";

/** 1-based index into the saved action id sequence (produce + linked collect uses two slots). */
function ruleSequenceStart(actions: ActionForm[], beforeIndex: number): number {
  let n = 1;
  for (let i = 0; i < beforeIndex; i++) {
    const p = actions[i];
    const hasLinked =
      p.actionType === "produce" &&
      (p.linkedCollectMint?.some((m) => m.token.trim()) ?? false);
    n += hasLinked ? 2 : 1;
  }
  return n;
}

export const ActionsTab: React.FC<{
  form: EditorFormState;
  onUpdateAction: (index: number, next: Partial<ActionForm>) => void;
  onAddAction: (action: ActionForm) => void;
  onDeleteAction: (index: number) => void;
}> = ({ form, onUpdateAction, onAddAction, onDeleteAction }) => {
  const [showActionTypeModal, setShowActionTypeModal] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<number | null>(null);
  const hasMinigameUrl = form.playUrl.trim().length > 0;

  const itemKeys = form.items
    .filter((item) => item.id !== undefined && !item.deleted)
    .map((item) => String(item.id));

  const generatorItemKeys = form.items
    .filter(
      (item) => item.id !== undefined && !item.deleted && item.generator,
    )
    .map((item) => String(item.id));

  const getItemOptionLabel = useCallback(
    (idStr: string) => {
      const item = form.items.find(
        (i) => String(i.id) === idStr && !i.deleted,
      );
      if (!item || item.id === undefined) return idStr;
      const name = item.name.trim() || "Unnamed";
      return `${name} - #${item.id}`;
    },
    [form.items],
  );

  const addActionOfType = (type: ActionType) => {
    if (type === "custom" && !hasMinigameUrl) return;

    const base: ActionForm = {
      actionType: type,
      id: "",
      showInShop: true,
      shopPurchaseLimit: 0,
      mint: [],
      burn: [],
      require: [],
      requireBelow: [],
      requireAbsent: [],
      produce: [],
      collect: [],
      customMint: [],
      customBurn: [],
      customDailyUsesCap: 0,
    };

    switch (type) {
      case "shop":
        base.mint = [{ ...EMPTY_MINT_ROW }];
        base.burn = [{ ...EMPTY_BURN_ROW }];
        break;
      case "custom":
        base.customMint = [{ ...EMPTY_CUSTOM_MINT_ROW }];
        base.customBurn = [{ ...EMPTY_CUSTOM_BURN_ROW }];
        base.require = [{ token: "", amount: 1 }];
        break;
      case "produce":
        base.produce = [
          { token: "", msToComplete: 0, limit: undefined, requires: "" },
        ];
        base.burn = [{ ...EMPTY_BURN_ROW }];
        base.linkedCollectMint = [{ ...EMPTY_MINT_ROW }];
        break;
    }

    onAddAction(base);
    setShowActionTypeModal(false);
  };

  const confirmDeleteAction = () => {
    if (actionToDelete === null) return;
    onDeleteAction(actionToDelete);
    setActionToDelete(null);
  };

  const renderCard = (action: ActionForm, index: number) => {
    const ruleSeq = ruleSequenceStart(form.actions, index);
    const commonProps = {
      action,
      index,
      ruleSequenceStart: ruleSeq,
      itemKeys,
      generatorItemKeys,
      getItemOptionLabel,
      onUpdate: (next: Partial<ActionForm>) => onUpdateAction(index, next),
      onDelete: () => setActionToDelete(index),
    };

    switch (action.actionType) {
      case "shop":
        return <ShopCard key={`action-${index}`} {...commonProps} />;
      case "custom":
        return <CustomCard key={`action-${index}`} {...commonProps} />;
      case "produce":
        return <ProduceCard key={`action-${index}`} {...commonProps} />;
      default:
        return (
          <InnerPanel key={`action-${index}`} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label type="default">
                {`${getActionTypeLabel(action.actionType)} - #${String(ruleSequenceStart(form.actions, index)).padStart(3, "0")}`}
              </Label>
              <img
                src={SUNNYSIDE.icons.close}
                className="cursor-pointer hover:brightness-75"
                onClick={() => setActionToDelete(index)}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  imageRendering: "pixelated",
                }}
              />
            </div>
            <p className="text-xs opacity-50 italic">
              {getActionTypeLabel(action.actionType)} editor coming soon...
            </p>
          </InnerPanel>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Action type selection modal */}
      <Modal
        show={showActionTypeModal}
        onHide={() => setShowActionTypeModal(false)}
      >
        <Panel className="p-3 space-y-3">
          <span className="text-sm">What rule would you like to create?</span>
          {!hasMinigameUrl ? (
            <p className="text-xs text-[#674544]/80">
              Custom rules are for iframe minigames — set a minigame URL on the
              Basics tab first.
            </p>
          ) : null}
          <div className="space-y-2">
            {ACTION_TYPE_OPTIONS.map((opt) => {
              const customLocked = opt.type === "custom" && !hasMinigameUrl;
              return (
                <ButtonPanel
                  key={opt.type}
                  disabled={customLocked}
                  title={
                    customLocked
                      ? "Add a minigame URL on the Basics tab to use Custom rules."
                      : undefined
                  }
                  onClick={() => addActionOfType(opt.type)}
                  className="p-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={SUNNYSIDE.icons[opt.iconKey]}
                      className="w-6 shrink-0"
                      style={{ imageRendering: "pixelated" }}
                      alt=""
                    />
                    <span className="text-sm flex-1 text-center">
                      {opt.label}
                    </span>
                    {customLocked ? (
                      <img
                        src={SUNNYSIDE.icons.lock}
                        className="w-5 shrink-0"
                        style={{ imageRendering: "pixelated" }}
                        alt=""
                      />
                    ) : null}
                  </div>
                </ButtonPanel>
              );
            })}
          </div>
        </Panel>
      </Modal>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        show={actionToDelete !== null}
        onHide={() => setActionToDelete(null)}
        messages={[
          "Are you sure you want to remove this rule?",
          "This cannot be undone.",
        ]}
        onCancel={() => setActionToDelete(null)}
        onConfirm={confirmDeleteAction}
        confirmButtonLabel="Remove Rule"
      />

      {form.actions.length === 0 && (
        <InnerPanel className="p-4 text-center">
          <p className="text-xs opacity-60 mb-2">
            No rules yet. Rules define the game mechanics: what tokens are
            minted, burned, required, or produced.
          </p>
        </InnerPanel>
      )}

      {/* Responsive grid: 1 col mobile, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {form.actions.map((action, index) => renderCard(action, index))}
      </div>

      <Button onClick={() => setShowActionTypeModal(true)}>
        <span className="text-xs">+ Add Rule</span>
      </Button>
    </div>
  );
};
