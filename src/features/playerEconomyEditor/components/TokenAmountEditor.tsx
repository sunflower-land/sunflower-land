import React from "react";
import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import { SUNNYSIDE } from "assets/sunnyside";
import type { TokenAmount } from "../lib/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TokenAmountEditor: React.FC<{
  title: string;
  labelType?: "info" | "warning" | "danger" | "success" | "vibrant";
  icon?: string;
  rows: TokenAmount[];
  onChange: (rows: TokenAmount[]) => void;
  amountLabel?: string;
}> = ({
  title,
  labelType = "info",
  icon,
  rows,
  onChange,
  amountLabel = "Amt",
}) => {
  const { t } = useAppTranslation();
  const setRow = (index: number, next: Partial<TokenAmount>) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  };

  return (
    <div className="space-y-1">
      <Label type={labelType} icon={icon}>
        {title}
      </Label>
      {rows.length === 0 && (
        <p className="text-[10px] italic opacity-50 ml-1">
          {t("playerEconomyEditor.tokenAmount.noEntries")}
        </p>
      )}
      {rows.map((row, index) => (
        <div
          key={`${title}-${index}`}
          className="grid grid-cols-12 gap-1 items-center"
        >
          <div className="col-span-6">
            <TextInput
              value={row.token}
              onValueChange={(value) => setRow(index, { token: value })}
              placeholder="Token key"
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <span className="text-[10px] opacity-60">{amountLabel}</span>
          </div>
          <div className="col-span-3">
            <NumberInput
              value={new Decimal(row.amount)}
              maxDecimalPlaces={2}
              onValueChange={(value) =>
                setRow(index, { amount: value.toNumber() })
              }
            />
          </div>
          <div className="col-span-2">
            <Button
              variant="secondary"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="w-full"
            >
              <img
                src={SUNNYSIDE.icons.cancel}
                className="w-3"
                style={{ imageRendering: "pixelated" }}
              />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() => onChange([...rows, { token: "", amount: 0 }])}
      >
        <span className="text-xs">
          {t("playerEconomyEditor.tokenAmount.add", { title })}
        </span>
      </Button>
    </div>
  );
};
