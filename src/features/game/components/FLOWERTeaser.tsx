import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { acknowledgeFLOWERTeaser } from "features/announcements/announcementsStorage";
import { useGame } from "../GameProvider";
import { Button } from "components/ui/Button";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import giftIcon from "assets/icons/gift.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const FLOWERTeaserContent: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  const onAcknowledge = () => {
    acknowledgeFLOWERTeaser();
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <div className="relative scrollable overflow-auto pr-0.5 max-h-[500px]">
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute top-0 right-0.5 w-8 cursor-pointer"
        onClick={onAcknowledge}
      />
      <Label icon={newsIcon} type="default" className="ml-2 mt-1">
        {t("news.title")}
      </Label>
      <img
        src={SUNNYSIDE.announcement.rocketFlower}
        className="w-full my-2 rounded-sm"
      />

      <NoticeboardItems
        items={[
          {
            text: "Buy $FLOWER on Uniswap BASE.",
            icon: flowerIcon,
          },
          {
            text: "Deposits are enabled.",
            icon: SUNNYSIDE.icons.confirm,
          },
          {
            text: "Liquidity rewards and withdrawals starting soon.",
            icon: giftIcon,
          },
        ]}
      />

      <p
        className="text-xs underline mx-1 cursor-pointer"
        onClick={() => {
          window.open(
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20",
            "_blank",
          );
        }}
      >
        {t("read.more")}
      </p>

      <div className="flex justify-center">
        <Button onClick={onAcknowledge} className="mt-2 mr-1">
          {t("close")}
        </Button>
        <Button
          onClick={() => {
            // TODO: Add Uniswap BASE link
            window.open("https://app.uniswap.org/", "_blank");
          }}
          className="mt-2"
        >
          {t("buy")}
        </Button>
      </div>
    </div>
  );
};
