import React from "react";

import { Button } from "components/ui/Button";
import token from "assets/icons/flower_token.webp";

import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { getReturnValues, useCountdown } from "lib/utils/hooks/useCountdown";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { Auction } from "features/game/lib/auctionMachine";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState } from "features/game/types/game";
import { getImageUrl } from "lib/utils/getImageURLS";
import classNames from "classnames";
import { getCurrentSeason } from "features/game/types/seasons";

type Props = {
  item: Auction;
  game: GameState;
  isUpcomingItem?: boolean;
  onDraftBid: () => void;
  onBack: () => void;
};

type TimeObject = {
  time: {
    days?: number;
    hours?: number;
    minutes: number;
    seconds: number;
  };
  fontSize?: number;
  color?: string;
};

export const TimerDisplay = ({ time, fontSize, color }: TimeObject) => {
  let timeKeys = getKeys(time);

  // remove day keys if days is 0
  if (time.days === 0) {
    timeKeys = timeKeys.filter((key) => key !== "days");
  }

  const times = timeKeys.map((key) => {
    const value = time[key as keyof TimeObject["time"]]
      ?.toString()
      .padStart(2, "0");

    return value;
  });

  return (
    <span
      className="font-secondary"
      style={{ color, fontSize: fontSize && `${fontSize}px` }}
    >
      {times.join(":")}
    </span>
  );
};

export const AuctionDetails: React.FC<Props> = ({
  game,
  isUpcomingItem,
  item,
  onDraftBid,
  onBack,
}) => {
  const releaseDate = item?.startAt as number;
  const releaseEndDate = item?.endAt as number;
  const start = useCountdown(releaseDate);
  const end = useCountdown(releaseEndDate);

  const isMintStarted = Date.now() > releaseDate;

  const isMintComplete = Date.now() > releaseEndDate;

  const { t } = useAppTranslation();

  const hasIngredients =
    getKeys(item.ingredients).every((name) =>
      (game.inventory[name] ?? new Decimal(0)).gte(item.ingredients[name] ?? 0),
    ) ?? false;

  const getMintButton = () => {
    const currentChapter = getCurrentSeason();
    const isNotGreatBloom = currentChapter !== "Great Bloom";
    const isGoldenSheep = isCollectible && item.collectible === "Golden Sheep";

    if (isNotGreatBloom || isGoldenSheep) {
      const hasMintedThisChapter = isCollectible
        ? !!game.auctioneer.minted?.[currentChapter]?.[item.collectible]
        : !!game.auctioneer.minted?.[currentChapter]?.[item.wearable];

      if (hasMintedThisChapter) {
        return <Label type="info">{t("alr.minted")}</Label>;
      }
    } else if (
      isCollectible
        ? !!game.inventory[item.collectible]
        : !!game.wardrobe[item.wearable]
    ) {
      return <Label type="info">{t("alr.minted")}</Label>;
    }

    if (isUpcomingItem) {
      return null;
    }

    return (
      <Button
        disabled={!isMintStarted || isMintComplete || !hasIngredients}
        onClick={onDraftBid}
      >
        {t("bid")}
      </Button>
    );
  };

  const isCollectible = item.type === "collectible";

  const image = isCollectible
    ? ITEM_DETAILS[item.collectible].image
    : getImageUrl(ITEM_IDS[item.wearable]);

  const buffLabel = isCollectible
    ? COLLECTIBLE_BUFF_LABELS(game)[item.collectible]
    : BUMPKIN_ITEM_BUFF_LABELS[item.wearable];
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center mx-auto relative">
        <div className="flex items-center justify-between w-full pb-1">
          <img
            onClick={onBack}
            src={SUNNYSIDE.icons.arrow_left}
            className="h-8 cursor-pointer"
          />
          <p className="absolute left-1/2 transform -translate-x-1/2 text-center max-w-[80%] sm:max-w-none">
            {isCollectible ? item.collectible : item.wearable}
          </p>
          <Label type="default">
            {isCollectible ? t("collectible") : t("wearable")}
          </Label>
        </div>

        {buffLabel && (
          <div className="flex flex-col gap-1">
            {buffLabel.map(
              (
                { labelType, boostTypeIcon, boostedItemIcon, shortDescription },
                index,
              ) => (
                <Label
                  key={index}
                  type={labelType}
                  icon={boostTypeIcon}
                  secondaryIcon={boostedItemIcon}
                >
                  {shortDescription}
                </Label>
              ),
            )}
          </div>
        )}

        <p className="text-center text-xs mb-3">
          {isCollectible ? ITEM_DETAILS[item.collectible].description : ""}
        </p>

        <div className="relative mb-2">
          {isCollectible && (
            <img
              src={SUNNYSIDE.ui.grey_background}
              className="absolute inset-0 w-48 h-48 rounded-md"
            />
          )}
          <div className="w-48 h-48 relative">
            <img
              src={image}
              className={classNames({
                "absolute w-1/2 h-1/2 z-20 object-contain mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2":
                  isCollectible,
                "w-48 h-48 rounded-md z-20 object-contain": !isCollectible,
              })}
            />
            <Label type="default" className="mb-2 absolute top-2 right-2">
              {`${item.supply} available`}
            </Label>
          </div>
        </div>
      </div>

      <div className="mb-2 flex flex-col items-center">
        <span className="text-xs mb-1">{t("auction.requirement")}</span>
        <div className="flex items-center justify-center">
          {item.sfl > 0 && (
            <div className="flex items-center">
              <img src={token} className="h-6" />
            </div>
          )}
          {getKeys(item.ingredients).map((name) => (
            <div className="flex items-center ml-1" key={name}>
              <img src={ITEM_DETAILS[name].image} className="h-6" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around flex-wrap">
        <div className="flex flex-col items-center w-48 mb-2">
          <a
            href="https://docs.sunflower-land.com/player-guides/auctions#auction-period"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mb-1"
          >
            {t("auction.start")}
          </a>
          {isMintStarted ? (
            <Label type="warning" className="mt-1">
              {t("auction.live")}
            </Label>
          ) : (
            TimerDisplay({ time: start })
          )}
        </div>
        <div className="flex flex-col items-center w-48 mb-2">
          <a
            href="https://docs.sunflower-land.com/player-guides/auctions#auction-period"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline mb-1"
          >
            {t("auction.period")}
          </a>
          {isMintComplete ? (
            <Label type="danger" className="mt-1">
              {t("auction.closed")}
            </Label>
          ) : isMintStarted ? (
            TimerDisplay({ time: end })
          ) : (
            TimerDisplay({
              time: getReturnValues(releaseEndDate - releaseDate),
            })
          )}
        </div>
      </div>

      {getMintButton()}
    </div>
  );
};
