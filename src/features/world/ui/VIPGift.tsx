import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
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

export const VIPGift: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { inventory, pumpkinPlaza } = gameState.context.state;

  const { openModal } = useContext(ModalContext);

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

  // Have they opened this month?
  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 7) ===
      new Date().toISOString().substring(0, 7);

  const { t } = useAppTranslation();

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return (
      <Panel>
        <Loading />
      </Panel>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Panel>
        <Revealed
          onAcknowledged={() => {
            setIsRevealing(false);
          }}
        />
      </Panel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose}>
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
    </CloseButtonPanel>
  );
};
