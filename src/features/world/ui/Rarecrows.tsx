import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import { NoticeboardItems } from "./kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useGame } from "features/game/GameProvider";
import { TelegramBody } from "features/auth/components/Telegram/Telegram";

export const Rarecrows: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const [showTelegram, setShowTelegram] = useState(false);

  const telegram = gameState.context.state.telegram;

  if (showTelegram) {
    return (
      <CloseButtonPanel
        onClose={onClose}
        onBack={() => setShowTelegram(false)}
        title={t("linkedAccounts.telegram")}
      >
        <TelegramBody />
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <Label type="vibrant" className="mb-2">
        {t("description.rarecrows.title")}
      </Label>
      <NoticeboardItems
        items={[
          {
            text: t("description.rarecrows"),
            icon: SUNNYSIDE.icons.heart,
          },
          {
            text: t("description.rarecrows.2"),
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: t("description.rarecrows.3"),
            icon: SUNNYSIDE.icons.telegram,
          },
        ]}
      />
      {!telegram?.linkedAt && (
        <Button className="mt-2" onClick={() => setShowTelegram(true)}>
          {t("description.rarecrows.linkTelegram")}
        </Button>
      )}
    </CloseButtonPanel>
  );
};
