import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import levelIcon from "assets/icons/level_up.png";
import giftIcon from "assets/icons/gift.png";

import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { BumpkinLevel } from "features/bumpkins/components/BumpkinModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { PlayerTrade } from "./PlayerTrade";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Revealed } from "features/game/components/Revealed";
import { ChestRevealing } from "./chests/ChestRevealing";
import { secondsToString } from "lib/utils/time";
import { secondsTillReset } from "lib/utils/time";
import { AdminSettings } from "features/island/hud/components/settings-menu/general-settings/AdminSettings";
import { CONFIG } from "lib/config";

type Player = {
  id: number;
  clothing: BumpkinParts;
  experience: number;
};

class PlayerModalManager {
  private listener?: (player: Player) => void;

  public open(player: Player) {
    if (this.listener) {
      this.listener(player);
    }
  }

  public listen(cb: (player: Player) => void) {
    this.listener = cb;
  }
}

export const playerModalManager = new PlayerModalManager();

const PlayerDetails: React.FC<{ player: Player }> = ({ player }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex items-center ml-1 mt-2 mb-4">
        <img
          src={levelIcon}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
        />
        <div>
          <p className="text-base">
            {t("lvl")} {getBumpkinLevel(player?.experience ?? 0)}
          </p>
          {/* Progress bar */}
          <BumpkinLevel experience={player?.experience} />
        </div>

        {player?.id && (
          <div className="flex-auto self-start text-right text-xs mr-3 f-10 font-secondary">
            {"#"}
            {player?.id}
          </div>
        )}
      </div>
    </>
  );
};

export const PlayerGift: React.FC<{ player: Player }> = ({ player }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { pumpkinPlaza } = gameState.context.state;

  const [isRevealing, setIsRevealing] = useState(false);

  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const { t } = useAppTranslation();

  const open = async () => {
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "giftGiver.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  const openedAt = pumpkinPlaza.giftGiver?.openedAt ?? 0;

  // Have they opened one today already?
  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return <ChestRevealing type={"Gift Giver"} />;
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
      <div className="ml-1 mb-2">
        <div className="flex justify-between items-center px-1 mb-2">
          <Label type="success" icon={giftIcon}>
            {t("giftGiver.label")}
          </Label>
          {hasOpened && (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {`${t("budBox.opened")} - ${secondsToString(secondsTillReset(), {
                length: "short",
              })}`}
            </Label>
          )}
        </div>
        <p className="text-sm">{t("giftGiver.description")}</p>
      </div>
      <Button onClick={open} disabled={hasOpened}>
        {t("open")}
      </Button>
    </>
  );
};

interface Props {
  game: GameState;
}

export const PlayerModals: React.FC<Props> = ({ game }) => {
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState(0);
  const [player, setPlayer] = useState<Player>();
  const { t } = useAppTranslation();

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setTab(0);
      setPlayer(npc);
    });
  }, []);

  const closeModal = () => {
    setPlayer(undefined);
  };

  const playerHasGift = player?.clothing.shirt === "Gift Giver";

  return (
    <>
      <Modal
        // dialogClassName="npc-dialog"
        show={!!player}
        onHide={closeModal}
      >
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={player?.clothing}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.icons.player,
              name: "Player",
            },
            {
              icon: SUNNYSIDE.icons.heart,
              name: "Trades",
            },
            ...(!!gameService.getSnapshot().context.state.wardrobe[
              "Gift Giver"
            ] || CONFIG.NETWORK === "amoy"
              ? [
                  {
                    icon: SUNNYSIDE.icons.search,
                    name: "Admin",
                  },
                ]
              : []),
          ]}
        >
          {tab === 0 &&
            (playerHasGift ? (
              <PlayerGift player={player as Player} />
            ) : (
              <PlayerDetails player={player as Player} />
            ))}
          {tab === 1 && (
            <PlayerTrade onClose={closeModal} farmId={player?.id as number} />
          )}
          {tab === 2 && (
            <AdminSettings
              id={player?.id as number}
              // Noops
              onClose={alert}
              onSubMenuClick={alert}
            />
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
