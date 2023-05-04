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
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { CROPS } from "features/game/types/crops";
import { Bumpkin } from "features/game/types/game";

const hasSoldCropsBefore = (bumpkin?: Bumpkin) => {
  if (!bumpkin) return false;

  const { activity = {} } = bumpkin;

  return !!getKeys(CROPS()).find((crop) =>
    getKeys(activity).includes(`${crop} Sold`)
  );
};

export const Market: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const conversationId = gameState.context.state.conversations.find(
    (id) => CONVERSATIONS[id]?.from === "betty"
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

  const hasSoldBefore = hasSoldCropsBefore(gameState.context.state.bumpkin);

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={market}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 38}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.betty}
          className="absolute pointer-events-none"
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
            className="absolute animate-float pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 9}px`,
              bottom: `${PIXEL_SCALE * 31}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          />
        )}
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        {conversationId ? (
          <Panel bumpkinParts={NPC_WEARABLES.betty}>
            <Conversation conversationId={conversationId} />
          </Panel>
        ) : (
          <ShopItems
            onClose={() => setIsOpen(false)}
            hasSoldBefore={hasSoldBefore}
          />
        )}
      </Modal>
    </>
  );
};
