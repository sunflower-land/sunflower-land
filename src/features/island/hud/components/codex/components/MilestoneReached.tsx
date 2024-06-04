import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  MILESTONE_MESSAGES,
  MilestoneName,
} from "features/game/types/milestones";
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
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  milestoneName: MilestoneName;
  onClose: () => void;
}
export const MilestoneReached: React.FC<Props> = ({
  milestoneName,
  onClose,
}) => {
  const shareMessage = `Just reached the milestone ${milestoneName} in Sunflower Land! So proud of my progress in this game. 🌻🚀 \n\n https://www.sunflower-land.com \n\n #SunflowerLand #LevelUp`;

  const { t } = useAppTranslation();

  const clicked = (method: "Reddit" | "Twitter" | "Telegram" | "Facebook") => {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=18434190870996612736-AP&client_type=gtag#share
    onboardingAnalytics.logEvent("share", {
      method,
      content_type: "text",
      item_id: "milestone_reached",
    });
  };

  return (
    <Panel bumpkinParts={NPC_WEARABLES.hank}>
      <div className="flex flex-col items-center p-2">
        <div className="w-11/12 rounded-lg shadow-md overflow-hidden mb-1">
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-${(PIXEL_SCALE * 16) / 2}px,-${
                PIXEL_SCALE * 56
              }px)`,
            }}
          ></div>
        </div>
        <p className="text-sm text-center">
          {MILESTONE_MESSAGES[milestoneName] ?? "Wow, I am lost for words!"}
        </p>
        <div className="flex mt-2 mb-1 underline">
          <p className="text-xxs">{t("share")}</p>
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
      </div>
      <Button className="mt-2" onClick={onClose}>
        {t("ok")}
      </Button>
    </Panel>
  );
};
