import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";

interface Props {
  banReason?: string;
}

export const Blacklisted: React.FC<Props> = ({ banReason }) => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">{t("farm.banned")}</span>
      <img
        src={SUNNYSIDE.npcs.suspiciousGoblin}
        alt="Warning"
        className="w-16 m-2"
      />
      <span className="text-sm mt-2 mb-2">{t("statements.blacklist.one")}</span>
      {banReason && (
        <InnerPanel className="w-full mt-2 mb-2">
          <p className="text-sm text-center">{banReason}</p>
        </InnerPanel>
      )}
      <span className="text-sm mt-2 mb-1">
        {t("statements.blacklist.discord")}
      </span>
      <a
        href="https://tripy-discord-bot-production.up.railway.app/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline"
      >
        {t("statements.blacklist.noDiscord")}
      </a>
    </div>
  );
};
