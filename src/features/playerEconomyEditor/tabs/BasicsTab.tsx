import React, { useMemo } from "react";
import { InnerPanel } from "components/ui/Panel";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import type { EditorFormState } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { FieldRow } from "../components/FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const MAIN_CURRENCY_AUTO_VALUE = "__main_currency_auto__";

export const BasicsTab: React.FC<{
  form: EditorFormState;
  mode: "create" | "edit";
  onChange: (next: Partial<EditorFormState>) => void;
}> = ({ form, mode, onChange }) => {
  const { t } = useAppTranslation();

  const tradeableItems = useMemo(
    () =>
      form.items.filter((i) => !i.deleted && i.tradeable && i.id !== undefined),
    [form.items],
  );

  const mainCurrencyOptions = useMemo(() => {
    const keys = tradeableItems
      .map((i) => String(i.id))
      .sort((a, b) => Number(a) - Number(b));
    return [MAIN_CURRENCY_AUTO_VALUE, ...keys];
  }, [tradeableItems]);

  const labelForCurrencyOption = (value: string) => {
    if (value === MAIN_CURRENCY_AUTO_VALUE)
      return t("playerEconomyEditor.basics.mainCurrencyAuto");
    const item = tradeableItems.find((i) => String(i.id) === value);
    return item ? `${item.name} (${value})` : value;
  };

  const mainCurrencyDropdownValue =
    form.mainCurrencyToken.trim() === ""
      ? MAIN_CURRENCY_AUTO_VALUE
      : form.mainCurrencyToken.trim();

  return (
    <div className="space-y-3">
      {/* Game Identity */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.player}>
          {t("playerEconomyEditor.basics.gameIdentity")}
        </SectionHeader>
        <FieldRow label={t("playerEconomyEditor.basics.slugLabel")}>
          <TextInput
            value={form.slug}
            onValueChange={(slug) => onChange({ slug })}
            maxLength={60}
            placeholder={t("playerEconomyEditor.basics.slugPlaceholder")}
            className={mode === "edit" ? "pointer-events-none opacity-70" : ""}
          />
        </FieldRow>
        <FieldRow label={t("playerEconomyEditor.basics.mainCurrencyLabel")}>
          {tradeableItems.length === 0 ? (
            <p className="text-xs opacity-70">
              {t("playerEconomyEditor.basics.mainCurrencyNoTradeable")}
            </p>
          ) : (
            <Dropdown
              options={mainCurrencyOptions}
              value={mainCurrencyDropdownValue}
              onChange={(v) =>
                onChange({
                  mainCurrencyToken: v === MAIN_CURRENCY_AUTO_VALUE ? "" : v,
                })
              }
              placeholder={t("playerEconomyEditor.basics.mainCurrencyAuto")}
              getOptionLabel={labelForCurrencyOption}
            />
          )}
        </FieldRow>
        <FieldRow label={t("playerEconomyEditor.basics.gameUrlLabel")}>
          <div className="space-y-1 w-full">
            <TextInput
              value={form.playUrl}
              onValueChange={(playUrl) => onChange({ playUrl })}
              placeholder={t("playerEconomyEditor.basics.gameUrlPlaceholder")}
            />
            <p className="text-[10px] opacity-60 leading-snug">
              {t("playerEconomyEditor.basics.gameUrlHint")}
            </p>
          </div>
        </FieldRow>
      </InnerPanel>

      {/* Descriptions */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.expression_chat}>
          {t("playerEconomyEditor.basics.descriptions")}
        </SectionHeader>
        <FieldRow label="Title">
          <TextInput
            value={form.descriptionTitle}
            onValueChange={(v) => onChange({ descriptionTitle: v })}
            placeholder="My Awesome Game"
          />
        </FieldRow>
        <FieldRow label="Subtitle">
          <TextInput
            value={form.descriptionSubtitle}
            onValueChange={(v) => onChange({ descriptionSubtitle: v })}
            placeholder="A short tagline"
          />
        </FieldRow>
        <FieldRow label="Welcome Message">
          <TextInput
            value={form.descriptionWelcome}
            onValueChange={(v) => onChange({ descriptionWelcome: v })}
            placeholder="Welcome to the adventure..."
          />
        </FieldRow>
        <FieldRow label="Rules">
          <TextInput
            value={form.descriptionRules}
            onValueChange={(v) => onChange({ descriptionRules: v })}
            placeholder="Click to collect, earn points..."
          />
        </FieldRow>
      </InnerPanel>
    </div>
  );
};
