import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";

interface Props {
  banReason?: string;
  /**
   * Free text written by the enforcement action itself, shown verbatim.
   *
   * Takes precedence over `banReason` when both are present: it was authored
   * for this specific ban, whereas `banReason` only picks between the two
   * canned explanations below. Server-authored, so unlike the rest of this
   * panel it is not translated.
   */
  banMessage?: string;
}

export const Blacklisted: React.FC<Props> = ({ banReason, banMessage }) => {
  const { t } = useAppTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col p-2">
      <Label type="danger" icon={SUNNYSIDE.icons.cancel}>
        {t("farm.banned")}
      </Label>
      <p className="text-xs my-2">{t("statements.blacklist.one")}</p>
      {(banMessage || banReason) && (
        <InnerPanel className="mb-2 -mx-1 -mr-1">
          <p className="text-xs">
            {banMessage
              ? banMessage
              : banReason === "multi_accounting"
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
          {/*
            A custom message already explains this specific ban, and the canned
            paragraphs below are written about multi accounting and funnelling
            — pairing one of those with an unrelated custom message would tell
            the player the wrong thing. So when a custom message is present, go
            straight to the contact link.
          */}
          {!banMessage && (
            <p className="text-xs mb-2">
              {banReason === "multi_accounting"
                ? t("statements.blacklist.tos.multiAccounting")
                : t("statements.blacklist.tos.funnelling")}
            </p>
          )}
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
