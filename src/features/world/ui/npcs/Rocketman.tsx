import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import flowerIcon from "assets/icons/flower_token.webp";
import trophyIcon from "assets/icons/trophy.png";
import tradeIcon from "assets/icons/trade.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useGame } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { NumberInput } from "components/ui/NumberInput";
import { Decimal } from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import { MachineState } from "features/game/lib/gameMachine";
import {
  DAILY_LIMIT,
  EXCHANGE_FLOWER_PRICE,
} from "features/game/events/landExpansion/exchangeFLOWER";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasVipAccess } from "features/game/lib/vipAccess";

interface Props {
  onClose: () => void;
}
const _state = (state: MachineState) => state.context.state;

export const Rocketman: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();

  const [currentTab, setCurrentTab] = useState<"Noticeboard">("Noticeboard");

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES["rocket man"]}
        message={[
          {
            text: t("rocketman.intro"),
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["rocket man"]}
      onClose={onClose}
      tabs={[
        {
          icon: SUNNYSIDE.icons.stopwatch,
          name: t("noticeboard"),
          id: "Noticeboard",
        },
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === "Noticeboard" && <RocketmanNoticeboard />}
    </CloseButtonPanel>
  );
};

const RocketmanNoticeboard: React.FC = () => {
  const { t } = useAppTranslation();
  const countdown = useCountdown(new Date("2025-05-01").getTime());

  return (
    <div>
      <div className="p-1">
        <div className="flex justify-between items-center mr-8 mb-2">
          <Label type="vibrant">{t("rocketman.flower.exchange")}</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            <TimerDisplay time={countdown} />
          </Label>
        </div>
        <NoticeboardItems
          items={[
            {
              icon: SUNNYSIDE.icons.stopwatch,
              text: t("rocketman.flower.exchange.one"),
            },
            {
              icon: tradeIcon,
              text: t("rocketman.flower.exchange.two"),
            },
            {
              icon: trophyIcon,
              text: t("rocketman.flower.compete"),
            },
            {
              icon: ITEM_DETAILS["Love Charm"].image,
              text: t("rocketman.flower.social"),
            },
            {
              icon: flowerIcon,
              text: t("rocketman.flower.eligible"),
            },
          ]}
        />
      </div>
      <Button
        className="mr-1"
        onClick={() => {
          window.open(
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20",
            "_blank",
          );
        }}
      >
        {t("read.more")}
      </Button>
    </div>
  );
};

interface FlowerExchangeProps {
  onClose: () => void;
}

export const FlowerExchange: React.FC<FlowerExchangeProps> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { gameService, gameState } = useGame();

  const loveCharmCount =
    gameState.context.state.inventory["Love Charm"] ?? new Decimal(0);
  const [loveCharms, setLoveCharms] = useState(0);
  const [flower, setFlower] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const loveCharmIcon = ITEM_DETAILS["Love Charm"].image;

  const handleExchange = () => {
    gameService.send({ type: "exchange.flower", amount: loveCharms });
    onClose();
  };

  const state = useSelector(gameService, _state);
  const loveCharmsSpent =
    state.flower?.history?.[new Date().toISOString().split("T")[0]]
      ?.loveCharmsSpent ?? 0;
  const willExceedDailyLimit = loveCharmsSpent + loveCharms > DAILY_LIMIT;

  if (!isFaceVerified({ game: state })) {
    return <FaceRecognition />;
  }

  const isVIP = hasVipAccess({ game: state });
  if (!isVIP) {
    return (
      <div className="p-1">
        <Label type="danger" icon={flowerIcon}>
          {t("goblinTrade.vipRequired")}
        </Label>
        <p className="text-sm  my-2">{t("rocketman.vip")}</p>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          {t("close")}
        </Button>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col m-2 gap-2">
        <div className="flex flex-wrap justify-between gap-1">
          <Label type="default" icon={flowerIcon}>
            {t("flower.exchange.title")}
          </Label>
          <Label type="warning" icon={flowerIcon} secondaryIcon={loveCharmIcon}>
            {t("flower.exchange.price", {
              exchangeRate: EXCHANGE_FLOWER_PRICE,
            })}
          </Label>
        </div>
        <p>{t("flower.exchange.confirm")}</p>
        <div className="flex flex-row justify-evenly gap-2 text-base">
          <div className="flex items-center gap-2">
            <p>{`${loveCharms}`}</p>
            <img src={loveCharmIcon} className="h-8" />
          </div>
          <img src={SUNNYSIDE.icons.arrow_right} className="h-8" />
          <div className="flex items-center gap-2">
            <p>{`${flower}`}</p>
            <img src={flowerIcon} className="h-8" />
          </div>
        </div>
        <div className="flex flex-row justify-evenly gap-2 text-base">
          <Button onClick={() => setShowConfirmation(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleExchange}>{t("confirm")}</Button>
        </div>
      </div>
    );
  }

  const isOutOfRange =
    loveCharmsSpent >= DAILY_LIMIT ||
    loveCharms < 50 ||
    willExceedDailyLimit ||
    loveCharmCount.lt(loveCharms);

  return (
    <div className="flex flex-col m-2 gap-2">
      <div className="flex flex-wrap justify-between gap-1">
        <Label type="default" icon={flowerIcon}>
          {t("flower.exchange.title")}
        </Label>
        <Label type="warning" icon={flowerIcon} secondaryIcon={loveCharmIcon}>
          {t("flower.exchange.price", { exchangeRate: EXCHANGE_FLOWER_PRICE })}
        </Label>
      </div>
      <div className="flex flex-row justify-between gap-1">
        <Label type="info" icon={loveCharmIcon}>
          {t("flower.exchange.inventory", { loveCharmCount })}
        </Label>
        <Label
          type={loveCharmsSpent > DAILY_LIMIT ? "danger" : "default"}
          icon={loveCharmIcon}
        >
          {t("flower.exchange.dailyLimit", {
            loveCharmsSpent,
            dailyLimit: DAILY_LIMIT,
          })}
        </Label>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <Label type="default" icon={loveCharmIcon}>
            {`Love Charms`}
          </Label>
          <NumberInput
            value={loveCharms}
            maxDecimalPlaces={0}
            isOutOfRange={isOutOfRange}
            onValueChange={(value) => {
              setLoveCharms(value.toNumber());
              const estimated = setPrecision(
                new Decimal(value).div(EXCHANGE_FLOWER_PRICE),
              );
              setFlower(estimated.toNumber());
            }}
          />
        </div>
        {/* Read only - Value is calculated from Love Charms */}
        <div className="flex flex-col items-end gap-1">
          <Label type="default" icon={flowerIcon}>
            {t("flower.exchange.youWillReceive")}
          </Label>
          <div className="flex items-center gap-2">
            <p>{`${flower}`}</p>
            <img src={flowerIcon} className="h-8" />
          </div>
        </div>
      </div>
      {isOutOfRange && (
        <Label type="danger">
          {willExceedDailyLimit || loveCharmsSpent >= DAILY_LIMIT
            ? t("flower.exchange.error.max")
            : loveCharms < 50
              ? t("flower.exchange.error.min")
              : loveCharmCount.lt(loveCharms)
                ? t("flower.exchange.error.balance")
                : ""}
        </Label>
      )}
      <div className="flex flex-row justify-between gap-1">
        <Button onClick={onClose}>{t("close")}</Button>
        <Button
          disabled={isOutOfRange}
          onClick={() => setShowConfirmation(true)}
        >
          {t("flower.exchange.button")}
        </Button>
      </div>
    </div>
  );
};
