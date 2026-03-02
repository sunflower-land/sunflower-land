import React, { useContext, useState } from "react";
import boat from "assets/decorations/isle_boat.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { discordOAuth } from "features/auth/actions/oauth";
import { ClaimReward } from "./ClaimReward";
import { BONUSES } from "features/game/types/bonuses";
import { gameAnalytics } from "lib/gameAnalytics";
import { MachineState } from "features/game/lib/gameMachine";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalContext } from "features/game/components/modal/ModalProvider";

export const DiscordBonus: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const initialState = (): "connected" | "noDiscord" | "claim" | "claimed" => {
    if (
      BONUSES["discord-signup"].isClaimed(gameState.context.state) &&
      gameState.context.discordId
    ) {
      return "claimed";
    }

    if (gameState.context.discordId) {
      return "connected";
    }

    return "noDiscord";
  };

  const [state, setState] = useState<
    "connected" | "noDiscord" | "claim" | "claimed"
  >(initialState());

  const oauth = () => {
    discordOAuth({ nonce: gameState.context.oauthNonce });
  };

  const acknowledge = () => {
    setState("claim");
  };

  const claim = () => {
    // Fire event
    gameService.send({ type: "bonus.claimed", name: "discord-signup" });

    gameAnalytics.trackMilestone({ event: "Reward:DiscordSignup:Claimed" });

    onClose();
  };

  if (state === "claimed") {
    return (
      <>
        <div className="p-2">
          <p className="text-sm mb-2">{t("discord.bonus.niceHat")}</p>
          <p className="text-sm mb-2">{t("discord.bonus.attentionEvents")}</p>
        </div>
      </>
    );
  }

  if (state === "claim") {
    return (
      <ClaimReward
        onClaim={claim}
        reward={{
          id: "discord-bonus",
          items: BONUSES["discord-signup"].reward.inventory,
          wearables: BONUSES["discord-signup"].reward.wearables,
          sfl: 0,
          coins: 0,
        }}
      />
    );
  }

  if (state === "connected") {
    return (
      <>
        <div className="p-2">
          <Label
            className="mb-2"
            type="warning"
            icon={SUNNYSIDE.decorations.treasure_chest}
          >
            {t("discord.bonus.bonusReward")}
          </Label>
          <p className="text-xs mb-2">{t("discord.bonus.enjoyCommunity")}</p>
          <p className="text-xs mb-2">{t("discord.bonus.payAttention")}</p>
        </div>
        <Button onClick={acknowledge}>{t("claim.gift")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <Label
          className="mb-2"
          type="warning"
          icon={SUNNYSIDE.decorations.treasure_chest}
        >
          {t("discord.bonus.bonusReward")}
        </Label>
        <p className="text-xs mb-2">{t("discord.bonus.communityInfo")}</p>
        <p className="text-xs mb-2">{t("discord.bonus.farmingTips")}</p>
        <p className="text-xs mb-2">{t("discord.bonus.freeGift")}</p>
      </div>
      <Button onClick={oauth}>{t("discord.bonus.connect")}</Button>
    </>
  );
};

const _isClaimed = (state: MachineState) =>
  BONUSES["discord-signup"].isClaimed(state.context.state);

const _expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 0;

export const DiscordBoat: React.FC = () => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const isClaimed = useSelector(gameService, _isClaimed);

  const expansions = useSelector(gameService, _expansions);

  let yOffset = 5;
  if (expansions >= 12) {
    yOffset = 0;
  }

  // When ready, show boat above island
  const isReady = !!gameService.getSnapshot().context.discordId && !isClaimed;

  if (isClaimed) return null;

  return (
    <>
      <div
        className={classNames("absolute cursor-pointer  left-0", {
          boating: !isReady,
        })}
        onClick={() => openModal("DISCORD")}
        style={{
          top: `${GRID_WIDTH_PX * yOffset}px`,
          width: `${PIXEL_SCALE * 104}px`,
          transform: `translateX(650px)`,
        }}
      >
        <img src={boat} className="absolute top-0 right-0 w-full" />
        <img
          src={SUNNYSIDE.icons.expression_chat}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            top: `${PIXEL_SCALE * -4}px`,
            right: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 3}px`,
            right: `${PIXEL_SCALE * 30}px`,
          }}
        >
          <NPCPlaceable parts={NPC_WEARABLES.wobble} />
        </div>
        <img
          src={SUNNYSIDE.decorations.treasure_chest}
          style={{
            top: `${PIXEL_SCALE * -6}px`,
            right: `${PIXEL_SCALE * 45}px`,
            width: `${PIXEL_SCALE * 16}px`,
          }}
          className="absolute w-full"
        />
      </div>
    </>
  );
};
