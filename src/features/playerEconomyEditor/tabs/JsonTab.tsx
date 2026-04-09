import React, { useCallback, useMemo, useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import type { EditorFormState } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { formToConfig } from "../lib/formToConfig";
import { configToForm } from "../lib/configToForm";
import { ensurePlayerEconomyConfig } from "../lib/editorApi";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  form: EditorFormState;
  updateForm: (update: (prev: EditorFormState) => EditorFormState) => void;
};

export const JsonTab: React.FC<Props> = ({ form, updateForm }) => {
  const { t } = useAppTranslation();
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importOk, setImportOk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const jsonText = useMemo(
    () => JSON.stringify(formToConfig(form), null, 2),
    [form],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [jsonText]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = String(reader.result ?? "");
          const parsed: unknown = JSON.parse(text);
          const config = ensurePlayerEconomyConfig(parsed);
          updateForm((prev) => configToForm(prev.slug, config));
          setImportError(null);
          setImportOk(true);
          window.setTimeout(() => setImportOk(false), 4000);
        } catch (err) {
          setImportOk(false);
          setImportError(
            err instanceof Error
              ? err.message
              : t("playerEconomyEditor.jsonTab.importError"),
          );
        }
      };
      reader.onerror = () => {
        setImportOk(false);
        setImportError(t("playerEconomyEditor.jsonTab.importReadError"));
      };
      reader.readAsText(file, "UTF-8");
    },
    [t, updateForm],
  );

  return (
    <div className="space-y-3">
      <InnerPanel className="p-3 space-y-3">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.expand}>
          {t("playerEconomyEditor.tab.json")}
        </SectionHeader>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          {t("playerEconomyEditor.jsonTab.intro")}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          aria-label={t("playerEconomyEditor.jsonTab.uploadAria")}
          onChange={handleFileChange}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => fileRef.current?.click()}
          >
            <span className="text-sm">
              {t("playerEconomyEditor.jsonTab.upload")}
            </span>
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => void handleCopy()}
          >
            <span className="text-sm">
              {copied
                ? t("playerEconomyEditor.jsonTab.copied")
                : t("playerEconomyEditor.jsonTab.copy")}
            </span>
          </Button>
        </div>
        <p className="text-xs text-amber-100/70 leading-relaxed">
          {t("playerEconomyEditor.jsonTab.uploadHint")}
        </p>
        {importError ? (
          <p className="text-xs text-red-300/95 leading-snug" role="alert">
            {importError}
          </p>
        ) : null}
        {importOk ? (
          <p className="text-xs text-green-300/90 leading-snug" role="status">
            {t("playerEconomyEditor.jsonTab.importApplied")}
          </p>
        ) : null}
        <textarea
          readOnly
          value={jsonText}
          spellCheck={false}
          className="w-full min-h-[280px] rounded-sm border-2 border-[#3e2731]/40 bg-black/25 p-2 text-xs font-mono text-amber-100/95 leading-snug resize-y focus:outline-none focus:ring-1 focus:ring-amber-600/50"
          aria-label={t("playerEconomyEditor.jsonTab.aria")}
        />
      </InnerPanel>
    </div>
  );
};
