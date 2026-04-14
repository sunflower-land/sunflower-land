import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import tier1BookIcon from "assets/icons/tier1_book.webp";
import { SectionHeader } from "../components/SectionHeader";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const DOC_TEXT = "text-xs text-[#3e2731] leading-relaxed";

function DocCodeExample({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="w-full rounded-sm border-2 border-[#3e2731]/25 bg-[#f5f0e6] p-2 overflow-x-auto"
      spellCheck={false}
    >
      <code className={`${DOC_TEXT} font-mono whitespace-pre block`}>
        {children}
      </code>
    </pre>
  );
}

export const DocsTab: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="space-y-3">
      <InnerPanel className="p-3 space-y-4">
        <SectionHeader type="default" icon={tier1BookIcon}>
          {t("playerEconomyEditor.docsTab.introHeading")}
        </SectionHeader>
        <p className={`${DOC_TEXT} whitespace-pre-line`}>
          {t("playerEconomyEditor.docsTab.intro")}
        </p>

        <div className="space-y-2">
          <SectionHeader type="default" icon={SUNNYSIDE.icons.expression_chat}>
            {t("playerEconomyEditor.docsTab.jwtHeading")}
          </SectionHeader>
          <p className={`${DOC_TEXT} whitespace-pre-line`}>
            {t("playerEconomyEditor.docsTab.jwtBody")}
          </p>
          <DocCodeExample>
            {t("playerEconomyEditor.docsTab.jwtHeaderExample")}
          </DocCodeExample>
        </div>
      </InnerPanel>

      <InnerPanel className="p-3 space-y-4">
        <SectionHeader type="default" icon={SUNNYSIDE.icons.lightning}>
          {t("playerEconomyEditor.docsTab.sessionHeading")}
        </SectionHeader>
        <p className={DOC_TEXT}>
          {t("playerEconomyEditor.docsTab.sessionBody")}
        </p>
        <DocCodeExample>
          {t("playerEconomyEditor.docsTab.sessionExample")}
        </DocCodeExample>
      </InnerPanel>

      <InnerPanel className="p-3 space-y-4">
        <SectionHeader type="default" icon={SUNNYSIDE.icons.confirm}>
          {t("playerEconomyEditor.docsTab.actionsHeading")}
        </SectionHeader>
        <p className={`${DOC_TEXT} whitespace-pre-line`}>
          {t("playerEconomyEditor.docsTab.actionsUsage")}
        </p>
        <DocCodeExample>
          {t("playerEconomyEditor.docsTab.actionsFetchExample")}
        </DocCodeExample>

        <div className="space-y-2 pt-2 border-t border-[#3e2731]/15">
          <SectionHeader type="default" icon={SUNNYSIDE.icons.hammer}>
            {t("playerEconomyEditor.docsTab.minigameHeading")}
          </SectionHeader>
          <p className={DOC_TEXT}>
            {t("playerEconomyEditor.docsTab.minigameBody")}
          </p>
          <DocCodeExample>
            {t("playerEconomyEditor.docsTab.minigameExample")}
          </DocCodeExample>
        </div>

        <div className="space-y-2">
          <SectionHeader type="default" icon={SUNNYSIDE.icons.timer}>
            {t("playerEconomyEditor.docsTab.generatorHeading")}
          </SectionHeader>
          <p className={DOC_TEXT}>
            {t("playerEconomyEditor.docsTab.generatorBody")}
          </p>
          <DocCodeExample>
            {t("playerEconomyEditor.docsTab.generatorExample")}
          </DocCodeExample>
        </div>

        <div className="space-y-2">
          <SectionHeader type="default" icon={SUNNYSIDE.icons.disc}>
            {t("playerEconomyEditor.docsTab.scoreHeading")}
          </SectionHeader>
          <p className={DOC_TEXT}>
            {t("playerEconomyEditor.docsTab.scoreBody")}
          </p>
          <DocCodeExample>
            {t("playerEconomyEditor.docsTab.scoreExample")}
          </DocCodeExample>
        </div>
      </InnerPanel>
    </div>
  );
};
