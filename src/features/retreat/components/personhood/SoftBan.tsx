import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Telegram } from "features/auth/components/Telegram/Telegram";
import { DiscordBonus } from "features/game/expansion/components/DiscordBoat";
import { useGame } from "features/game/GameProvider";
import React, { useContext, useState } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { CONFIG } from "lib/config";
import { FaceRecognition } from "./FaceRecognition";

export const SoftBan: React.FC = () => {
  const { gameService, gameState } = useGame();

  const [showDiscord, setShowDiscord] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const hasVerifiedSocial = gameState.context.ban.isSocialVerified;

  if (showDiscord) {
    return <DiscordSoftBan onClose={() => setShowDiscord(false)} />;
  }

  if (showTelegram) {
    return <TelegramSoftBan onClose={() => setShowTelegram(false)} />;
  }

  if (!hasVerifiedSocial) {
    return (
      <div className="p-1">
        <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
          Goblin Detection
        </Label>
        <p className="text-xs mb-2">
          The Goblins noticed some similar devices connected to your network. To
          help keep the Bumpkin economy safe and fair for everyone, please
          complete a quick verification to continue your adventure.
        </p>
        <Label type="default" className="mb-1">
          Step 1
        </Label>
        <p className="text-xs mb-2">
          Join the Discord or Telegram community & follow the steps to verify
          your account.
        </p>
        <Button onClick={() => setShowDiscord(true)}>
          Discord verification
        </Button>
        <div className="flex items-center justify-center my-2">
          <div className="flex-grow border-t border-[#fff0d4]"></div>
          <span className="mx-2 text-xs">or</span>
          <div className="flex-grow border-t border-[#fff0d4]"></div>
        </div>
        <Button onClick={() => setShowTelegram(true)}>
          Telegram verification
        </Button>
      </div>
    );
  }

  const { faceRecognition } = gameState.context.state;

  // Since we are not in playing state, we use this to check if they have already begun.
  const hasBegun = faceRecognition?.session?.createdAt ?? 0;
  const hasScanned = faceRecognition?.history.some(
    (h) => h.createdAt > Date.now() - 60 * 1000,
  );

  if (showFaceRecognition || hasBegun >= Date.now() - 60 * 1000 || hasScanned) {
    return <FaceRecognition />;
  }

  return (
    <div className="p-1">
      <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
        Goblin Detection
      </Label>
      <p className="text-xs mb-2">
        The Goblins noticed some similar devices connected to your network. To
        help keep the Bumpkin economy safe and fair for everyone, please
        complete a quick verification to continue your adventure.
      </p>
      <Label type="default" className="mb-1">
        Step 2
      </Label>
      <p className="text-xs mb-2">
        To make sure every Bumpkin is unique, we ask for a quick face
        verification. Your privacy is important — this is used only to keep the
        economy safe and stop bots.
      </p>
      <Button onClick={() => setShowFaceRecognition(true)}>
        Face protection
      </Button>
    </div>
  );
};

const DiscordSoftBan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameState } = useGame();

  const discordId = gameState.context.discordId;

  if (!discordId) {
    return <DiscordBonus onClose={onClose} />;
  }

  return (
    <div className="p-1">
      <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
        Discord Onboarding
      </Label>
      <p>
        Follow the instructions in #X channel to verify your account Once
        completed, refresh your browser.
      </p>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Back
        </Button>
      </div>
    </div>
  );
};

const TelegramSoftBan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameState } = useGame();

  const telegramConnected = gameState.context.state.telegram?.startedAt;

  if (!telegramConnected) {
    return <Telegram onClose={onClose} />;
  }

  return (
    <div className="p-1">
      <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
        Telegram Verification
      </Label>
      <p>Open up the Sunflower Land Bot and run the /verify command.</p>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Back
        </Button>
        <Button
          onClick={() => {
            // New tab it
            window.open(`https://t.me/${CONFIG.TELEGRAM_BOT}?verify`, "_blank");
          }}
        >
          Open Bot
        </Button>
      </div>
    </div>
  );
};
