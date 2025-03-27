import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context, useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { StateValues } from "features/game/lib/gameMachine";
import { TranslationKeys } from "lib/i18n/dictionaries/types";

export const CompletingFaceRecognitionSuccess: React.FC = () => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1.5">
        <Label type="default" className="mb-2">
          {t("completing.face.recognition.label")}
        </Label>
      </div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};

export const StartingFaceRecognitionSuccess: React.FC = () => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1.5">
        <Label type="default" className="mb-2">
          {t("ready")}
        </Label>
        <p className="text-sm mb-2">{t("starting.face.recognition.success")}</p>
      </div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};

export const TwitterFollowedSuccess: React.FC = () => {
  const { gameService, gameState } = useGame();

  const { t } = useAppTranslation();

  const hasFollowed = gameState.context.state.twitter?.followedAt;

  if (!hasFollowed) {
    return (
      <>
        <div className="p-1.5">
          <Label type="danger" className="mb-2">
            {t("following.twitter.failed")}
          </Label>
        </div>
        <p className="text-sm mb-2">
          {t("following.twitter.failed.description")}
        </p>
        <Button
          onClick={() => {
            gameService.send("CONTINUE");
          }}
        >
          {t("continue")}
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="p-1.5">
        <Label type="success" className="mb-2">
          {t("following.twitter.success")}
        </Label>
      </div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};

export const TwitterPostedSuccess: React.FC = () => {
  const { gameService, gameState } = useGame();

  const { t } = useAppTranslation();

  const tweets = gameState.context.state.twitter?.tweets ?? {};

  // Get recently posted tweets in the last 10 minutes
  const recentlyPostedTweets = Object.values(tweets).filter(
    (tweet) => tweet.completedAt > Date.now() - 10 * 60 * 1000,
  );

  if (!recentlyPostedTweets) {
    return (
      <>
        <div className="p-1.5">
          <Label type="danger" className="mb-2">
            {t("posting.twitter.failed")}
          </Label>
        </div>
        <p className="text-sm mb-2">
          {t("posting.twitter.failed.description")}
        </p>
        <Button
          onClick={() => {
            gameService.send("CONTINUE");
          }}
        >
          {t("continue")}
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="p-1.5">
        <Label type="success" className="mb-2">
          {t("posting.twitter.success")}
        </Label>
      </div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};

export const EFFECT_SUCCESS_COMPONENTS: Partial<
  Record<StateValues, React.ReactNode>
> = {
  startingFaceRecognitionSuccess: <StartingFaceRecognitionSuccess />,
  completingFaceRecognitionSuccess: <CompletingFaceRecognitionSuccess />,
  followingTwitterSuccess: <TwitterFollowedSuccess />,
  postingTwitterSuccess: <TwitterPostedSuccess />,
};

function camelToDotCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1.$2").toLowerCase() as string;
}

export const EffectSuccess: React.FC<{ state: string }> = ({ state }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const effectTranslationKey = camelToDotCase(
    state as string,
  ) as TranslationKeys;

  return (
    <>
      <div className="p-1.5">
        <Label type="success" className="mb-2">
          {t("success")}
        </Label>
        <p className="text-sm mb-2">{t(effectTranslationKey)}</p>
      </div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
