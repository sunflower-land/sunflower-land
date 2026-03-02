import React from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";

export const TwitterPostedSuccess: React.FC = () => {
  const { gameService, gameState } = useGame();

  const { t } = useAppTranslation();

  const tweets = gameState.context.state.twitter?.tweets ?? {};
  const now = useNow();

  // Get recently posted tweets in the last 10 minutes
  const recentlyPostedTweets = Object.values(tweets).filter(
    (tweet) => tweet.completedAt > now - 10 * 60 * 1000,
  );

  if (Object.values(tweets).length === 0 || !recentlyPostedTweets) {
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
            gameService.send({ type: "CONTINUE" });
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
          gameService.send({ type: "CONTINUE" });
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
