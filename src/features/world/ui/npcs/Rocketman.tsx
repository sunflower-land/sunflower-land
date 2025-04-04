import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import flowerIcon from "assets/icons/flower_token.webp";
import shopIcon from "assets/icons/shop.png";
import trophyIcon from "assets/icons/trophy.png";
import tradeIcon from "assets/icons/trade.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { NumberInput } from "components/ui/NumberInput";
import { Decimal } from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { RewardShop } from "../loveRewardShop/RewardShop";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";

interface Props {
  onClose: () => void;
}
const _state = (state: MachineState) => state.context.state;

export const Rocketman: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const hasFlowerExchange = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "LOVE_CHARM_FLOWER_EXCHANGE"),
  );

  const hasRewardShop = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "LOVE_CHARM_REWARD_SHOP"),
  );

  const state = useSelector(gameService, _state);

  const [currentTab, setCurrentTab] = useState<
    "Noticeboard" | "$FLOWER Exchange" | "Reward Shop"
  >(hasFlowerExchange ? "$FLOWER Exchange" : "Noticeboard");
  const loveCharmCount = useSelector(
    gameService,
    (state) => state.context.state.inventory["Love Charm"] ?? new Decimal(0),
  );

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
        ...(hasFlowerExchange
          ? [
              {
                icon: flowerIcon,
                name: "$FLOWER Exchange",
              },
            ]
          : [
              {
                icon: SUNNYSIDE.icons.stopwatch,
                name: "Noticeboard",
              },
            ]),
        ...(hasRewardShop ? [{ name: "Reward Shop", icon: shopIcon }] : []),
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === "Noticeboard" && <RocketmanNoticeboard />}
      {currentTab === "$FLOWER Exchange" && (
        <FlowerExchange
          loveCharmCount={loveCharmCount}
          gameService={gameService}
          onClose={onClose}
        />
      )}
      {currentTab === "Reward Shop" && <RewardShop state={state} />}
    </CloseButtonPanel>
  );
};

const RocketmanNoticeboard: React.FC = () => {
  const { t } = useAppTranslation();
  const countdown = useCountdown(new Date("2025-04-14").getTime());

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
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20/schedule",
            "_blank",
          );
        }}
      >
        {t("read.more")}
      </Button>
    </div>
  );
};

const EXCHANGE_RATE = 50; // Future: Update exchange rate dynamically

interface FlowerExchangeProps {
  loveCharmCount: Decimal;
  gameService: MachineInterpreter;
  onClose: () => void;
}

const FlowerExchange: React.FC<FlowerExchangeProps> = ({
  loveCharmCount,
  gameService,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const [loveCharms, setLoveCharms] = useState(0);
  const [flower, setFlower] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const loveCharmIcon = ITEM_DETAILS["Love Charm"].image;

  const handleExchange = () => {
    gameService.send("exchange.flower", { amount: loveCharms });
    onClose();
  };

  const state = useSelector(gameService, _state);

  if (
    hasFeatureAccess(state, "FACE_RECOGNITION") &&
    !isFaceVerified({ game: state })
  ) {
    return <FaceRecognition />;
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col m-2 gap-2">
        <div className="flex flex-wrap justify-between gap-1">
          <Label type="default" icon={flowerIcon}>
            {t("flower.exchange.title")}
          </Label>
          <Label type="warning" icon={flowerIcon} secondaryIcon={loveCharmIcon}>
            {t("flower.exchange.price", { exchangeRate: EXCHANGE_RATE })}
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
    loveCharms < 50 || loveCharms > 10000 || loveCharmCount.lt(loveCharms);

  return (
    <div className="flex flex-col m-2 gap-2">
      <div className="flex flex-wrap justify-between gap-1">
        <Label type="default" icon={flowerIcon}>
          {t("flower.exchange.title")}
        </Label>
        <Label type="warning" icon={flowerIcon} secondaryIcon={loveCharmIcon}>
          {t("flower.exchange.price", { exchangeRate: EXCHANGE_RATE })}
        </Label>
      </div>
      <Label type="info" icon={loveCharmIcon}>
        {t("flower.exchange.inventory", { loveCharmCount })}
      </Label>
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
                new Decimal(value).div(EXCHANGE_RATE),
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
          {loveCharms < 50
            ? t("flower.exchange.error.min")
            : loveCharms > 10000
              ? t("flower.exchange.error.max")
              : loveCharmCount.lt(loveCharms)
                ? t("flower.exchange.error.balance")
                : ""}
        </Label>
      )}
      <Button disabled={isOutOfRange} onClick={() => setShowConfirmation(true)}>
        {t("flower.exchange.button")}
      </Button>
    </div>
  );
};
