import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";

import boat from "assets/decorations/isles_boat.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { redirectOAuth } from "features/auth/actions/oauth";
import { ClaimReward } from "./Airdrop";
import { BONUSES } from "features/game/types/bonuses";

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

export const DiscordBoat: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

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
        // className="absolute boating left-0"
        className="absolute left-0 cursor-pointer"
        onClick={() => setShowModal(true)}
        style={{
          top: `${GRID_WIDTH_PX * 3}px`,
          width: `${PIXEL_SCALE * 63}px`,
          transform: `translateX(600px)`,
        }}
      >
        <img src={boat} className="absolute top-0 right-0 w-full" />
        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 32}px`,
          }}
        >
          <NPC parts={NPC_WEARABLES.wobble} />
        </div>
        <img
          src={SUNNYSIDE.decorations.treasure_chest}
          style={{
            top: `${PIXEL_SCALE * -6}px`,
            right: `${PIXEL_SCALE * 39}px`,
            width: `${PIXEL_SCALE * 16}px`,
          }}
          className="absolute w-full"
        />
      </div>
    </>
  );
};
