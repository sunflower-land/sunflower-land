import React from "react";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
const SyncClockGuide =
  "https://sunflowerland.freshdesk.com/en/support/solutions/articles/101000397200-how-to-sync-my-windows-clock-";

export const ClockIssue = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>{t("error.clock.not.synced")}</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-sm mt-2 mb-2">{t("statements.clock.one")}</span>
      <span className="text-sm mt-2 mb-2">{t("statements.clock.two")}</span>

      <div className="flex w-full">
        <Button
          onClick={() => {
            window.location.href = SyncClockGuide as string;
          }}
        >
          {t("statements.openGuide")}
        </Button>
      </div>
    </div>
  );
};
