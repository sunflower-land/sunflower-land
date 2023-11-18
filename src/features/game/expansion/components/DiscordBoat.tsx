import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";

import boat from "assets/decorations/isle_boat.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { redirectOAuth } from "features/auth/actions/oauth";
import { ClaimReward } from "./Airdrop";
import { BONUSES } from "features/game/types/bonuses";
import { gameAnalytics } from "lib/gameAnalytics";
import { MachineState } from "features/game/lib/gameMachine";
import classNames from "classnames";
import { hasFeatureAccess } from "lib/flags";

export const DiscordBonus: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const initialState = (): "connected" | "noDiscord" | "claim" | "claimed" => {
    if (BONUSES["discord-signup"].isClaimed(gameState.context.state)) {
      return "claimed";
    }

    if (authState.context.user.token?.discordId) {
      return "connected";
    }

    return "noDiscord";
  };

  const [state, setState] = useState<
    "connected" | "noDiscord" | "claim" | "claimed"
  >(initialState());

  const oauth = () => {
    redirectOAuth();
  };

  const acknowledge = () => {
    setState("claim");
  };

  const claim = () => {
    // Fire event
    gameService.send("bonus.claimed", { name: "discord-signup" });

    gameAnalytics.trackMilestone({ event: "Reward:DiscordSignup:Claimed" });

    onClose();
  };

  if (state === "claimed") {
    return (
      <>
        <div className="p-2">
          <p className="text-sm mb-2">Wow, nice hat!</p>
          <p className="text-sm mb-2">
            {`Don't forget to pay attention to special events and giveaways on
            Discord so you don't miss out.`}
          </p>
        </div>
      </>
    );
  }

  if (state === "claim") {
    return (
      <ClaimReward
        onClaim={claim}
        reward={{
          createdAt: Date.now(),
          id: "discord-bonus",
          items: BONUSES["discord-signup"].reward.inventory,
          wearables: BONUSES["discord-signup"].reward.wearables,
          sfl: 0,
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
            Bonus reward
          </Label>
          <p className="text-xs mb-2">
            We hope you are enjoying being a part of our community!
          </p>
          <p className="text-xs mb-2">
            {`Pay attention to special events and giveaways on Discord so you
            don't miss out.`}
          </p>
        </div>
        <Button onClick={acknowledge}>Claim Gift</Button>
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
          Bonus reward
        </Label>
        <p className="text-xs mb-2">
          Did you know there are over 100,000 players in our vibrant Discord
          community?
        </p>
        <p className="text-xs mb-2">
          If you are looking for farming tips & tricks, it is the place to be.
        </p>
        <p className="text-xs mb-2">
          The best part...everyone who joins gets a free gift!
        </p>
      </div>
      <Button onClick={oauth}>Connect to Discord</Button>
    </>
  );
};

const _isClaimed = (state: MachineState) =>
  BONUSES["discord-signup"].isClaimed(state.context.state);

const _hasAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "DISCORD_BONUS");

export const DiscordBoat: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const isClaimed = useSelector(gameService, _isClaimed);
  const hasAccess = useSelector(gameService, _hasAccess);

  if (!hasAccess) {
    return null;
  }

  // When ready, show boat above island
  const isReady = authState.context.user.token?.discordId && !isClaimed;

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.wobble}
          onClose={() => setShowModal(false)}
        >
          <DiscordBonus onClose={() => setShowModal(false)} />
        </CloseButtonPanel>
      </Modal>

      <div
        className={classNames("absolute cursor-pointer  left-0", {
          boating: !isReady,
        })}
        onClick={() => setShowModal(true)}
        style={{
          top: `${GRID_WIDTH_PX * 3}px`,
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
          <NPC parts={NPC_WEARABLES.wobble} />
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
