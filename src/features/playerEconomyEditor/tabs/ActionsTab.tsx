import React, { useCallback, useLayoutEffect, useState } from "react";
import { InnerPanel, Panel, ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
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
import { RuleActionIdLabel } from "../components/RuleActionIdLabel";
import { suggestNextActionId } from "../lib/actionIdHelpers";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ActionsTab: React.FC<{
  form: EditorFormState;
  onUpdateAction: (index: number, next: Partial<ActionForm>) => void;
  onAddAction: (action: ActionForm) => void;
  onDeleteAction: (index: number) => void;
  patchEmptyActionIds: () => void;
}> = ({
  form,
  onUpdateAction,
  onAddAction,
  onDeleteAction,
  patchEmptyActionIds,
}) => {
  const { t } = useAppTranslation();
  const [showActionTypeModal, setShowActionTypeModal] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<number | null>(null);
  const actionIdSignature = form.actions.map((a) => a.id).join("\0");

  useLayoutEffect(() => {
    if (!form.actions.some((a) => !a.id.trim())) return;
    patchEmptyActionIds();
  }, [actionIdSignature, patchEmptyActionIds]);
  const itemKeys = form.items
    .filter((item) => item.id !== undefined && !item.deleted)
    .map((item) => String(item.id));

  const generatorItemKeys = form.items
    .filter((item) => item.id !== undefined && !item.deleted && item.generator)
    .map((item) => String(item.id));

  const getItemOptionLabel = useCallback(
    (idStr: string) => {
      const item = form.items.find((i) => String(i.id) === idStr && !i.deleted);
      if (!item || item.id === undefined) return idStr;
      const name = item.name.trim() || "Unnamed";
      return `${name} - #${item.id}`;
    },
    [form.items],
  );

  const addActionOfType = (type: ActionType) => {
    const existing = new Set(
      form.actions.map((a) => a.id.trim()).filter(Boolean),
    );
    const base: ActionForm = {
      actionType: type,
      id: suggestNextActionId(type, existing),
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
        return;
    }

    onAddAction(base);
    setShowActionTypeModal(false);
  };

  const confirmDeleteAction = () => {
    if (actionToDelete === null) return;
    onDeleteAction(actionToDelete);
    setActionToDelete(null);
  };

  const peerIdsFor = (index: number) =>
    form.actions
      .map((a, i) => (i === index ? null : a.id.trim()))
      .filter((s): s is string => Boolean(s));

  const renderCard = (action: ActionForm, index: number) => {
    const commonProps = {
      action,
      index,
      peerIds: peerIdsFor(index),
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
      case "produce":
        return <CustomCard key={`action-${index}`} {...commonProps} />;
      default:
        return (
          <InnerPanel key={`action-${index}`} className="p-3 space-y-2">
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-[10px] opacity-60">
                  {getActionTypeLabel(action.actionType)}
                </span>
                <RuleActionIdLabel
                  actionId={action.id}
                  peerIds={peerIdsFor(index)}
                  onCommit={(id) => onUpdateAction(index, { id })}
                />
              </div>
              <img
                src={SUNNYSIDE.icons.close}
                className="cursor-pointer hover:brightness-75 shrink-0"
                onClick={() => setActionToDelete(index)}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  imageRendering: "pixelated",
                }}
              />
            </div>
            <p className="text-xs opacity-50 italic">
              {t("playerEconomyEditor.actions.editorSoon", {
                type: getActionTypeLabel(action.actionType),
              })}
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
          <span className="text-sm">
            {t("playerEconomyEditor.actions.modalPrompt")}
          </span>
          <div className="space-y-2">
            {ACTION_TYPE_OPTIONS.map((opt) => (
              <ButtonPanel
                key={opt.type}
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
                </div>
              </ButtonPanel>
            ))}
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
            {t("playerEconomyEditor.actions.empty")}
          </p>
        </InnerPanel>
      )}

      {/* Responsive grid: 1 col mobile, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {form.actions.map((action, index) => renderCard(action, index))}
      </div>

      <Button onClick={() => setShowActionTypeModal(true)}>
        <span className="text-xs">
          {t("playerEconomyEditor.actions.addRule")}
        </span>
      </Button>
    </div>
  );
};
