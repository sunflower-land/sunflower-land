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
import trophyIcon from "assets/icons/trophy.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { NumberInput } from "components/ui/NumberInput";
import { Decimal } from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
}

export const Rocketman: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();
  const [currentTab, setCurrentTab] = useState<
    "Noticeboard" | "FLOWER Exchange"
  >("Noticeboard");
  const { gameService } = useContext(Context);
  const hasFlowerExchange = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "LOVE_CHARM_FLOWER_EXCHANGE"),
  );
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
        {
          icon: SUNNYSIDE.icons.stopwatch,
          name: "Noticeboard",
        },
        ...(hasFlowerExchange
          ? [
              {
                icon: flowerIcon,
                name: "FLOWER Exchange",
              },
            ]
          : []),
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === "Noticeboard" && <RocketmanNoticeboard />}
      {currentTab === "FLOWER Exchange" && (
        <FlowerExchange
          loveCharmCount={loveCharmCount}
          gameService={gameService}
          onClose={onClose}
        />
      )}
    </CloseButtonPanel>
  );
};

const RocketmanNoticeboard: React.FC = () => {
  const { t } = useAppTranslation();
  const countdown = useCountdown(new Date("2025-04-01").getTime());

  return (
    <div>
      <div className="p-1">
        <div className="flex justify-between items-center mr-8 mb-2">
          <Label type="vibrant">{t("rocketman.flower.coming")}</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            <TimerDisplay time={countdown} />
          </Label>
        </div>
        <NoticeboardItems
          items={[
            {
              icon: SUNNYSIDE.icons.stopwatch,
              text: t("rocketman.flower.launch"),
            },
            {
              icon: trophyIcon,
              text: t("rocketman.flower.compete"),
            },
            {
              icon: SUNNYSIDE.icons.heart,
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
  const [loveCharms, setLoveCharms] = useState(0);
  const [flower, setFlower] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const loveCharmIcon = ITEM_DETAILS["Love Charm"].image;

  const handleExchange = () => {
    gameService.send("exchange.flower", { amount: loveCharms });
    onClose();
  };

  if (showConfirmation) {
    return (
      <div className="flex flex-col m-1 gap-2">
        <p>{`Are you sure you want to perform the following exchange?`}</p>
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
          <Button onClick={() => setShowConfirmation(false)}>{`Cancel`}</Button>
          <Button onClick={handleExchange}>{`Confirm`}</Button>
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
          {`Exchange FLOWER`}
        </Label>
        <Label type="warning" icon={flowerIcon} secondaryIcon={loveCharmIcon}>
          {`1 FLOWER = ${EXCHANGE_RATE} Love Charms`}
        </Label>
      </div>
      <Label type="info" icon={loveCharmIcon}>
        {`Inventory: ${loveCharmCount} Love Charms`}
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
            {`FLOWER`}
          </Label>
          <NumberInput
            value={flower}
            isRightAligned={true}
            maxDecimalPlaces={4}
            readOnly
          />
        </div>
      </div>
      {isOutOfRange && loveCharms !== 0 && (
        <Label type="danger">
          {loveCharms < 50
            ? "You can't exchange less than 50 Love Charms"
            : loveCharms > 10000
              ? "You can't exchange more than 10,000 Love Charms"
              : loveCharmCount.lt(loveCharms)
                ? "You don't have enough Love Charms to exchange for FLOWER"
                : ""}
        </Label>
      )}
      <Button disabled={isOutOfRange} onClick={() => setShowConfirmation(true)}>
        {`Exchange`}
      </Button>
    </div>
  );
};
