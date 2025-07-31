import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { VIPAccess } from "features/game/components/VipAccess";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import React, { useContext, useState } from "react";
import { Revealed } from "features/game/components/Revealed";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const MONTHLY_REWARDS_DATES = [
  "2025-07-01",
  "2025-08-04",
  "2025-09-01",
  "2025-10-01",
  "2025-11-03",
  "2025-12-01",
  "2026-01-01",
  "2026-02-02",
];

interface Props {
  onClose: () => void;
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
  const { t } = useAppTranslation();
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

  const currentDate = new Date();

  const hasVip = hasVipAccess({ game: gameState.context.state });
  const rewardEntry = MONTHLY_REWARDS_DATES.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  ).find((key) => {
    const rewardStartDate = new Date(key);
    return currentDate >= rewardStartDate;
  });

  if (!rewardEntry) {
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
          </div>
        </div>
        <p className="text-xs mb-2 pl-1">{t("season.no.gift.found")}</p>
        <Button disabled>{t("claim")}</Button>
      </>
    );
  }

  const rewardStartDate = new Date(rewardEntry);

  const openedAt = pumpkinPlaza.vipChest?.openedAt ?? 0;

  const hasOpened = openedAt >= rewardStartDate.getTime();

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
