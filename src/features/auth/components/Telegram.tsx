import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";
import TelegramLogin from "./TelegramLogin";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { CONFIG } from "lib/config";

export const Telegram: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <CloseButtonPanel onClose={onClose}>
      <TelegramContent />
    </CloseButtonPanel>
  );
};

const TelegramContent: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const telegram = gameState.context.state.telegram;

  if (!telegram) {
    return (
      <div className="p-1">
        <Label type="default" className="mb-2">
          Telegram
        </Label>

        <p className="text-sm">
          Connect your Telegram account to receive exclusive rewards and
          participate in special events.
        </p>
        <TelegramLogin />
      </div>
    );
  }

  if (!telegram.joinedAt) {
    return (
      <div className="p-1">
        <Label type="default" className="mb-2">
          Telegram
        </Label>
        <p className="text-sm">
          Join our official Telegram channel to receive exclusive rewards and
          participate in special events.
        </p>
        <div className="flex">
          <Button
            onClick={() => {
              window.location.href = `https://t.me/${CONFIG.TELEGRAM_BOT}?start=game`;
            }}
          >
            Start Bot
          </Button>
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
            Join Channel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1">
      <Label type="default" className="mb-2">
        Telegram
      </Label>
      <p>Woohoo you have joined the Telegram channel!</p>
      <Button
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
  );
};
