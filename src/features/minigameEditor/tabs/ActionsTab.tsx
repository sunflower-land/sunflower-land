import React, { useState } from "react";
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
  getActionTypeLabel,
} from "../lib/types";
import { RewardCard } from "../components/RewardCard";
import { CraftCard } from "../components/CraftCard";
import { BurnCard } from "../components/BurnCard";
import { ProduceCard } from "../components/ProduceCard";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const ActionsTab: React.FC<{
  form: EditorFormState;
  onUpdateAction: (index: number, next: Partial<ActionForm>) => void;
  onAddAction: (action: ActionForm) => void;
  onDeleteAction: (index: number) => void;
}> = ({ form, onUpdateAction, onAddAction, onDeleteAction }) => {
  const [showActionTypeModal, setShowActionTypeModal] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<number | null>(null);

  const itemKeys = form.items
    .map((item) => item.key || item.name)
    .filter(Boolean);

  const addActionOfType = (type: ActionType) => {
    const base: ActionForm = {
      actionType: type,
      id: "",
      mint: [],
      burn: [],
      require: [],
      requireBelow: [],
      requireAbsent: [],
      produce: [],
      collect: [],
    };

    switch (type) {
      case "reward":
        base.mint = [{ ...EMPTY_MINT_ROW }];
        break;
      case "craft":
        base.mint = [{ ...EMPTY_MINT_ROW }];
        base.burn = [{ ...EMPTY_BURN_ROW }];
        break;
      case "burn":
        base.burn = [{ ...EMPTY_BURN_ROW }];
        break;
      case "produce":
        base.produce = [{ token: "", msToComplete: 0, limit: undefined }];
        base.burn = [{ ...EMPTY_BURN_ROW }];
        base.linkedCollectId = "";
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

  const getTypeIndex = (action: ActionForm) =>
    form.actions.filter((a) => a.actionType === action.actionType).indexOf(action);

  const renderCard = (action: ActionForm, index: number) => {
    const typeIndex = getTypeIndex(action);
    const commonProps = {
      action,
      index,
      typeIndex,
      itemKeys,
      onUpdate: (next: Partial<ActionForm>) => onUpdateAction(index, next),
      onDelete: () => setActionToDelete(index),
    };

    switch (action.actionType) {
      case "reward":
        return <RewardCard key={`action-${index}`} {...commonProps} />;
      case "craft":
        return <CraftCard key={`action-${index}`} {...commonProps} />;
      case "burn":
        return <BurnCard key={`action-${index}`} {...commonProps} />;
      case "produce":
        return <ProduceCard key={`action-${index}`} {...commonProps} />;
      default:
        return (
          <InnerPanel key={`action-${index}`} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label type="default">
                {`${getActionTypeLabel(action.actionType)} - #${String(typeIndex + 1).padStart(3, "0")}`}
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
                    className="w-6"
                    style={{ imageRendering: "pixelated" }}
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
            No rules yet. Rules define the game mechanics: what tokens are
            minted, burned, required, or produced.
          </p>
        </InnerPanel>
      )}

      {/* Responsive grid: 1 col mobile, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {form.actions.map((action, index) => renderCard(action, index))}
      </div>

      <Button onClick={() => setShowActionTypeModal(true)}>
        <span className="text-xs">+ Add Rule</span>
      </Button>
    </div>
  );
};
