import React from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
          {t("following.twitter.success")}
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
