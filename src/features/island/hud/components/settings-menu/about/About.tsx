import React from "react";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const DISCORD_INVITE = "https://discord.gg/sunflowerland";
const TERMS_URL = "https://docs.sunflower-land.com/support/terms-of-service";
const RELEASES_URL =
  "https://github.com/sunflower-land/sunflower-land/releases";

export const About: React.FC = () => {
  const { t } = useAppTranslation();
  const version = CONFIG.RELEASE_VERSION?.split("-")[0];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mx-2 mb-1">
        <span className="text-xs">{t("gameOptions.about.version")}</span>
        <span className="text-xs">{version}</span>
      </div>
      <Button onClick={() => window.open(RELEASES_URL, "_blank")}>
        {t("gameOptions.about.github")}
      </Button>
      <Button onClick={() => window.open(DISCORD_INVITE, "_blank")}>
        {t("gameOptions.about.discord")}
      </Button>
      <Button onClick={() => window.open(TERMS_URL, "_blank")}>
        {t("gameOptions.about.terms")}
      </Button>
    </div>
  );
};
