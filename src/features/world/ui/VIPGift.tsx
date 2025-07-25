import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { VIPAccess } from "features/game/components/VipAccess";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { Revealed } from "features/game/components/Revealed";
import { Loading } from "features/auth/components";

interface Props {
  onClose: () => void;
}

function getFirstMondayOfMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get the first day of the month
  const firstDay = new Date(year, month, 1);

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = firstDay.getDay();

  // Calculate days to add to get to the first Monday
  const daysToAdd = (1 - dayOfWeek + 7) % 7;

  const firstMonday = new Date(year, month, 1 + daysToAdd);

  return firstMonday;
}

export const VIPGift: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <CloseButtonPanel
      onClose={gameState.matches("revealing") ? undefined : onClose}
    >
      <VIPGiftContent onClose={onClose} />
    </CloseButtonPanel>
  );
};

export const VIPGiftContent: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { openModal } = useContext(ModalContext);

  const { pumpkinPlaza } = gameState.context.state;
  const [isRevealing, setIsRevealing] = useState(false);
  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const open = async () => {
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "vipChest.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  const hasVip = hasVipAccess({ game: gameState.context.state });
  const openedAt = pumpkinPlaza.vipChest?.openedAt ?? 0;

  const currentDate = new Date();
  const currentFirstMonday = getFirstMondayOfMonth(currentDate);
  const openedDate = new Date(openedAt);
  const openedFirstMonday = getFirstMondayOfMonth(openedDate);

  const hasOpened =
    currentDate < currentFirstMonday ||
    (currentFirstMonday.getTime() === openedFirstMonday.getTime() &&
      openedAt >= currentFirstMonday.getTime());

  const { t } = useAppTranslation();

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return <Loading />;
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Revealed
        onAcknowledged={() => {
          setIsRevealing(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center pr-8">
          <VIPAccess
            isVIP={hasVipAccess({ game: gameState.context.state })}
            onUpgrade={() => {
              onClose();
              openModal("BUY_BANNER");
            }}
          />
          {hasOpened && (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("opened")}
            </Label>
          )}
        </div>
      </div>
      <p className="text-xs mb-2 pl-1">{t("season.vip.claim")}</p>
      <Button onClick={open} disabled={!hasVip || hasOpened}>
        {t("claim")}
      </Button>
    </>
  );
};
