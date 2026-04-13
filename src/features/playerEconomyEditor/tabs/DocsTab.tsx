import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { SectionHeader } from "../components/SectionHeader";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

function ExampleBlock({ text }: { text: string }) {
  return (
    <pre
      className="w-full rounded-sm border-2 border-[#3e2731]/40 bg-black/25 p-2 text-xs font-mono text-amber-100/95 leading-snug overflow-x-auto whitespace-pre"
      spellCheck={false}
    >
      {text}
    </pre>
  );
}

export const DocsTab: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="space-y-3">
      <InnerPanel className="p-3 space-y-4">
        <SectionHeader type="info" icon={SUNNYSIDE.icons.indicator}>
          {t("playerEconomyEditor.tab.docs")}
        </SectionHeader>
        <p className="text-xs text-amber-100/90 leading-relaxed">
          {t("playerEconomyEditor.docsTab.intro")}
        </p>

        <div className="space-y-2">
          <SectionHeader type="info" icon={SUNNYSIDE.icons.expression_chat}>
            {t("playerEconomyEditor.docsTab.jwtHeading")}
          </SectionHeader>
          <p className="text-xs text-amber-100/90 leading-relaxed whitespace-pre-line">
            {t("playerEconomyEditor.docsTab.jwtBody")}
          </p>
        </div>

        <div className="space-y-2">
          <SectionHeader type="info" icon={SUNNYSIDE.icons.lightning}>
            {t("playerEconomyEditor.docsTab.minigameHeading")}
          </SectionHeader>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            {t("playerEconomyEditor.docsTab.minigameBody")}
          </p>
          <ExampleBlock
            text={t("playerEconomyEditor.docsTab.minigameExample")}
          />
        </div>

        <div className="space-y-2">
          <SectionHeader type="info" icon={SUNNYSIDE.icons.confirm}>
            {t("playerEconomyEditor.docsTab.scoreHeading")}
          </SectionHeader>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            {t("playerEconomyEditor.docsTab.scoreBody")}
          </p>
          <ExampleBlock text={t("playerEconomyEditor.docsTab.scoreExample")} />
        </div>
      </InnerPanel>
    </div>
  );
};
