import React, { useContext } from "react";

import market from "assets/buildings/market.png";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Modal } from "react-bootstrap";
import { ShopItems } from "./ShopItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Conversation } from "features/farming/mail/components/Conversation";
import { CONVERSATIONS } from "features/game/types/conversations";
import { Panel } from "components/ui/Panel";

export const Market: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const conversationId = gameState.context.state.conversations.find(
    (id) => CONVERSATIONS[id].from === "betty"
  );

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }
    if (isBuilt) {
      // Add future on click actions here
      setIsOpen(true);
      return;
    }
  };

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={market}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 38}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.betty}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 8}px`,
            right: `${PIXEL_SCALE * 4}px`,
            transform: "scaleX(-1)",
          }}
        />
        {conversationId && (
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="absolute animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              bottom: `${PIXEL_SCALE * 26}px`,
              right: `${PIXEL_SCALE * 5}px`,
            }}
          />
        )}
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        {conversationId ? (
          <Panel
            bumpkinParts={{
              body: "Beige Farmer Potion",
              hair: "Rancher Hair",
              pants: "Farmer Overalls",
              shirt: "Red Farmer Shirt",
              tool: "Parsnip",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          >
            <Conversation conversationId={conversationId} />
          </Panel>
        ) : (
          <ShopItems onClose={() => setIsOpen(false)} />
        )}
      </Modal>
    </>
  );
};
