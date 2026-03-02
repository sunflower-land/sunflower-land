import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAuth } from "features/auth/lib/Provider";
import { Context, useGame } from "features/game/GameProvider";
import {
  blessingIsReady,
  GUARDIAN_PENDING_MS,
} from "features/game/lib/blessings";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import React, { useContext, useEffect, useState } from "react";
import { BlessingResults } from "./Blessings";
import { getKeys } from "features/game/types/decorations";
import confetti from "canvas-confetti";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { ButtonPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { formatNumber } from "lib/utils/formatNumber";
import { ITEM_DETAILS } from "features/game/types/images";
import coins from "assets/icons/coins.webp";
import { useCountdown } from "lib/utils/hooks/useCountdown";

interface Props {
  onClose: () => void;
}
export const ClaimBlessingReward: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();

  const [showResults, setShowResults] = useState(false);

  const { t } = useAppTranslation();

  const { offered, reward } = gameState.context.state.blessing;
  const { totalSeconds: secondsToReady } = useCountdown(
    offered!.offeredAt + GUARDIAN_PENDING_MS,
  );

  const seekBlessing = () => {
    gameService.send("blessing.seeked", {
      effect: {
        type: "blessing.seeked",
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  const claimBlessing = () => {
    gameService.send({ type: "blessing.claimed" });
    setShowResults(true);
  };

  if (showResults) {
    return <BlessingResults onClose={onClose} />;
  }

  if (reward) {
    return <ClaimReward onClaim={claimBlessing} />;
  }

  const isReady = blessingIsReady({ game: gameState.context.state });

  if (!isReady) {
    return (
      <div>
        <Label type="default" className="mb-1">
          {t("blessing.prayToGuardians")}
        </Label>
        <p className="text-sm m-1">{t("blessing.thankYouOffering")}</p>
        <Label
          type="transparent"
          icon={SUNNYSIDE.icons.stopwatch}
          className="ml-4 my-2"
        >
          {secondsToString(secondsToReady, { length: "medium" })}{" "}
          {t("blessing.left")}
        </Label>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  return (
    <div>
      <Label type="default" className="mb-1">
        {t("blessing.youHaveBeenBlessed")}
      </Label>
      <p className="text-sm m-2">{t("blessing.godsThankFaithful")}</p>
      <Button onClick={seekBlessing}>{t("blessing.claimBlessing")}</Button>
    </div>
  );
};

interface ClaimRewardProps {
  onClaim?: () => void;
  onClose?: () => void;
}

const ClaimReward: React.FC<ClaimRewardProps> = ({ onClaim, onClose }) => {
  const { t } = useAppTranslation();

  const { showAnimations, gameService } = useContext(Context);
  const { gameState } = useGame();

  const game = gameState.context.state;
  const bumpkin = game.bumpkin;
  const reward = game.blessing.reward!;

  const itemNames = getKeys(reward.items ?? {});

  useEffect(() => {
    if (showAnimations && reward?.items?.["Love Charm"]) confetti();
  }, []);

  const isWinner = getKeys(reward?.items ?? {}).length >= 1;
  const message = isWinner
    ? t("blessing.godsBlessed.winner")
    : t("blessing.godsBlessed.loser");

  return (
    <>
      <div className="p-0.5">
        <Label className="mb-2 mt-1" type={isWinner ? "warning" : "danger"}>
          {isWinner
            ? t("offering.blessing.success.winner")
            : t("offering.blessing.success.loser")}
        </Label>
        {message && (
          <div className="mb-2 ml-1 text-xxs sm:text-xs">
            <InlineDialogue message={message} />
          </div>
        )}
        <div className="flex flex-col space-y-0.5">
          {!!reward.coins && (
            <ButtonPanel
              variant="card"
              className="flex items-start cursor-context-menu hover:brightness-100"
            >
              <Box image={coins} className="-mt-2 -ml-1 -mb-1" />
              <div>
                <Label type="warning">
                  {`${formatNumber(reward.coins)} ${reward.coins === 1 ? "Coin" : "Coins"}`}
                </Label>
                <p className="text-xs ml-0.5 mt-1">{t("reward.spendWisely")}</p>
              </div>
            </ButtonPanel>
          )}

          {itemNames.length > 0 &&
            itemNames.map((name) => {
              return (
                <ButtonPanel
                  className="flex items-start cursor-context-menu hover:brightness-100"
                  key={name}
                >
                  <Box
                    image={ITEM_DETAILS[name].image}
                    className="-mt-2 -ml-1 -mb-1"
                  />
                  <div>
                    <div className="flex flex-wrap items-start">
                      <Label type="default" className="mr-1 mb-1">
                        {`${formatNumber(reward?.items?.[name] ?? 1)} x ${name}`}
                      </Label>
                    </div>

                    <p className="text-xs ml-0.5">
                      {ITEM_DETAILS[name]?.description
                        ? ITEM_DETAILS[name].description
                        : t("reward.collectible")}
                    </p>
                  </div>
                </ButtonPanel>
              );
            })}
        </div>
      </div>

      <div className="flex items-center mt-1">
        {onClose && <Button onClick={onClose}>{t("close")}</Button>}
        {onClaim && (
          <Button onClick={onClaim} className="ml-0.5">
            {t("continue")}
          </Button>
        )}
      </div>
    </>
  );
};
