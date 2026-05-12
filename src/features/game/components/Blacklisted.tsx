import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";

interface Props {
  banReason?: string;
}

export const Blacklisted: React.FC<Props> = ({ banReason }) => {
  const { t } = useAppTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col p-2">
      <Label type="danger" icon={SUNNYSIDE.icons.cancel}>
        {t("farm.banned")}
      </Label>
      <p className="text-xs my-2">{t("statements.blacklist.one")}</p>
      {banReason && (
        <InnerPanel className="mb-2 -mx-1 -mr-1">
          <p className="text-xs">
            {banReason === "multi_accounting"
              ? t("statements.blacklist.multiAccounting")
              : t("statements.blacklist.funnelling")}
          </p>
        </InnerPanel>
      )}
      {!showInfo ? (
        <p
          className="text-xxs cursor-pointer underline self-end mt-1"
          onClick={() => setShowInfo(true)}
        >
          {t("statements.blacklist.whatIsThis")}
        </p>
      ) : (
        <div className="flex flex-col w-full mt-1">
          <p className="text-xs mb-2">
            {banReason === "multi_accounting"
              ? t("statements.blacklist.tos.multiAccounting")
              : t("statements.blacklist.tos.funnelling")}
          </p>
          <a
            href="https://tripy-discord-bot-production.up.railway.app/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xxs underline self-end"
          >
            {t("statements.blacklist.contactUs")}
          </a>
        </div>
      )}
    </div>
  );
};
