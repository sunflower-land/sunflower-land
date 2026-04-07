import React, { useCallback, useMemo, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import type { EditorFormState } from "../lib/types";
import { SectionHeader } from "../components/SectionHeader";
import { formToConfig } from "../lib/formToConfig";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const JsonTab: React.FC<{ form: EditorFormState }> = ({ form }) => {
  const { t } = useAppTranslation();
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="space-y-3">
      <InnerPanel className="p-3 space-y-3">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.expand}>
          {t("playerEconomyEditor.tab.json")}
        </SectionHeader>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          {t("playerEconomyEditor.jsonTab.intro")}
        </p>
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
