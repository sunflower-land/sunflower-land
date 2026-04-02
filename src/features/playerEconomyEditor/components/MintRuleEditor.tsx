import React from "react";
import Decimal from "decimal.js-light";
import { InnerPanel, ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import { SUNNYSIDE } from "assets/sunnyside";
import type { MintRuleForm } from "../lib/types";
import { FieldRow } from "./FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const MintRuleEditor: React.FC<{
  rows: MintRuleForm[];
  onChange: (rows: MintRuleForm[]) => void;
}> = ({ rows, onChange }) => {
  const { t } = useAppTranslation();
  const setRow = (index: number, next: Partial<MintRuleForm>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type="success" icon={SUNNYSIDE.icons.plant}>
        {t("playerEconomyEditor.mintRule.title")}
      </Label>
      {rows.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">
          {t("playerEconomyEditor.mintRule.empty")}
        </p>
      )}
      {rows.map((row, index) => (
        <InnerPanel key={`mint-${index}`} className="p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] opacity-70">
              {t("playerEconomyEditor.mintRule.ruleLabel", { n: index + 1 })}
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
            placeholder="Token key"
          />
          {/* Type selector */}
          <div className="flex gap-1">
            {(["fixed", "fixedCapped", "ranged"] as const).map((t) => (
              <ButtonPanel
                key={t}
                selected={row.type === t}
                onClick={() => setRow(index, { type: t })}
                className="px-2 py-1 text-[10px] flex-1 text-center"
              >
                {t === "fixed"
                  ? "Fixed"
                  : t === "fixedCapped"
                    ? "Daily Cap"
                    : "Ranged"}
              </ButtonPanel>
            ))}
          </div>
          {/* Fields per type */}
          {row.type === "fixed" && (
            <FieldRow label="Amount">
              <NumberInput
                value={new Decimal(row.amount)}
                maxDecimalPlaces={2}
                onValueChange={(v) => setRow(index, { amount: v.toNumber() })}
              />
            </FieldRow>
          )}
          {row.type === "fixedCapped" && (
            <div className="grid grid-cols-2 gap-1">
              <FieldRow label="Amount">
                <NumberInput
                  value={new Decimal(row.amount)}
                  maxDecimalPlaces={2}
                  onValueChange={(v) => setRow(index, { amount: v.toNumber() })}
                />
              </FieldRow>
              <FieldRow label="Daily Cap">
                <NumberInput
                  value={new Decimal(row.dailyCap)}
                  maxDecimalPlaces={0}
                  onValueChange={(v) =>
                    setRow(index, { dailyCap: v.toNumber() })
                  }
                />
              </FieldRow>
            </div>
          )}
          {row.type === "ranged" && (
            <div className="grid grid-cols-3 gap-1">
              <FieldRow label="Min">
                <NumberInput
                  value={new Decimal(row.min)}
                  maxDecimalPlaces={2}
                  onValueChange={(v) => setRow(index, { min: v.toNumber() })}
                />
              </FieldRow>
              <FieldRow label="Max">
                <NumberInput
                  value={new Decimal(row.max)}
                  maxDecimalPlaces={2}
                  onValueChange={(v) => setRow(index, { max: v.toNumber() })}
                />
              </FieldRow>
              <FieldRow label="Daily Cap">
                <NumberInput
                  value={new Decimal(row.dailyCap)}
                  maxDecimalPlaces={0}
                  onValueChange={(v) =>
                    setRow(index, { dailyCap: v.toNumber() })
                  }
                />
              </FieldRow>
            </div>
          )}
        </InnerPanel>
      ))}
      <Button
        variant="secondary"
        onClick={() =>
          onChange([
            ...rows,
            {
              token: "",
              type: "fixed",
              amount: 0,
              dailyCap: 0,
              min: 0,
              max: 0,
            },
          ])
        }
      >
        <span className="text-xs">{t("playerEconomyEditor.mintRule.add")}</span>
      </Button>
    </div>
  );
};
