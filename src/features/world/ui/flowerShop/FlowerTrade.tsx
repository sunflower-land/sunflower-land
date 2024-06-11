import { Label } from "components/ui/Label";
import bg from "assets/ui/grey_background.png";
import React, { useContext } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { FlowerName } from "features/game/types/flowers";
import { getSeasonalTicket } from "features/game/types/seasons";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { TICKETS_REWARDED } from "features/game/events/landExpansion/tradeFlowerShop";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FlowerShop } from "features/game/types/game";

interface CompleteProps {
  desiredFlower: FlowerName;
  flowerCount: number;
  alreadyComplete: boolean;
}

const Complete: React.FC<CompleteProps> = ({
  desiredFlower,
  flowerCount,
  alreadyComplete,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  if (alreadyComplete) {
    return <Label type="info">{t("alr.completed")}</Label>;
  }

  return (
    <>
      <Button
        disabled={flowerCount < 1}
        onClick={() =>
          gameService.send("flowerShop.traded", { flower: desiredFlower })
        }
      >
        {`Trade for ${TICKETS_REWARDED} ${getSeasonalTicket()}${
          TICKETS_REWARDED > 0 ? "s" : ""
        }`}
      </Button>
    </>
  );
};

interface Props {
  flowerShop: FlowerShop;
  flowerCount: number;
}

export const FlowerTrade: React.FC<Props> = ({ flowerShop, flowerCount }) => {
  const desiredFlower = flowerShop.weeklyFlower;
  const desiredFlowerImage = ITEM_DETAILS[desiredFlower].image;
  const { t } = useAppTranslation();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const sevenDaysSeconds = sevenDays / 1000;

  const weekStartTime = flowerShop.week;
  const currentTime = Date.now();

  const percentageOfWeek = (currentTime - weekStartTime) / sevenDays;
  const remainingSecondsInWeek =
    sevenDaysSeconds - Math.floor(percentageOfWeek * sevenDaysSeconds);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center mx-auto">
        <p className="text-center text-sm mb-3">
          {t("flowerShop.do.have.trade.one", { desiredFlower: desiredFlower })}
        </p>
        <div className="relative mb-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={desiredFlowerImage}
              className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <Label type="warning" className="my-1 mx-auto">
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
            <span>
              {`${t("offer.end")} ${secondsToString(remainingSecondsInWeek, {
                length: "medium",
                removeTrailingZeros: true,
              })}`}
            </span>
          </div>
        </Label>
      </div>
      <Complete
        flowerCount={flowerCount}
        alreadyComplete={!!flowerShop.tradedFlowerShop}
        desiredFlower={desiredFlower}
      />
    </div>
  );
};
