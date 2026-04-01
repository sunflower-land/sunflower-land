import React from "react";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ActionForm, ProduceRuleForm, MintRuleForm } from "../lib/types";
import { FieldRow } from "./FieldRow";
import { BurnRowList, MintRowList } from "./ActionRowList";

export const ProduceCard: React.FC<{
  action: ActionForm;
  index: number;
  typeIndex: number;
  itemKeys: string[];
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({ action, index, typeIndex, itemKeys, onUpdate, onDelete }) => {
  const produceRule = action.produce[0] ?? {
    token: "",
    msToComplete: 0,
    limit: undefined,
    requires: undefined,
  };

  const updateProduce = (next: Partial<ProduceRuleForm>) => {
    const updated = { ...produceRule, ...next };
    onUpdate({ produce: [updated] });
  };

  const collectMint = action.linkedCollectMint ?? [];

  return (
    <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label type="default">
          {`Produce - #${String(typeIndex + 1).padStart(3, "0")}`}
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
        Allow players to produce items over time.
      </p>

      {/* Ingredients (burn) section */}
      <div className="space-y-2">
        <Label type="default">Ingredients</Label>
        <BurnRowList
          rows={action.burn}
          itemKeys={itemKeys}
          onChange={(burn) => onUpdate({ burn })}
        />
      </div>

      {/* Seconds to produce + Requires */}
      <div className="grid grid-cols-2 gap-2">
        <FieldRow label="Seconds to produce">
          <NumberInput
            value={
              new Decimal(
                produceRule.msToComplete
                  ? produceRule.msToComplete / 1000
                  : 0,
              )
            }
            maxDecimalPlaces={0}
            icon={SUNNYSIDE.icons.timer}
            onValueChange={(v) =>
              updateProduce({
                msToComplete: Math.max(0, v.toNumber()) * 1000,
              })
            }
          />
        </FieldRow>
        <FieldRow label="Requires (optional)">
          <Dropdown
            options={itemKeys}
            value={produceRule.requires || undefined}
            onChange={(v) =>
              updateProduce({ requires: v.trim() || undefined })
            }
            placeholder="Select item"
            showSearch
          />
        </FieldRow>
      </div>

      {/* Linked Collect section */}
      <div className="space-y-2">
        <Label type="default">
          {`Collect - #${String(typeIndex + 1).padStart(3, "0")}`}
        </Label>
        <MintRowList
          rows={collectMint}
          itemKeys={itemKeys}
          onChange={(rows: MintRuleForm[]) =>
            onUpdate({ linkedCollectMint: rows })
          }
        />
      </div>
    </InnerPanel>
  );
};
