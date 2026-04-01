import React, { useLayoutEffect, useMemo } from "react";
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
  ruleSequenceStart: number;
  itemKeys: string[];
  /** Items marked as generators — only these appear in Requires item. */
  generatorItemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({
  action,
  index,
  ruleSequenceStart,
  itemKeys,
  generatorItemKeys,
  getItemOptionLabel,
  onUpdate,
  onDelete,
}) => {
  useLayoutEffect(() => {
    const p = action.produce[0];
    if (p && p.requires === undefined) {
      onUpdate({ produce: [{ ...p, requires: "" }] });
    }
  }, [action.produce, onUpdate]);

  const produceRule: ProduceRuleForm = action.produce[0]
    ? {
        ...action.produce[0],
        requires:
          action.produce[0].requires === undefined ||
          action.produce[0].requires === null
            ? ""
            : String(action.produce[0].requires).trim(),
      }
    : {
        token: "",
        msToComplete: 0,
        limit: undefined,
        requires: "",
      };

  const requiresOptions = useMemo(() => {
    const r = produceRule.requires.trim();
    const base = generatorItemKeys;
    if (r && !base.includes(r)) return [...base, r];
    return base;
  }, [generatorItemKeys, produceRule.requires]);

  const updateProduce = (next: Partial<ProduceRuleForm>) => {
    const updated = { ...produceRule, ...next };
    onUpdate({ produce: [updated] });
  };

  const collectMint = action.linkedCollectMint ?? [];
  const hasCollectMint = collectMint.some((m) => m.token.trim());

  return (
    <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label type="default">
          {`Generate - #${String(ruleSequenceStart).padStart(3, "0")}`}
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
        Allow players to generate items over time.
      </p>

      {/* Required cap item (full width) — dashboard shows this production lane when the player has ≥1 */}
      <div className="space-y-1 w-full">
        <FieldRow label="Requires item">
          <Dropdown
            options={requiresOptions}
            value={produceRule.requires.trim() || undefined}
            onChange={(v) => updateProduce({ requires: v })}
            placeholder="Mark an item as a generator on the Items tab first"
            showSearch
            getOptionLabel={getItemOptionLabel}
          />
        </FieldRow>
        <p className="text-[10px] opacity-60">
          Only items with &quot;Is Generator?&quot; enabled appear here. Players see this
          production when they own at least one of that item (e.g. a wormery). It is not
          consumed to start the timer.
        </p>
      </div>

      {/* Ingredients (burn) section */}
      <div className="space-y-2">
        <Label type="default">Ingredients</Label>
        <BurnRowList
          rows={action.burn}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(burn) => onUpdate({ burn })}
        />
      </div>

      <div className="space-y-1 w-full">
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
      </div>

      {/* Linked Collect section */}
      <div className="space-y-2">
        <Label type="default">
          {hasCollectMint
            ? `Collect - #${String(ruleSequenceStart + 1).padStart(3, "0")}`
            : "Collect"}
        </Label>
        <MintRowList
          rows={collectMint}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(rows: MintRuleForm[]) =>
            onUpdate({ linkedCollectMint: rows })
          }
        />
      </div>
    </InnerPanel>
  );
};
