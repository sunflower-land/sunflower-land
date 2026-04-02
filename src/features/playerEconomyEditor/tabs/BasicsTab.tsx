import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { TextInput } from "components/ui/TextInput";
import { SUNNYSIDE } from "assets/sunnyside";
import type { EditorFormState } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { FieldRow } from "../components/FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const BasicsTab: React.FC<{
  form: EditorFormState;
  mode: "create" | "edit";
  onChange: (next: Partial<EditorFormState>) => void;
}> = ({ form, mode, onChange }) => {
  const { t } = useAppTranslation();
  return (
    <div className="space-y-3">
      {/* Game Identity */}
      <InnerPanel className="p-3 space-y-2">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.player}>
          {t("playerEconomyEditor.basics.gameIdentity")}
        </SectionHeader>
        <FieldRow label="Slug">
          <TextInput
            value={form.slug}
            onValueChange={(slug) => onChange({ slug })}
            maxLength={60}
            placeholder="my-cool-minigame"
            className={mode === "edit" ? "pointer-events-none opacity-70" : ""}
          />
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
