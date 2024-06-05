import React from "react";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import {
  TwitterShareButton,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  XIcon,
} from "react-share";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Faction } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { capitalize } from "lib/utils/capitalize";

interface Props {
  faction: Faction;
  onBack: () => void;
}

export const ShareClaimedEmblems: React.FC<Props> = ({ faction, onBack }) => {
  const shareMessage = `I just received ${
    faction.points
  } Emblems in Sunflower Land! I am now an owner in the ${capitalize(
    faction.name
  )} Faction! 🌻🚀 \n\n https://www.sunflower-land.com \n\n #SunflowerLand #ClashOfFactions`;

  const { t } = useAppTranslation();

  const clicked = (method: "Reddit" | "Twitter" | "Telegram" | "Facebook") => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=18434190870996612736-AP&client_type=gtag#share
    onboardingAnalytics.logEvent("share", {
      method,
      content_type: "text",
      item_id: "emblems_airdropped",
    });
  };

  return (
    <>
      <div className="pb-2">
        <Label type="default">{t("share")}</Label>
      </div>
      <div className="flex">
        <TwitterShareButton
          url={" "}
          title={shareMessage}
          className="mr-1"
          onClick={() => clicked("Twitter")}
        >
          <XIcon size={40} round />
        </TwitterShareButton>
        <TelegramShareButton
          url={" "}
          title={shareMessage}
          className="mr-1"
          onClick={() => clicked("Telegram")}
        >
          <TelegramIcon size={40} round />
        </TelegramShareButton>
        <FacebookShareButton
          url={"sunflower-land.com"}
          className="mr-1"
          onClick={() => clicked("Facebook")}
        >
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <RedditShareButton
          url={" "}
          title={shareMessage}
          onClick={() => clicked("Reddit")}
        >
          <RedditIcon size={40} round />
        </RedditShareButton>
      </div>
      <Button className="mt-2" onClick={onBack}>
        {t("back")}
      </Button>
    </>
  );
};
