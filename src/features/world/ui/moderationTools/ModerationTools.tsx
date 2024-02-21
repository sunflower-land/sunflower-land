import React, { useState, useContext } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SceneId } from "features/world/mmoMachine";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import { PlayerList } from "./tabs/PlayerList";
import { ChatHistory } from "./tabs/ChatHistory";
import { Actions } from "./tabs/Actions";

import discord from "assets/skills/discord.png";
import { MachineInterpreter, Moderation } from "features/game/lib/gameMachine";

export type Message = {
  farmId: number;
  sessionId: string;
  text: string;
  sceneId: SceneId;
  sentAt: number;
};

export type Player = {
  farmId: number;
  username: string;
  playerId: string;
  x: number;
  y: number;
  clothing: BumpkinParts;
  moderation?: Moderation;
};

interface Props {
  scene?: any;
  messages: Message[];
  players: Player[];
  gameService: MachineInterpreter;
}

export const ModerationTools: React.FC<Props> = ({
  scene,
  messages,
  players,
  gameService,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [showModerationTool, setShowModerationTool] = useState(false);
  const [tab, setTab] = useState(0);
  const moderatorFarmId = gameService.state.context.farmId;

  const toggleModerationTool = () => {
    setShowModerationTool(!showModerationTool);
  };

  return (
    <>
      <div
        className={classNames(
          "absolute bottom-36 left-2 cursor-pointer hover:img-highlight"
        )}
        style={{ width: `${PIXEL_SCALE * 22}px`, zIndex: 49 }}
        onClick={toggleModerationTool}
      >
        <img
          src={SUNNYSIDE.icons.disc}
          style={{ width: `${PIXEL_SCALE * 22}px` }}
        />
        <img
          src={discord}
          style={{ width: `${PIXEL_SCALE * 12}px` }}
          className="absolute bottom-[17.5px] left-[13px]"
        />
      </div>

      <Modal show={showModerationTool} onHide={toggleModerationTool} size="lg">
        <CloseButtonPanel
          onClose={toggleModerationTool}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.icons.player,
              name: "Players List",
            },
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: "Chat History",
            },
            {
              icon: SUNNYSIDE.icons.hammer,
              name: "Actions",
            },
          ]}
        >
          {tab === 0 && (
            <PlayerList
              scene={scene}
              players={players}
              authState={authState.context.user}
              moderatorFarmId={moderatorFarmId}
            />
          )}
          {tab === 1 && <ChatHistory messages={messages} />}
          {tab === 2 && (
            <Actions
              scene={scene}
              authState={authState.context.user}
              moderatorFarmId={moderatorFarmId}
            />
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
