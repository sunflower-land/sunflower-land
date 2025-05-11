import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { acknowledgeFLOWERTeaser } from "features/announcements/announcementsStorage";
import { useGame } from "../GameProvider";
import { Button } from "components/ui/Button";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import giftIcon from "assets/icons/gift.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Merkl } from "./modal/components/Merkl";

export const FLOWERTeaserContent: React.FC = () => {
  const [page, setPage] = useState(0);
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  const onAcknowledge = () => {
    acknowledgeFLOWERTeaser();
    gameService.send("ACKNOWLEDGE");
  };

  if (page === 1) {
    return <Merkl onClose={onAcknowledge} />;
  }

  return (
    <div className="relative scrollable overflow-auto pr-0.5 max-h-[500px]">
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute top-0 right-0.5 w-8 cursor-pointer"
        onClick={() => setPage(1)}
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
            text: t("flower.launch.one"),
            icon: flowerIcon,
          },
          {
            text: t("flower.launch.two"),
            icon: SUNNYSIDE.icons.confirm,
          },
          {
            text: t("flower.launch.three"),
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
        <Button onClick={() => setPage(1)} className="mt-2 mr-1">
          {t("close")}
        </Button>
        <Button
          onClick={() => {
            window.open(
              "https://app.uniswap.org/swap?chain=base&inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x3e12b9d6a4d12cd9b4a6d613872d0eb32f68b380&value=1&field=input",
              "_blank",
            );
          }}
          className="mt-2"
        >
          {t("buy")}
        </Button>
      </div>
    </div>
  );
};
