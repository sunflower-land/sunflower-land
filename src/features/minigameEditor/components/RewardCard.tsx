import React from "react";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ActionForm, MintRuleForm } from "../lib/types";
import { FieldRow } from "./FieldRow";
import { MintRowList } from "./ActionRowList";

export const RewardCard: React.FC<{
  action: ActionForm;
  index: number;
  typeIndex: number;
  itemKeys: string[];
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({ action, index, typeIndex, itemKeys, onUpdate, onDelete }) => (
  <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Label type="default">
        {`Reward - #${String(typeIndex + 1).padStart(3, "0")}`}
      </Label>
      <img
        src={SUNNYSIDE.icons.close}
        className="cursor-pointer hover:brightness-75"
        onClick={onDelete}
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>

    <p className="text-xs opacity-70">
      Reward your players with free daily items
    </p>

    {/* Mint rows */}
    <div className="space-y-2">
      <MintRowList
        rows={action.mint}
        itemKeys={itemKeys}
        onChange={(mint) => onUpdate({ mint })}
      />
    </div>

    {/* Daily Cap + Requires */}
    <div className="grid grid-cols-2 gap-2">
      <FieldRow label="Daily Cap (optional)">
        <NumberInput
          value={new Decimal(action.mint[0]?.dailyCap ?? 0)}
          maxDecimalPlaces={0}
          onValueChange={(v) => {
            const updated = action.mint.map((m) => ({
              ...m,
              dailyCap: v.toNumber(),
              type: (v.toNumber() > 0 ? "fixedCapped" : "fixed") as MintRuleForm["type"],
            }));
            onUpdate({ mint: updated });
          }}
        />
      </FieldRow>
      <FieldRow label="Requires (optional)">
        <Dropdown
          options={itemKeys}
          value={action.require[0]?.token || undefined}
          onChange={(v) =>
            onUpdate({
              require: v.trim()
                ? [{ token: v.trim(), amount: action.require[0]?.amount ?? 1 }]
                : [],
            })
          }
          placeholder="Select item"
          showSearch
        />
      </FieldRow>
    </div>
  </InnerPanel>
);
