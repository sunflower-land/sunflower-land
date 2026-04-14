import React from "react";
import Decimal from "decimal.js-light";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type {
  CustomBurnRowForm,
  CustomMintRowForm,
  MintRuleForm,
  TokenAmount,
} from "../lib/types";
import {
  EMPTY_MINT_ROW,
  EMPTY_BURN_ROW,
  EMPTY_CUSTOM_MINT_ROW,
  EMPTY_CUSTOM_BURN_ROW,
} from "../lib/types";
import { FieldRow } from "./FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/* ─── Shared row list for mint / burn in action cards ─────────── */

type RowItem = MintRuleForm | TokenAmount;

interface ActionRowListProps<T extends RowItem> {
  rows: T[];
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  emptyRow: T;
  tokenField: keyof T & string;
  amountField: keyof T & string;
  onChange: (rows: T[]) => void;
  /** When set above 0, hides the empty placeholder and disallows removing below this many rows. */
  minRows?: number;
  /** When set, hides the add control once this many rows exist. */
  maxRows?: number;
}

export function ActionRowList<T extends RowItem>({
  rows,
  itemKeys,
  getItemOptionLabel,
  emptyRow,
  tokenField,
  amountField,
  onChange,
  minRows = 0,
  maxRows,
}: ActionRowListProps<T>) {
  const { t } = useAppTranslation();
  const canRemoveRow = rows.length > (minRows > 0 ? minRows : 1);
  const canAddRow = maxRows === undefined || rows.length < maxRows;

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
                getOptionLabel={getItemOptionLabel}
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
          {canRemoveRow && (
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
          {idx === rows.length - 1 && canAddRow && (
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
      {rows.length === 0 && minRows === 0 && canAddRow && (
        <div className="flex items-center gap-2">
          <p className="text-[10px] italic opacity-50">
            {t("playerEconomyEditor.actionRow.noItemsYet")}
          </p>
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
  getItemOptionLabel?: (itemId: string) => string;
  onChange: (rows: MintRuleForm[]) => void;
  minRows?: number;
  maxRows?: number;
}> = ({ rows, itemKeys, getItemOptionLabel, onChange, minRows, maxRows }) => (
  <ActionRowList
    rows={rows}
    itemKeys={itemKeys}
    getItemOptionLabel={getItemOptionLabel}
    emptyRow={EMPTY_MINT_ROW}
    tokenField="token"
    amountField="amount"
    onChange={onChange}
    minRows={minRows}
    maxRows={maxRows}
  />
);

/** Generate card linked collect: Item, Amount, Chance (%). */
export const GeneratorCollectRowList: React.FC<{
  rows: MintRuleForm[];
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onChange: (rows: MintRuleForm[]) => void;
  minRows?: number;
  maxRows?: number;
}> = ({
  rows,
  itemKeys,
  getItemOptionLabel,
  onChange,
  minRows = 0,
  maxRows,
}) => {
  const { t } = useAppTranslation();
  const canRemoveRow = rows.length > (minRows > 0 ? minRows : 1);
  const canAddRow = maxRows === undefined || rows.length < maxRows;

  return (
    <>
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <div className="flex-1 grid grid-cols-3 gap-1">
            <FieldRow label="Item">
              <Dropdown
                options={itemKeys}
                value={row.token || undefined}
                onChange={(v) => {
                  const updated = [...rows];
                  updated[idx] = { ...updated[idx], token: v };
                  onChange(updated);
                }}
                placeholder="Select item"
                showSearch
                getOptionLabel={getItemOptionLabel}
              />
            </FieldRow>
            <FieldRow label="Amount">
              <NumberInput
                value={new Decimal(row.amount || 0)}
                maxDecimalPlaces={2}
                onValueChange={(v) => {
                  const updated = [...rows];
                  updated[idx] = { ...updated[idx], amount: v.toNumber() };
                  onChange(updated);
                }}
              />
            </FieldRow>
            <FieldRow label="Chance %">
              <NumberInput
                value={new Decimal(row.collectChance ?? 100)}
                maxDecimalPlaces={0}
                onValueChange={(v) => {
                  const updated = [...rows];
                  const n = Math.max(
                    0,
                    Math.min(100, Math.round(v.toNumber())),
                  );
                  updated[idx] = { ...updated[idx], collectChance: n };
                  onChange(updated);
                }}
              />
            </FieldRow>
          </div>
          {canRemoveRow && (
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
          {idx === rows.length - 1 && canAddRow && (
            <img
              src={SUNNYSIDE.icons.plus}
              className="cursor-pointer hover:brightness-90 mt-5"
              onClick={() => onChange([...rows, { ...EMPTY_MINT_ROW }])}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                imageRendering: "pixelated",
              }}
            />
          )}
        </div>
      ))}
      {rows.length === 0 && minRows === 0 && canAddRow && (
        <div className="flex items-center gap-2">
          <p className="text-[10px] italic opacity-50">
            {t("playerEconomyEditor.actionRow.noCollectRows")}
          </p>
          <img
            src={SUNNYSIDE.icons.plus}
            className="cursor-pointer hover:brightness-90"
            onClick={() => onChange([{ ...EMPTY_MINT_ROW }])}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              imageRendering: "pixelated",
            }}
          />
        </div>
      )}
    </>
  );
};

export const BurnRowList: React.FC<{
  rows: TokenAmount[];
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onChange: (rows: TokenAmount[]) => void;
  minRows?: number;
}> = ({ rows, itemKeys, getItemOptionLabel, onChange, minRows }) => (
  <ActionRowList
    rows={rows}
    itemKeys={itemKeys}
    getItemOptionLabel={getItemOptionLabel}
    emptyRow={EMPTY_BURN_ROW}
    tokenField="token"
    amountField="amount"
    onChange={onChange}
    minRows={minRows}
  />
);

export const CustomMintRowList: React.FC<{
  rows: CustomMintRowForm[];
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onChange: (rows: CustomMintRowForm[]) => void;
  dropChances: boolean;
}> = ({ rows, itemKeys, getItemOptionLabel, onChange, dropChances }) => {
  const { t } = useAppTranslation();
  const nameLabel = t("playerEconomyEditor.custom.columnName");
  const minLabel = t("playerEconomyEditor.custom.columnMin");
  const maxLabel = t("playerEconomyEditor.custom.columnMax");
  const amountLabel = t("playerEconomyEditor.custom.columnAmount");
  const chanceLabel = t("playerEconomyEditor.custom.columnChancePct");

  return (
    <div className="space-y-2">
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-end gap-1">
          <div className="flex-1 min-w-0 grid grid-cols-3 gap-1">
            <FieldRow label={nameLabel}>
              <Dropdown
                options={itemKeys}
                value={row.token || undefined}
                onChange={(v) => {
                  const u = [...rows];
                  u[idx] = { ...u[idx], token: v };
                  onChange(u);
                }}
                placeholder={t("playerEconomyEditor.custom.selectItem")}
                showSearch
                getOptionLabel={getItemOptionLabel}
              />
            </FieldRow>
            {dropChances ? (
              <>
                <FieldRow label={amountLabel}>
                  <NumberInput
                    value={new Decimal(row.min ?? 0)}
                    maxDecimalPlaces={0}
                    onValueChange={(v) => {
                      const u = [...rows];
                      const n = Math.max(0, Math.floor(v.toNumber()));
                      u[idx] = { ...u[idx], min: n, max: n };
                      onChange(u);
                    }}
                  />
                </FieldRow>
                <FieldRow label={chanceLabel}>
                  <NumberInput
                    value={new Decimal(row.chance ?? 100)}
                    maxDecimalPlaces={0}
                    onValueChange={(v) => {
                      const u = [...rows];
                      const n = Math.max(
                        0,
                        Math.min(100, Math.round(v.toNumber())),
                      );
                      u[idx] = { ...u[idx], chance: n };
                      onChange(u);
                    }}
                  />
                </FieldRow>
              </>
            ) : (
              <>
                <FieldRow label={minLabel}>
                  <NumberInput
                    value={new Decimal(row.min ?? 0)}
                    maxDecimalPlaces={0}
                    onValueChange={(v) => {
                      const u = [...rows];
                      u[idx] = {
                        ...u[idx],
                        min: Math.max(0, Math.floor(v.toNumber())),
                      };
                      onChange(u);
                    }}
                  />
                </FieldRow>
                <FieldRow label={maxLabel}>
                  <NumberInput
                    value={new Decimal(row.max ?? 0)}
                    maxDecimalPlaces={0}
                    onValueChange={(v) => {
                      const u = [...rows];
                      u[idx] = {
                        ...u[idx],
                        max: Math.max(0, Math.floor(v.toNumber())),
                      };
                      onChange(u);
                    }}
                  />
                </FieldRow>
              </>
            )}
          </div>
          {rows.length > 1 ? (
            <img
              src={SUNNYSIDE.icons.cancel}
              className="cursor-pointer hover:brightness-75 shrink-0 mb-0.5"
              onClick={() => onChange(rows.filter((_, i) => i !== idx))}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                imageRendering: "pixelated",
              }}
              alt=""
            />
          ) : (
            <div
              className="shrink-0"
              style={{ width: `${PIXEL_SCALE * 7}px` }}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        className="text-xs underline text-[#3e2731] hover:opacity-80"
        onClick={() => onChange([...rows, { ...EMPTY_CUSTOM_MINT_ROW }])}
      >
        {t("playerEconomyEditor.custom.addMintItem")}
      </button>
      {rows.length === 0 ? (
        <p className="text-[10px] italic opacity-50">
          {t("playerEconomyEditor.actionRow.noMintRows")}
        </p>
      ) : null}
    </div>
  );
};

export const CustomBurnRowList: React.FC<{
  rows: CustomBurnRowForm[];
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onChange: (rows: CustomBurnRowForm[]) => void;
}> = ({ rows, itemKeys, getItemOptionLabel, onChange }) => {
  const { t } = useAppTranslation();
  const nameLabel = t("playerEconomyEditor.custom.columnName");
  const minLabel = t("playerEconomyEditor.custom.columnMin");
  const maxLabel = t("playerEconomyEditor.custom.columnMax");

  return (
    <div className="space-y-2">
      {rows.map((row, idx) => (
        <div key={idx} className="flex items-end gap-1">
          <div className="flex-1 min-w-0 grid grid-cols-3 gap-1">
            <FieldRow label={nameLabel}>
              <Dropdown
                options={itemKeys}
                value={row.token || undefined}
                onChange={(v) => {
                  const u = [...rows];
                  u[idx] = { ...u[idx], token: v };
                  onChange(u);
                }}
                placeholder={t("playerEconomyEditor.custom.selectItem")}
                showSearch
                getOptionLabel={getItemOptionLabel}
              />
            </FieldRow>
            <FieldRow label={minLabel}>
              <NumberInput
                value={new Decimal(row.min ?? 0)}
                maxDecimalPlaces={0}
                onValueChange={(v) => {
                  const u = [...rows];
                  u[idx] = {
                    ...u[idx],
                    min: Math.max(0, Math.floor(v.toNumber())),
                  };
                  onChange(u);
                }}
              />
            </FieldRow>
            <FieldRow label={maxLabel}>
              <NumberInput
                value={new Decimal(row.max ?? 0)}
                maxDecimalPlaces={0}
                onValueChange={(v) => {
                  const u = [...rows];
                  u[idx] = {
                    ...u[idx],
                    max: Math.max(0, Math.floor(v.toNumber())),
                  };
                  onChange(u);
                }}
              />
            </FieldRow>
          </div>
          {rows.length > 1 ? (
            <img
              src={SUNNYSIDE.icons.cancel}
              className="cursor-pointer hover:brightness-75 shrink-0 mb-0.5"
              onClick={() => onChange(rows.filter((_, i) => i !== idx))}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                imageRendering: "pixelated",
              }}
              alt=""
            />
          ) : (
            <div
              className="shrink-0"
              style={{ width: `${PIXEL_SCALE * 7}px` }}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        className="text-xs underline text-[#3e2731] hover:opacity-80"
        onClick={() => onChange([...rows, { ...EMPTY_CUSTOM_BURN_ROW }])}
      >
        {t("playerEconomyEditor.custom.addBurnItem")}
      </button>
      {rows.length === 0 ? (
        <p className="text-[10px] italic opacity-50">
          {t("playerEconomyEditor.actionRow.noBurnRows")}
        </p>
      ) : null}
    </div>
  );
};
