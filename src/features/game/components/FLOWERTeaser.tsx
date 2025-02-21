import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import tradeIcon from "assets/icons/trade.png";
import React from "react";
import { acknowledgeFLOWERTeaser } from "features/announcements/announcementsStorage";
import { useGame } from "../GameProvider";
import { Button } from "components/ui/Button";

export const FLOWERTeaserContent: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  const onAcknowledge = () => {
    acknowledgeFLOWERTeaser();
    gameService.send("ACKNOWLEDGE");
  };
  const FLOWER_TEASER_CONTENT = [
    {
      text: "$FLOWER is a new token that will replace $SFL in the game",
      image: "",
    },
    {
      text: "All $SFL will be converted to $FLOWER at a 1:1 ratio",
      image: tradeIcon,
    },
    {
      text: "$FLOWER campaigns will take place in April 2025, so stay tuned!",
      image: "",
    },
    {
      text: "Support for Ronin Chain will be added in the future.",
      image: SUNNYSIDE.icons.roninIcon,
    },
    {
      text: "Until Ronin Chain support is added, all transactions would be required to be on the Polygon Chain.",
      image: SUNNYSIDE.icons.polygonIcon,
    },
  ];
  return (
    <div className="p-2">
      <p className="text-lg text-center">{`$FLOWER is coming soon!`}</p>
      {FLOWER_TEASER_CONTENT.map(({ text, image }, index) => (
        <div className="flex mt-4" key={index}>
          <div className="w-16 flex justify-center">
            <img src={image} className="h-8" />
          </div>
          <div className="flex-1">
            <p>{text}</p>
          </div>
        </div>
      ))}
      <Button onClick={onAcknowledge} className="mt-4">
        {t("continue")}
      </Button>
      <p className="text-xs underline mt-2 text-center">
        <a
          href="https://docs.sunflower-land.com/getting-started/usdflower-erc20"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center"
        >
          {`Learn more about $FLOWER`}
        </a>
      </p>
    </div>
  );
};
