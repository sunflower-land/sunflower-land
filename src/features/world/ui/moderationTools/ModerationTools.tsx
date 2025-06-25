import React, { useState, useContext } from "react";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SceneId } from "features/world/mmoMachine";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import { PlayerList } from "./tabs/PlayerList";
import { ChatHistory } from "./tabs/ChatHistory";
import { Actions } from "./tabs/Actions";

import { MachineInterpreter, Moderation } from "features/game/lib/gameMachine";
import { RoundButton } from "components/ui/RoundButton";

export type Message = {
  farmId: number;
  sessionId: string;
  text: string;
  sceneId: SceneId;
  sentAt: number;
  username: string;
};

export type Player = {
  farmId: number;
  username: string;
  playerId: string;
  x: number;
  y: number;
  clothing: BumpkinParts;
  moderation?: Moderation;
  experience: number;
  sceneId: SceneId;
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
        className="fixed"
        style={{
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 55}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <RoundButton onClick={toggleModerationTool}>
          <img
            src={SUNNYSIDE.badges.discord}
            className="absolute group-active:translate-y-[2px]"
            style={{
              height: `${PIXEL_SCALE * 12}px`,
              width: `${PIXEL_SCALE * 12}px`,
              top: `${PIXEL_SCALE * 4.5}px`,
              left: `${PIXEL_SCALE * 5}px`,
            }}
          />
        </RoundButton>
      </div>

      <Modal show={showModerationTool} onHide={toggleModerationTool} size="lg">
        <CloseButtonPanel
          onClose={toggleModerationTool}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.icons.player,
              name: "Players",
            },
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: "Chat",
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
              messages={messages}
              authState={authState.context.user}
              moderatorFarmId={moderatorFarmId}
            />
          )}
          {tab === 1 && (
            <ChatHistory
              messages={messages}
              authState={authState.context.user}
              moderatorFarmId={moderatorFarmId}
              scene={scene}
            />
          )}
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
