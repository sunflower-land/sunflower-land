import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import coins from "assets/icons/coins.webp";
import giftIcon from "assets/icons/gift.png";
import factions from "assets/icons/factions.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";
import { MinigameHistory, MinigamePrize } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import {
  isMinigameComplete,
  MinigameName,
} from "features/game/types/minigames";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PortalLeaderboard } from "./PortalLeaderboard";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import useSWR from "swr";
import { getMinigame, MinigameResult } from "./actions/loadMinigames";
import { Loading } from "features/auth/components";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";

export const MinigamePrizeUI: React.FC<{
  prize?: MinigamePrize;
  history?: MinigameHistory;
  mission: string;
}> = ({ prize, history, mission }) => {
  const { t } = useAppTranslation();

  if (!prize) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            {t("minigame.noPrizeAvailable")}
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const isComplete = history && history.highscore >= prize.score;
  const secondsLeft = (prize.endAt - Date.now()) / 1000;

  return (
    <OuterPanel>
      <div className="px-1">
        <span className="text-xs mb-2">{mission}</span>
        <div className="flex justify-between mt-2 flex-wrap">
          {isComplete ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("minigame.completed")}
            </Label>
          ) : (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {secondsToString(secondsLeft, { length: "medium" })}
            </Label>
          )}

          <div className="flex items-center space-x-2">
            {getKeys(prize.items).map((item) => (
              <Label key={item} type="warning" icon={ITEM_DETAILS[item].image}>
                {`${prize.items[item]} x ${item}`}
              </Label>
            ))}
            {getKeys(prize.wearables).map((item) => (
              <Label key={item} type="warning" icon={giftIcon}>
                {`${prize.wearables[item]} x ${item}`}
              </Label>
            ))}
            {!!prize.coins && (
              <Label type="warning" icon={coins}>
                {prize.coins}
              </Label>
            )}
          </div>
        </div>
      </div>
    </OuterPanel>
  );
};

interface Props {
  onClose: () => void;
  name: MinigameName;
}

type MinigameDetails = {
  title: TranslationKeys;
  success: TranslationKeys;
  introduction: TranslationKeys;
  mission: TranslationKeys;
};

const MINIGAME_DETAILS: Partial<Record<MinigameName, MinigameDetails>> = {
  "chicken-rescue": {
    success: "minigame.chickenRescue.success",
    title: "minigame.chickenRescue",
    introduction: "minigame.chickenRescueHelp",
    mission: "minigame.chickenRescue.mission",
  },
  "mine-whack": {
    success: "mine-whack.portal.rewardMessage",
    title: "mine-whack.portal.title",
    introduction: "mine-whack.portal.description",
    mission: "mine-whack.portal.missionObjectives",
  },
  "crops-and-chickens": {
    success: "crops-and-chickens.portal.rewardMessage",
    title: "crops-and-chickens.portal.title",
    introduction: "crops-and-chickens.portal.description",
    mission: "crops-and-chickens.portal.missionObjectives",
  },
  "fruit-dash": {
    success: "fruit-dash.portal.rewardMessage",
    title: "fruit-dash.portal.title",
    introduction: "fruit-dash.portal.description",
    mission: "fruit-dash.portal.missionObjectives",
  },
};

const fetcher = async ([token, farmId, name]: [
  string,
  number,
  MinigameName,
]) => {
  return getMinigame({ token, farmId, name });
};

export const MinigameDetails: React.FC<Props> = ({ onClose, name }) => {
  const { authService, authState } = AuthProvider.useAuth();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MinigameResult | undefined>(undefined);

  const load = async () => {
    setIsLoading(true);
    const data = await fetcher([
      authState.context.user.rawToken!,
      gameState.context.farmId,
      name,
    ]);
    setData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const minigame = data?.data?.progress!;

  console.log({ isLoading });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [page, setPage] = useState<"play" | "leaderboard">("play");

  const { t } = useAppTranslation();

  const dateKey = new Date().toISOString().slice(0, 10);
  const history = minigame?.history ?? {};

  const dailyAttempt = history[dateKey] ?? { attempts: 0, highscore: 0 };

  const prize = gameState.context.state.minigames.prizes[name];

  const playNow = () => {
    setIsPlaying(true);
  };

  const details = MINIGAME_DETAILS[name];

  if (isLoading) {
    return <Loading />;
  }

  if (!details) {
    return (
      <div>
        <Label type="danger" icon={SUNNYSIDE.icons.sad}>
          {t("missing")}
        </Label>
      </div>
    );
  }

  if (!data?.data?.progress) {
    return (
      <div>
        <Label type="danger" icon={SUNNYSIDE.icons.expression_confused}>
          {t("missing")}
        </Label>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div>
        <Portal
          portalName={name}
          onClose={onClose}
          onComplete={() => {
            // Reload
            load();
          }}
        />
      </div>
    );
  }

  const onClaim = () => {
    gameService.send("minigame.prizeClaimed", {
      effect: { type: "minigame.prizeClaimed", id: name },
    });

    onClose();
  };

  const isComplete = isMinigameComplete({
    minigame: data?.data?.progress!,
    prize: data?.data?.prize!,
  });

  if (isComplete && !dailyAttempt.prizeClaimedAt && prize) {
    return (
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t(details.success),
          createdAt: Date.now(),
          factionPoints: 0,
          id: name,
          items: prize.items,
          wearables: prize.wearables,
          sfl: 0,
          coins: prize.coins,
        }}
      />
    );
  }

  if (page === "leaderboard") {
    return (
      <PortalLeaderboard
        farmId={gameService.getSnapshot().context.farmId}
        jwt={authService.getSnapshot().context.user.rawToken as string}
        onBack={() => setPage("play")}
        name={name}
      />
    );
  }

  return (
    <>
      <div className="mb-1">
        <div className="p-2">
          <Label type="default" className="mb-1" icon={factions}>
            {t(details.title)}
          </Label>
          <InlineDialogue message={t(details.introduction)} />
        </div>

        <MinigamePrizeUI
          prize={prize}
          history={dailyAttempt}
          mission={t(details.mission, { score: prize?.score ?? 0 })}
        />
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={() => setPage("leaderboard")}>
          {t("competition.leaderboard")}
        </Button>
        <Button onClick={playNow}>{t("minigame.playNow")}</Button>
      </div>
    </>
  );
};
