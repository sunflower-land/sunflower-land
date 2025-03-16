import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";
import TelegramLogin from "./TelegramLogin";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { CONFIG } from "lib/config";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/icons/lock.png";

export const Telegram: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <CloseButtonPanel onClose={onClose} container={OuterPanel}>
      <InnerPanel className="mb-1">
        <Label type="default" className="mb-2">
          Telegram
        </Label>
        <p className="text-xs">
          Connect your Telegram to receive exclusive rewards, reminders and
          participate in special events.
        </p>
      </InnerPanel>
      <TelegramConnect />
    </CloseButtonPanel>
  );
};

const TelegramConnect: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const telegram = gameState.context.state.telegram;

  return (
    <>
      <InnerPanel className="p-1 mb-1">
        <div className="flex justify-between">
          <Label type="default" className="mb-2">
            Step 1: Connect Telegram
          </Label>
          {telegram && <img src={SUNNYSIDE.icons.confirm} className="h-4" />}
        </div>

        <TelegramLogin />
      </InnerPanel>

      <InnerPanel className="p-1 mb-1">
        <div className="flex justify-between">
          <Label type="default" className="mb-2">
            Step 2: Start Bot
          </Label>
          {telegram?.startedAt && (
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
          )}
          {!telegram && <img src={lockIcon} className="h-4" />}
        </div>
        <p className="text-sm">Receive reminders & daily rewards.</p>
        <div className="flex">
          <Button
            disabled={!telegram}
            onClick={() => {
              // New tab it
              window.open(
                `https://t.me/${CONFIG.TELEGRAM_BOT}?start=game`,
                "_blank",
              );
            }}
          >
            Start Bot
          </Button>
        </div>
      </InnerPanel>

      <InnerPanel className="p-1">
        <div className="flex justify-between">
          <Label type="default" className="mb-2">
            Step 3: Join Channel
          </Label>
          {!telegram?.startedAt && <img src={lockIcon} className="h-4" />}
          {telegram?.joinedAt && (
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
          )}
        </div>
        <p>Join the official channel...</p>
        <Button
          disabled={!telegram?.startedAt}
          onClick={() => {
            window.open(
              `https://web.telegram.org/k/#@SunflowerLandOficialBr`,
              "_blank",
            );
          }}
        >
          Join Channel
        </Button>
        <p
          className="underline"
          onClick={() => {
            gameService.send("telegram.joined", {
              effect: {
                type: "telegram.joined",
              },
              authToken: authState.context.user.rawToken as string,
            });
          }}
        >
          Already joined?
        </p>
      </InnerPanel>
    </>
  );
};
