import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { setConsent, shouldShowConsentBanner } from "lib/analytics/consent";

const PRIVACY_URL = "https://docs.sunflower-land.com/support/terms-of-service";

/**
 * Ad-measurement consent, shown only where a banner is required (see
 * `lib/analytics/consent.ts`) and only until the player decides. Accepting
 * loads the Meta Pixel; declining keeps it off and tells the server at
 * signup to send events without browser identifiers.
 */
export const ConsentBanner: React.FC = () => {
  const { t } = useAppTranslation();
  const [show, setShow] = useState(() => shouldShowConsentBanner());

  if (!show) return null;

  const decide = (ads: boolean) => {
    setConsent(ads, "banner");
    setShow(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-2 flex justify-center pointer-events-none"
      role="dialog"
      aria-label={t("consent.title")}
    >
      <Panel className="pointer-events-auto w-full max-w-md">
        <div className="flex flex-col p-1 gap-2">
          <span className="text-sm">{t("consent.title")}</span>
          <span className="text-xs">
            {t("consent.description")}{" "}
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {t("consent.privacy")}
            </a>
          </span>
          <div className="flex gap-1">
            <Button onClick={() => decide(false)}>
              {t("consent.decline")}
            </Button>
            <Button onClick={() => decide(true)}>{t("consent.accept")}</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
};
