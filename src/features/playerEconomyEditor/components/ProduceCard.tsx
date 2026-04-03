import React, { useLayoutEffect, useMemo } from "react";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RuleActionIdLabel } from "./RuleActionIdLabel";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ActionForm, ProduceRuleForm, MintRuleForm } from "../lib/types";
import { FieldRow } from "./FieldRow";
import { BurnRowList, MintRowList } from "./ActionRowList";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ProduceCard: React.FC<{
  action: ActionForm;
  index: number;
  peerIds: string[];
  itemKeys: string[];
  /** Items marked as generators — only these appear in Requires item. */
  generatorItemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({
  action,
  index,
  peerIds,
  itemKeys,
  generatorItemKeys,
  getItemOptionLabel,
  onUpdate,
  onDelete,
}) => {
  const { t } = useAppTranslation();
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

  return (
    <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <RuleActionIdLabel
          actionId={action.id}
          peerIds={peerIds}
          onCommit={(id) => onUpdate({ id })}
        />
        <img
          src={SUNNYSIDE.icons.close}
          className="cursor-pointer hover:brightness-75 shrink-0"
          onClick={onDelete}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            imageRendering: "pixelated",
          }}
        />
      </div>

      <p className="text-xs opacity-70">
        {t("playerEconomyEditor.produce.intro")}
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
          {t("playerEconomyEditor.produce.generatorHint")}
        </p>
      </div>

      {/* Ingredients (burn) section */}
      <div className="space-y-2">
        <Label type="default">
          {t("playerEconomyEditor.produce.ingredients")}
        </Label>
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
                produceRule.msToComplete ? produceRule.msToComplete / 1000 : 0,
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
        <Label type="default">Collect</Label>
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
