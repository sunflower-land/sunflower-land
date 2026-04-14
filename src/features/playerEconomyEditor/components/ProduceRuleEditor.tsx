import React from "react";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import { SUNNYSIDE } from "assets/sunnyside";
import type { ProduceRuleForm } from "../lib/types";
import { FieldRow } from "./FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const ProduceRuleEditor: React.FC<{
  rows: ProduceRuleForm[];
  onChange: (rows: ProduceRuleForm[]) => void;
}> = ({ rows, onChange }) => {
  const { t } = useAppTranslation();
  const setRow = (index: number, next: Partial<ProduceRuleForm>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type="vibrant">{t("playerEconomyEditor.produceRule.title")}</Label>
      {rows.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">
          {t("playerEconomyEditor.produceRule.empty")}
        </p>
      )}
      {rows.map((row, index) => (
        <InnerPanel key={`produce-${index}`} className="p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] opacity-70">
              {t("playerEconomyEditor.produceRule.rowLabel", {
                n: index + 1,
              })}
            </span>
            <Button
              variant="secondary"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="w-8 h-6"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>
          <TextInput
            value={row.token}
            onValueChange={(value) => setRow(index, { token: value })}
            placeholder="Output token"
          />
          <div className="grid grid-cols-2 gap-1">
            <FieldRow label="Time (ms)">
              <NumberInput
                value={new Decimal(row.msToComplete)}
                maxDecimalPlaces={0}
                onValueChange={(v) =>
                  setRow(index, { msToComplete: v.toNumber() })
                }
              />
            </FieldRow>
            <FieldRow label="Limit (optional)">
              <NumberInput
                value={new Decimal(row.limit ?? 0)}
                maxDecimalPlaces={0}
                onValueChange={(v) =>
                  setRow(index, {
                    limit: v.toNumber() > 0 ? v.toNumber() : undefined,
                  })
                }
              />
            </FieldRow>
          </div>
          <FieldRow label="Requires">
            <TextInput
              value={row.requires ?? ""}
              onValueChange={(value) => setRow(index, { requires: value })}
              placeholder="e.g. wormery"
            />
          </FieldRow>
        </InnerPanel>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          onChange([
            ...rows,
            { token: "", msToComplete: 0, limit: undefined, requires: "" },
          ])
        }
      >
        <span className="text-xs">
          {t("playerEconomyEditor.produceRule.add")}
        </span>
      </Button>
    </div>
  );
};
