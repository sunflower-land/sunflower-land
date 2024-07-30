import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
const SyncClockGuide =
  "https://sunflowerland.freshdesk.com/en/support/solutions/articles/101000512679-how-to-fix-clock-not-in-sync-error";

export const ClockIssue: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>{t("error.clock.not.synced")}</span>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <span className="text-sm mt-2 mb-2">{t("statements.clock.one")}</span>
      <span className="text-sm mt-2 mb-2">{t("statements.clock.two")}</span>

      <div className="flex w-full">
        <Button
          onClick={() => {
            window.open(SyncClockGuide, "_blank");
          }}
        >
          {t("statements.openGuide")}
        </Button>
      </div>
    </div>
  );
};
