import React, { useMemo, useState, useCallback } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import type { PlayerEconomyConfig } from "features/minigame/lib/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { SectionHeader } from "../components/SectionHeader";
import type { EditorFormState } from "../lib/types";
import { formToConfig } from "../lib/formToConfig";
import { configToForm } from "../lib/configToForm";
import { ensurePlayerEconomyConfig } from "../lib/editorApi";

const BODY = "text-xs text-[#3e2731] leading-relaxed";

type Props = {
  form: EditorFormState;
  onApplyConfig: (config: PlayerEconomyConfig) => void;
};

export const JsonTab: React.FC<Props> = ({ form, onApplyConfig }) => {
  const { t } = useAppTranslation();

  const formatted = useMemo(
    () => JSON.stringify(formToConfig(form), null, 2),
    [form],
  );

  const [draft, setDraft] = useState(formatted);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const resetDraftFromForm = useCallback(() => {
    setDraft(formatted);
    setApplyError(null);
  }, [formatted]);

  const handleCopy = async () => {
    setCopyHint(null);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopyHint(t("copied"));
    } catch {
      setCopyHint(t("playerEconomyEditor.jsonTab.copyFailed"));
    }
    window.setTimeout(() => setCopyHint(null), 2000);
  };

  const handleApply = () => {
    setApplyError(null);
    try {
      const parsed: unknown = JSON.parse(draft);
      const config = ensurePlayerEconomyConfig(parsed);
      const nextForm = configToForm(form.slug, config);
      onApplyConfig(config);
      setDraft(JSON.stringify(formToConfig(nextForm), null, 2));
    } catch (e) {
      if (e instanceof SyntaxError) {
        setApplyError(t("playerEconomyEditor.jsonTab.invalidJson"));
        return;
      }
      setApplyError(
        e instanceof Error ? e.message : t("playerEconomyEditor.error.update"),
      );
    }
  };

  return (
    <div className="space-y-3">
      <InnerPanel className="p-3 space-y-3">
        <SectionHeader type="default" icon={SUNNYSIDE.icons.indicator}>
          {t("playerEconomyEditor.jsonTab.savedConfigHeading")}
        </SectionHeader>
        <p className={BODY}>
          {t("playerEconomyEditor.jsonTab.savedConfigIntro")}
        </p>
        <div className="rounded-sm border-2 border-[#3e2731]/25 bg-[#f5f0e6] overflow-hidden">
          <div className="flex items-center justify-end gap-1 px-2 py-1 border-b border-[#3e2731]/15 bg-[#ebe4d9]">
            <Button
              type="button"
              className="text-xs py-1 px-2"
              onClick={handleCopy}
            >
              {t("playerEconomyEditor.jsonTab.copy")}
            </Button>
          </div>
          <pre
            className="max-h-[min(40vh,280px)] overflow-auto p-2 m-0"
            spellCheck={false}
          >
            <code
              className={`${BODY} font-mono whitespace-pre block select-text`}
            >
              {formatted}
            </code>
          </pre>
        </div>
        {copyHint && (
          <Label type="default" className="!mb-0">
            {copyHint}
          </Label>
        )}
      </InnerPanel>

      <InnerPanel className="p-3 space-y-3">
        <SectionHeader type="default" icon={SUNNYSIDE.icons.settings}>
          {t("playerEconomyEditor.jsonTab.editHeading")}
        </SectionHeader>
        <p className={BODY}>{t("playerEconomyEditor.jsonTab.editIntro")}</p>
        <textarea
          className={`w-full min-h-[min(35vh,220px)] rounded-sm border-2 border-[#3e2731]/25 bg-[#f5f0e6] p-2 font-mono text-xs text-[#3e2731] resize-y`}
          spellCheck={false}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label={t("playerEconomyEditor.jsonTab.editHeading")}
        />
        {applyError && <Label type="danger">{applyError}</Label>}
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            className="flex-1 min-w-[8rem]"
            onClick={handleApply}
          >
            {t("playerEconomyEditor.jsonTab.apply")}
          </Button>
          <Button
            type="button"
            className="flex-1 min-w-[8rem]"
            onClick={resetDraftFromForm}
          >
            {t("playerEconomyEditor.jsonTab.resetDraft")}
          </Button>
        </div>
      </InnerPanel>
    </div>
  );
};
