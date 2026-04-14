import React, { useMemo } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import flowerTokenIcon from "assets/icons/flower_token.webp";
import type { EditorFormState, PurchaseForm } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { FieldRow } from "../components/FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { suggestNextPurchaseId } from "../lib/purchaseIdHelpers";

export const PurchasesTab: React.FC<{
  form: EditorFormState;
  onChangePurchases: (purchases: PurchaseForm[]) => void;
}> = ({ form, onChangePurchases }) => {
  const { t } = useAppTranslation();

  const itemRows = useMemo(() => {
    return form.items.filter((i) => !i.deleted && i.id !== undefined);
  }, [form.items]);

  const itemOptions = useMemo(
    () => itemRows.map((i) => String(i.id)),
    [itemRows],
  );

  const itemLabel = (idStr: string) => {
    const i = itemRows.find((r) => String(r.id) === idStr);
    if (!i) return idStr;
    return `${i.name?.trim() || i.key} (id ${i.id})`;
  };

  const updateRow = (index: number, next: Partial<PurchaseForm>) => {
    const purchases = [...form.purchases];
    purchases[index] = { ...purchases[index], ...next };
    onChangePurchases(purchases);
  };

  const addRow = () => {
    const id = suggestNextPurchaseId(form.purchases.map((p) => p.id));
    const firstId = form.items.find(
      (i) => !i.deleted && i.id !== undefined,
    )?.id;
    onChangePurchases([
      ...form.purchases,
      {
        id,
        itemId: firstId ?? 0,
        amount: 1,
        flower: 1,
      },
    ]);
  };

  const removeRow = (index: number) => {
    onChangePurchases(form.purchases.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <InnerPanel className="p-3 space-y-3">
        <SectionHeader type="info" icon={flowerTokenIcon}>
          {t("playerEconomyEditor.purchases.title")}
        </SectionHeader>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          {t("playerEconomyEditor.purchases.intro")}
        </p>
      </InnerPanel>

      {form.purchases.length === 0 && (
        <InnerPanel className="p-4 text-center">
          <p className="text-xs opacity-60 mb-2">
            {t("playerEconomyEditor.purchases.empty")}
          </p>
        </InnerPanel>
      )}

      {form.purchases.map((row, index) => (
        <InnerPanel key={row.id} className="p-3 space-y-2">
          <FieldRow label={t("playerEconomyEditor.purchases.idLabel")}>
            <TextInput
              value={row.id}
              onValueChange={(v) => updateRow(index, { id: v })}
            />
          </FieldRow>
          <FieldRow label={t("playerEconomyEditor.purchases.itemLabel")}>
            <Dropdown
              options={itemOptions}
              value={
                itemOptions.includes(String(row.itemId))
                  ? String(row.itemId)
                  : itemOptions[0]
              }
              onChange={(v) => updateRow(index, { itemId: Number(v) })}
              getOptionLabel={itemLabel}
            />
          </FieldRow>
          <FieldRow label={t("playerEconomyEditor.purchases.amountLabel")}>
            <TextInput
              value={String(row.amount)}
              onValueChange={(v) =>
                updateRow(index, { amount: Math.floor(Number(v) || 0) })
              }
            />
          </FieldRow>
          <FieldRow label={t("playerEconomyEditor.purchases.flowerLabel")}>
            <TextInput
              value={String(row.flower)}
              onValueChange={(v) =>
                updateRow(index, { flower: Math.floor(Number(v) || 0) })
              }
            />
          </FieldRow>
          <Button type="button" onClick={() => removeRow(index)}>
            <span className="text-xs">
              {t("playerEconomyEditor.purchases.remove")}
            </span>
          </Button>
        </InnerPanel>
      ))}

      <Button
        type="button"
        onClick={addRow}
        disabled={itemOptions.length === 0}
      >
        <span className="text-xs">
          {t("playerEconomyEditor.purchases.add")}
        </span>
      </Button>
    </div>
  );
};
