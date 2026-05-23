import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import TelegramLogin from "./TelegramLogin";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { CONFIG } from "lib/config";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import giftIcon from "assets/icons/gift.png";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Loading } from "..";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TelegramBody: React.FC = () => {
  const { gameState } = useGame();
  const telegram = gameState.context.state.telegram;

  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-1">
      {telegram?.linkedAt && (
        <ButtonPanel variant="card">
          <div className="flex items-start gap-2">
            <img
              src={SUNNYSIDE.icons.telegram}
              alt="Telegram"
              className="w-8 h-8 mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-semibold">
                  {t("linkedAccounts.telegram")}
                </span>
                <div className="flex gap-1">
                  <Label type="info">{t("beta")}</Label>
                  {telegram.joinedAt ? (
                    <Label type="success">{t("telegram.joinedAt")}</Label>
                  ) : (
                    <Label type="warning">
                      {t("linkedAccounts.partialPill")}
                    </Label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ButtonPanel>
      )}

      <ButtonPanel variant="card">
        {!telegram?.linkedAt && (
          <div className="flex items-center justify-between gap-2 mb-2">
            <Label type="default" icon={SUNNYSIDE.icons.telegram}>
              {t("telegram.title")}
            </Label>
            <Label type="info">{t("beta")}</Label>
          </div>
        )}
        <NoticeboardItems
          items={[
            {
              text: t("telegram.community"),
              icon: SUNNYSIDE.icons.player,
            },
            {
              text: t("telegram.rewards"),
              icon: giftIcon,
            },
          ]}
        />
        <div className="flex gap-4 mt-2 ml-1">
          <a
            className="underline text-xs cursor-pointer"
            href="https://t.me/SunflowerLandAnnouncements"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("telegram.announcements")}
          </a>
          <a
            className="underline text-xs cursor-pointer"
            href={`https://t.me/${CONFIG.TELEGRAM_BOT}?start=game`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("telegram.bot")}
          </a>
        </div>
      </ButtonPanel>

      <TelegramConnect />
    </div>
  );
};

export const Telegram: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <CloseButtonPanel onClose={onClose}>
    <TelegramBody />
  </CloseButtonPanel>
);

const TelegramConnect: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [startedBotAt, setStartedBotAt] = useState<number>(0);

  const { t } = useAppTranslation();

  const telegram = gameState.context.state.telegram;

  if (!telegram) {
    return (
      <ButtonPanel variant="card">
        <div className="flex items-center justify-between gap-2">
          <Label type="default">{t("telegram.step1")}</Label>
          <div className="flex gap-1">
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <TelegramLogin />
        </div>
      </ButtonPanel>
    );
  }

  if (!telegram?.joinedAt && gameState.matches("autosaving")) {
    return (
      <ButtonPanel variant="card">
        <Loading />
      </ButtonPanel>
    );
  }

  if (!telegram.startedAt) {
    return (
      <ButtonPanel variant="card">
        <div className="flex items-center justify-between gap-2">
          <Label type="default">{t("telegram.step2")}</Label>
          <div className="flex gap-1">
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
          </div>
        </div>
        <p className="text-xs mt-2 ml-1">{t("telegram.botDescription")}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {!!startedBotAt && (
            <Button
              onClick={() => {
                if (gameState.matches("investigating")) {
                  window.location.reload();
                  return;
                }

                // Trigger a no op save event to fetch API
                gameService.send("kingdomChores.refreshed");
                gameService.send("SAVE");
              }}
            >
              {t("telegram.alreadyStarted")}
            </Button>
          )}

          <Button
            disabled={!telegram}
            onClick={() => {
              // New tab it
              window.open(
                `https://t.me/${CONFIG.TELEGRAM_BOT}?start=game`,
                "_blank",
              );

              setStartedBotAt(Date.now());

              // Trigger a no op save event to fetch API
              gameService.send("kingdomChores.refreshed");
              gameService.send("SAVE");
            }}
          >
            {t("telegram.startBot")}
          </Button>
        </div>
      </ButtonPanel>
    );
  }

  if (!telegram.joinedAt) {
    return (
      <ButtonPanel variant="card">
        <div className="flex items-center justify-between gap-2">
          <Label type="default">{t("telegram.step3")}</Label>
          <div className="flex gap-1">
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
          </div>
        </div>
        <p className="text-xs mt-2 ml-1">{t("telegram.prompts")}</p>
      </ButtonPanel>
    );
  }

  return null;
};
