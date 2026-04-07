import React, { useEffect, useMemo } from "react";
import { InnerPanel } from "components/ui/Panel";
import { TextInput } from "components/ui/TextInput";
import { Dropdown } from "components/ui/Dropdown";
import Switch from "components/ui/Switch";
import { SUNNYSIDE } from "assets/sunnyside";
import type { EditorFormState } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { FieldRow } from "../components/FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  canonicalHostedMinigamePlayUrl,
  looksLikeMinigamesSunflowerLandUrl,
} from "../lib/hostedMinigameUrl";

const MAIN_CURRENCY_AUTO_VALUE = "__main_currency_auto__";

export const BasicsTab: React.FC<{
  form: EditorFormState;
  mode: "create" | "edit";
  onChange: (next: Partial<EditorFormState>) => void;
}> = ({ form, mode, onChange }) => {
  const { t } = useAppTranslation();

  const activeItemCount = useMemo(
    () => form.items.filter((i) => !i.deleted).length,
    [form.items],
  );

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

  const slugTrim = form.slug.trim();
  const canonicalPlayUrl = slugTrim
    ? canonicalHostedMinigamePlayUrl(slugTrim)
    : "";
  const hostedMinigamesEnabled =
    Boolean(canonicalPlayUrl) && form.playUrl.trim() === canonicalPlayUrl;

  useEffect(() => {
    const p = form.playUrl.trim();
    if (!slugTrim) {
      if (p && looksLikeMinigamesSunflowerLandUrl(p)) {
        onChange({ playUrl: "" });
      }
      return;
    }
    const expected = canonicalHostedMinigamePlayUrl(slugTrim);
    if (looksLikeMinigamesSunflowerLandUrl(p) && p !== expected) {
      onChange({ playUrl: expected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync hosted URL to slug; onChange is stable enough via parent updateForm
  }, [slugTrim, form.playUrl]);

  const onToggleHostedMinigames = () => {
    if (hostedMinigamesEnabled) {
      onChange({ playUrl: "" });
      return;
    }
    if (!slugTrim) return;
    onChange({ playUrl: canonicalHostedMinigamePlayUrl(slugTrim) });
  };

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
        {activeItemCount > 0 ? (
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
        ) : null}
        <div className="space-y-2 w-full">
          <Switch
            checked={hostedMinigamesEnabled}
            onChange={onToggleHostedMinigames}
            disabled={!slugTrim && !hostedMinigamesEnabled}
            label={t("playerEconomyEditor.basics.customMinigamesSupported")}
          />
          {!slugTrim ? (
            <p className="text-[10px] opacity-60 leading-snug ml-1">
              {t("playerEconomyEditor.basics.setSlugFirstForHosted")}
            </p>
          ) : null}
          {hostedMinigamesEnabled ? (
            <>
              <p className="text-xs break-all font-mono text-amber-100/95 leading-snug select-all ml-1">
                {canonicalPlayUrl}
              </p>
              <p className="text-xs text-amber-100/75 leading-snug ml-1">
                {t("playerEconomyEditor.basics.customMinigamesDeployHint")}
              </p>
            </>
          ) : null}
        </div>
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
