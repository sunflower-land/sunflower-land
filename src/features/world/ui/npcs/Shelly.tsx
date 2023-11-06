import React, { useContext, useEffect, useState } from "react";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import { SpeakingModal } from "features/game/components/SpeakingModal";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getSeasonalTicket } from "features/game/types/seasons";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import { SpeakingText } from "features/game/components/SpeakingModal";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";

import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";

interface OrderCardsProps {
  tentaclesAvailable: Decimal;
  canTrade: boolean;
  rewardQty: number;
}

const OrderCards: React.FC<OrderCardsProps> = ({
  tentaclesAvailable,
  canTrade,
  rewardQty,
}) => {
  return (
    <>
      <div className="gap-2 mt-3">
        <OuterPanel
          className={classNames("flex flex-1 p-2 flex-col space-y-1 relative", {
            "opacity-50": !canTrade,
          })}
        >
          <RequirementLabel
            type="item"
            item={"Kraken Tentacle"}
            balance={tentaclesAvailable}
            showLabel
            requirement={new Decimal(1)}
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center mt-1" key={getSeasonalTicket()}>
              <img
                src={ITEM_DETAILS[getSeasonalTicket()].image}
                className="h-5 mr-1"
              />
              <span className="text-xs">{rewardQty}</span>
            </div>
          </div>
          {canTrade && (
            <>
              <img
                className="absolute pointer-events-none"
                src={selectBoxBL}
                style={{
                  bottom: `${PIXEL_SCALE * -3}px`,
                  left: `${PIXEL_SCALE * -3}px`,
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
              <img
                className="absolute pointer-events-none"
                src={selectBoxBR}
                style={{
                  bottom: `${PIXEL_SCALE * -3}px`,
                  right: `${PIXEL_SCALE * -3}px`,
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
              <img
                className="absolute pointer-events-none"
                src={selectBoxTL}
                style={{
                  top: `${PIXEL_SCALE * -5}px`,
                  left: `${PIXEL_SCALE * -3}px`,
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
              <img
                className="absolute pointer-events-none"
                src={selectBoxTR}
                style={{
                  top: `${PIXEL_SCALE * -5}px`,
                  right: `${PIXEL_SCALE * -3}px`,
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            </>
          )}
        </OuterPanel>
      </div>
    </>
  );
};

interface Props {
  onClose: () => void;
  canTrade: boolean;
  handleTrade: () => void;
  tentaclesAvailable: Decimal;
  rewardQty: number;
}

export const ShellyPanelContent: React.FC<Props> = ({
  onClose,
  canTrade,
  handleTrade,
  tentaclesAvailable,
  rewardQty,
}) => {
  const { gameService } = useContext(Context);

  const { tasksAreFrozen } = getSeasonChangeover({
    id: gameService.state.context.state.id,
  });

  if (tasksAreFrozen) {
    return (
      <SpeakingText
        onClose={onClose}
        message={[
          {
            text: `I am waiting for the new season to start. Come back to me then!`,
          },
        ]}
      />
    );
  }

  return (
    <SpeakingText
      onClose={onClose}
      message={[
        {
          text: canTrade
            ? "Oh my, you've got a Kraken Tentacle! I'll swap it for some mermaid scales."
            : "Looks like you don't have any Kraken Tentacles at hand! Come back when you do.",
          jsx: (
            <OrderCards
              tentaclesAvailable={tentaclesAvailable}
              canTrade={canTrade}
              rewardQty={rewardQty}
            />
          ),
          actions: [
            ...(canTrade
              ? [
                  {
                    text: `Swap`,
                    cb: handleTrade,
                  },
                ]
              : [
                  {
                    text: `Close`,
                    cb: onClose,
                  },
                ]),
          ],
        },
      ]}
    />
  );
};

export const KrakenIntro: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <SpeakingModal
      key="kraken"
      onClose={() => {
        onClose();
      }}
      bumpkinParts={NPC_WEARABLES.shelly}
      message={[
        {
          text: "The Kraken's appetite is constantly changing.",
        },
        {
          text: `Right now it has a hunger for ${state.catchTheKraken.hunger}....Phew, that's better than Bumpkins.`,
        },
        {
          text: "Head to your fishing spot and try catch the beast!",
          actions: [
            {
              text: "Got it!",
              cb: () => onClose(),
            },
          ],
        },
      ]}
    />
  );
};
interface Props {
  onClose: () => void;
}

export const Shelly: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showBeachIntro, setShowBeachIntro] = useState(
    !isNPCAcknowledged("shelly")
  );
  const [showKrakenIntro, setShowKrakenIntro] = useState(
    isNPCAcknowledged("shelly")
  );

  const game = gameState.context.state;

  const currentTentaclesInInventory =
    game.inventory["Kraken Tentacle"] || new Decimal(0);

  const currentTentaclesPlaced =
    game.collectibles["Kraken Tentacle"]?.length || 0;

  const hasItem = !currentTentaclesInInventory
    .sub(currentTentaclesPlaced)
    .lte(0);

  const tentaclesAvailable = currentTentaclesInInventory.sub(
    currentTentaclesPlaced
  );

  const rewardQty = game.collectibles["Catch the Kraken Banner"] ? 12 : 10;

  useEffect(() => {
    acknowledgeNPC("shelly");
  }, []);

  if (showBeachIntro) {
    return (
      <SpeakingModal
        key="feathers"
        onClose={() => {
          onClose();
        }}
        bumpkinParts={NPC_WEARABLES.shelly}
        message={[
          {
            text: "Howdy, Bumpkin! Welcome to the beach!",
          },
          {
            text: "After a hard day's work on your farm, there's no better place to kick back and enjoy the waves.",
          },
          {
            text: "But we've got a bit of a situation. A massive kraken has emerged and taken control of our beloved beach.",
          },
          {
            text: "We could really use your help, dear. Grab your bait and fishing rods, and together, we'll tackle this colossal problem!",
          },
          {
            text: "For each tentacle you catch I will provide you with valuable mermaid scales!",
            actions: [
              {
                text: "Let's do it!",
                cb: () => setShowBeachIntro(false),
              },
            ],
          },
        ]}
      />
    );
  }

  if (showKrakenIntro) {
    return <KrakenIntro onClose={() => setShowKrakenIntro(false)} />;
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.shelly}>
      <ShellyPanelContent
        onClose={onClose}
        handleTrade={() => gameService.send("shelly.tradeTentacle")}
        canTrade={hasItem}
        rewardQty={rewardQty}
        tentaclesAvailable={tentaclesAvailable}
      />
    </CloseButtonPanel>
  );
};
