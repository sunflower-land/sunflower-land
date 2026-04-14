import clipboard from "clipboard";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Telegram } from "features/auth/components/Telegram/Telegram";
import { DiscordBonus } from "features/game/expansion/components/DiscordBoat";
import { useGame } from "features/game/GameProvider";
import React, { useState } from "react";
import { CONFIG } from "lib/config";
import { FaceRecognition } from "./FaceRecognition";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { useNow } from "lib/utils/hooks/useNow";

export const SoftBan: React.FC = () => {
  const { gameService, gameState } = useGame();

  const [showDiscord, setShowDiscord] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);

  const [showFarm, setShowFarm] = useState(false);

  const copypaste = useSound("copypaste");

  const { t } = useAppTranslation();

  const now = useNow();

  const hasVerifiedSocial = gameState.context.state.ban.isSocialVerified;

  if (showDiscord) {
    return <DiscordSoftBan onClose={() => setShowDiscord(false)} />;
  }

  if (showTelegram) {
    return <TelegramSoftBan onClose={() => setShowTelegram(false)} />;
  }

  const handleAskOnDiscord = () => {
    window.open(
      "https://discord.gg/sunflowerland",
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (!hasVerifiedSocial) {
    return (
      <div className="p-1">
        <div className="flex justify-between flex-wrap items-center">
          <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
            {t("softBan.goblinDetection")}
          </Label>
          <Label
            type="default"
            popup={showFarm}
            className="mb-1"
            onClick={() => {
              setShowFarm(true);
              setTimeout(() => {
                setShowFarm(false);
              }, 2000);
              copypaste.play();
              clipboard.copy(
                gameService.getSnapshot()?.context?.farmId.toString() as string,
              );
            }}
          >
            {t("gameOptions.farmId", {
              farmId: gameService.getSnapshot()?.context?.farmId,
            })}
          </Label>
        </div>
        <p className="text-xs mb-2">{t("softBan.networkWarning")}</p>
        <Label type="default" className="mb-1">
          {t("softBan.step1")}
        </Label>
        <p className="text-xs mb-2">{t("softBan.socialVerification")}</p>
        <Button onClick={() => setShowDiscord(true)}>
          {t("softBan.discordVerification")}
        </Button>
        <div className="flex items-center justify-center my-2">
          <div className="flex-grow border-t border-[#fff0d4]"></div>
          <span className="mx-2 text-xs">{t("softBan.or")}</span>
          <div className="flex-grow border-t border-[#fff0d4]"></div>
        </div>
        <Button onClick={() => setShowTelegram(true)}>
          {t("softBan.telegramVerification")}
        </Button>
        <p
          className="underline cursor-pointer text-xs my-1"
          onClick={handleAskOnDiscord}
        >
          {t("welcome.needHelp")}
        </p>
      </div>
    );
  }

  const { faceRecognition } = gameState.context.state;

  // Since we are not in playing state, we use this to check if they have already begun.
  const hasBegun = faceRecognition?.session?.createdAt ?? 0;
  const hasScanned = faceRecognition?.history.some(
    (h) => h.createdAt > now - 60 * 1000,
  );

  if (showFaceRecognition || hasBegun >= now - 60 * 1000 || hasScanned) {
    return <FaceRecognition skipIntro />;
  }

  return (
    <div className="p-1">
      <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
        {t("softBan.goblinDetection")}
      </Label>
      <p className="text-xs mb-2">{t("softBan.networkWarning")}</p>
      <Label type="default" className="mb-1">
        {t("softBan.step2")}
      </Label>
      <p className="text-xs mb-2">{t("softBan.faceVerification")}</p>
      <Button onClick={() => setShowFaceRecognition(true)}>
        {t("softBan.faceProtection")}
      </Button>
    </div>
  );
};

const DiscordSoftBan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameState } = useGame();
  const { t } = useAppTranslation();

  const discordId = gameState.context.discordId;

  if (!discordId) {
    return <DiscordBonus onClose={onClose} />;
  }

  return (
    <div className="p-1">
      <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
        {t("softBan.discordOnboarding")}
      </Label>
      <p className="mb-2">{t("softBan.discordInstructions")}</p>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("softBan.back")}
        </Button>
      </div>
    </div>
  );
};

const TelegramSoftBan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameState } = useGame();
  const { t } = useAppTranslation();

  const telegramConnected = gameState.context.state.telegram?.startedAt;

  if (!telegramConnected) {
    return <Telegram onClose={onClose} />;
  }

  return (
    <div className="p-1">
      <Label icon={SUNNYSIDE.icons.search} type="default" className="mb-1">
        {t("softBan.telegramVerificationTitle")}
      </Label>
      <p className="mb-2">{t("softBan.telegramInstructions")}</p>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("softBan.back")}
        </Button>
        <Button
          onClick={() => {
            // New tab it
            window.open(
              `https://t.me/${CONFIG.TELEGRAM_BOT}?start=verify`,
              "_blank",
            );
          }}
        >
          {t("softBan.openBot")}
        </Button>
      </div>
    </div>
  );
};
