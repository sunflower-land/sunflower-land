import React from "react";
import Decimal from "decimal.js-light";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MintRuleForm, TokenAmount } from "../lib/types";
import { EMPTY_MINT_ROW, EMPTY_BURN_ROW } from "../lib/types";
import { FieldRow } from "./FieldRow";

/* ─── Shared row list for mint / burn in action cards ─────────── */

type RowItem = MintRuleForm | TokenAmount;

interface ActionRowListProps<T extends RowItem> {
  rows: T[];
  itemKeys: string[];
  emptyRow: T;
  tokenField: keyof T & string;
  amountField: keyof T & string;
  onChange: (rows: T[]) => void;
}

export function ActionRowList<T extends RowItem>({
  rows,
  itemKeys,
  emptyRow,
  tokenField,
  amountField,
  onChange,
}: ActionRowListProps<T>) {
  return (
    <>
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <div className="flex-1 grid grid-cols-2 gap-1">
            <FieldRow label="Item">
              <Dropdown
                options={itemKeys}
                value={(row[tokenField] as string) || undefined}
                onChange={(v) => {
                  const updated = [...rows];
                  updated[idx] = { ...updated[idx], [tokenField]: v };
                  onChange(updated);
                }}
                placeholder="Select item"
                showSearch
              />
            </FieldRow>
            <FieldRow label="Amount">
              <NumberInput
                value={new Decimal((row[amountField] as number) || 0)}
                maxDecimalPlaces={2}
                onValueChange={(v) => {
                  const updated = [...rows];
                  updated[idx] = {
                    ...updated[idx],
                    [amountField]: v.toNumber(),
                  };
                  onChange(updated);
                }}
              />
            </FieldRow>
          </div>
          {/* Remove row */}
          {rows.length > 1 && (
            <img
              src={SUNNYSIDE.icons.cancel}
              className="cursor-pointer hover:brightness-75 mt-5"
              onClick={() => onChange(rows.filter((_, i) => i !== idx))}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                imageRendering: "pixelated",
              }}
            />
          )}
          {/* Add row (on last row) */}
          {idx === rows.length - 1 && (
            <img
              src={SUNNYSIDE.icons.plus}
              className="cursor-pointer hover:brightness-90 mt-5"
              onClick={() => onChange([...rows, { ...emptyRow }])}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                imageRendering: "pixelated",
              }}
            />
          )}
        </div>
      ))}
      {rows.length === 0 && (
        <div className="flex items-center gap-2">
          <p className="text-[10px] italic opacity-50">No items yet</p>
          <img
            src={SUNNYSIDE.icons.plus}
            className="cursor-pointer hover:brightness-90"
            onClick={() => onChange([{ ...emptyRow }])}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>
      )}
    </>
  );
}

/* ─── Pre-bound wrappers ──────────────────────────────────────── */

export const MintRowList: React.FC<{
  rows: MintRuleForm[];
  itemKeys: string[];
  onChange: (rows: MintRuleForm[]) => void;
}> = ({ rows, itemKeys, onChange }) => (
  <ActionRowList
    rows={rows}
    itemKeys={itemKeys}
    emptyRow={EMPTY_MINT_ROW}
    tokenField="token"
    amountField="amount"
    onChange={onChange}
  />
);

export const BurnRowList: React.FC<{
  rows: TokenAmount[];
  itemKeys: string[];
  onChange: (rows: TokenAmount[]) => void;
}> = ({ rows, itemKeys, onChange }) => (
  <ActionRowList
    rows={rows}
    itemKeys={itemKeys}
    emptyRow={EMPTY_BURN_ROW}
    tokenField="token"
    amountField="amount"
    onChange={onChange}
  />
);
