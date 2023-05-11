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
import { NPC_WEARABLES } from "lib/npcs";
import { shopAudio } from "lib/utils/sfx";

export const WorkBench: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const conversationId = gameState.context.state.conversations.find(
    (id) => CONVERSATIONS[id]?.from === "blacksmith"
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      shopAudio.play();
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
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 47}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
            right: `${PIXEL_SCALE * 11}px`,
          }}
        />
        {conversationId && (
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="absolute animate-float pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 9}px`,
              bottom: `${PIXEL_SCALE * 36}px`,
              right: `${PIXEL_SCALE * 8}px`,
            }}
          />
        )}
        <img
          src={npc}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
            right: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={handleClose}>
        {conversationId ? (
          <Panel bumpkinParts={NPC_WEARABLES.blacksmith}>
            <Conversation conversationId={conversationId} />
          </Panel>
        ) : (
          <WorkbenchModal onClose={handleClose} />
        )}
      </Modal>
    </>
  );
};
