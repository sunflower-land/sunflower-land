import React, { useContext } from "react";

import npc from "assets/npcs/blacksmith.gif";
import shadow from "assets/npcs/shadow.png";
import workbench from "assets/buildings/workbench.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CONVERSATIONS } from "features/game/types/conversations";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Conversation } from "features/farming/mail/components/Conversation";

export const WorkBench: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const conversationId = gameState.context.state.conversations.find(
    (id) => CONVERSATIONS[id].from === "blacksmith"
  );

  const [isOpen, setIsOpen] = React.useState(false);

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

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={workbench}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 47}px`,
            height: `${PIXEL_SCALE * 36}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
            right: `${PIXEL_SCALE * 11}px`,
          }}
        />
        {conversationId && (
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="absolute animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              bottom: `${PIXEL_SCALE * 32}px`,
              right: `${PIXEL_SCALE * 9}px`,
            }}
          />
        )}
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
            right: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={handleClose}>
        {conversationId ? (
          <Panel
            bumpkinParts={{
              body: "Light Brown Farmer Potion",
              hair: "Blacksmith Hair",
              pants: "Lumberjack Overalls",
              shirt: "SFL T-Shirt",
              tool: "Hammer",
              background: "Farm Background",
              shoes: "Brown Boots",
            }}
          >
            <Conversation conversationId={conversationId} />
          </Panel>
        ) : (
          <WorkbenchModal isOpen={isOpen} onClose={handleClose} />
        )}
      </Modal>
    </>
  );
};
