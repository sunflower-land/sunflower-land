import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import TelegramLogin from "./TelegramLogin";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { CONFIG } from "lib/config";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import giftIcon from "assets/icons/gift.png";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Loading } from "..";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Telegram: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService, gameState } = useGame();
  const telegram = gameState.context.state.telegram;

  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel onClose={onClose} container={OuterPanel}>
      <InnerPanel className="p-1">
        <div className="flex mb-2 ">
          <Label type="default" className="mr-2">
            {t("telegram.title")}
          </Label>
          <Label type="info" className="mr-2">
            {t("beta")}
          </Label>
          {telegram?.joinedAt && (
            <Label type="success">{t("telegram.joinedAt")}</Label>
          )}
        </div>
        <NoticeboardItems
          items={[
            {
              text: t("telegram.notifications"),
              icon: SUNNYSIDE.icons.expression_chat,
            },
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
      </InnerPanel>
      <TelegramConnect />
    </CloseButtonPanel>
  );
};

const TelegramConnect: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [startedBotAt, setStartedBotAt] = useState<number>(0);

  const { t } = useAppTranslation();

  const telegram = gameState.context.state.telegram;

  if (!telegram) {
    return (
      <InnerPanel className="p-1  mt-1">
        <div className="flex justify-between">
          <Label type="default">{t("telegram.step1")}</Label>
          <div className="flex gap-1">
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
          </div>
        </div>

        <div className="p-2">
          <TelegramLogin />
        </div>
      </InnerPanel>
    );
  }

  if (!telegram?.joinedAt && gameState.matches("autosaving")) {
    return (
      <InnerPanel className="p-1  mt-1">
        <Loading />
      </InnerPanel>
    );
  }

  if (!telegram.startedAt) {
    return (
      <InnerPanel className="p-1 mt-1">
        <div className="flex justify-between">
          <Label type="default">{t("telegram.step2")}</Label>
          <div className="flex gap-1">
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
            <img src={SUNNYSIDE.ui.dot} className="h-4" />
          </div>
        </div>
        <p className="text-xs p-2">{t("telegram.botDescription")}</p>
        <div className="flex flex-wrap gap-x-1">
          {!!startedBotAt && (
            <Button
              onClick={() => {
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
      </InnerPanel>
    );
  }

  const CHANNEL_NAME = "SunflowerLandOficialBr";

  if (!telegram.joinedAt) {
    return (
      <>
        <InnerPanel className="p-1  mt-1">
          <div className="flex justify-between">
            <Label type="default">{t("telegram.step3")}</Label>
            <div className="flex gap-1">
              <img src={SUNNYSIDE.icons.confirm} className="h-4" />
              <img src={SUNNYSIDE.icons.confirm} className="h-4" />
              <img src={SUNNYSIDE.ui.dot} className="h-4" />
            </div>
          </div>
          <p className="p-2 text-xs">{t("telegram.joinChannel")}</p>
          <div className="flex flex-wrap gap-x-1">
            <Button
              onClick={() => {
                gameService.send("telegram.joined", {
                  effect: {
                    type: "telegram.joined",
                  },
                  authToken: authState.context.user.rawToken as string,
                });
              }}
            >
              {t("telegram.alreadyJoined")}
            </Button>
            <Button
              disabled={!telegram?.startedAt}
              onClick={() => {
                window.open(
                  `https://t.me/SunflowerLandAnnouncements`,
                  "_blank",
                );
              }}
            >
              {t("telegram.join")}
            </Button>
          </div>
        </InnerPanel>
      </>
    );
  }

  return null;
};
