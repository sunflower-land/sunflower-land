import React, { useContext, useEffect, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Bumpkins } from "./components/Bumpkins";
import {
  websocketMachine,
  MachineInterpreter,
  KICKED_COOLDOWN_MS,
} from "./websocketMachine";
import { Panel } from "components/ui/Panel";
import * as AuthProvider from "features/auth/lib/Provider";
import background from "assets/land/pumpkin_plaza.png";

import { ChatUI } from "./components/ChatUI";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { DailyReward } from "./components/DailyReward";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { randomInt } from "lib/utils/random";
import { Hud } from "features/island/hud/Hud";
import { CodeOfConduct } from "features/game/components/ChatCodeOfConduct";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import sleeping from "assets/animals/chickens/sleeping.gif";
import { Streamer } from "./components/Streamer";
import { upcomingParty } from "./lib/streaming";
import { useNavigate, useParams } from "react-router-dom";
import { hasFeatureAccess } from "lib/flags";
import { secondsToString } from "lib/utils/time";
import { acknowledgeCodeOfConduct } from "features/announcements/announcementsStorage";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { RestrictedHelper } from "./components/RestrictedHelper";
import { RESTRICTED_AREA } from "./lib/restrictedArea";

// Spawn players in different areas
const randomXOffset = randomInt(0, 50);
const randomYOffset = randomInt(0, 50);
export const PumpkinPlaza: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [restrictedArea, setRestrictedArea] = useState(RESTRICTED_AREA);
  const [restrictedHelper, setRestrictedHelper] = useState<Coordinates>();

  const navigate = useNavigate();
  const { id } = useParams();

  const party = upcomingParty();
  const isBetaTester = hasFeatureAccess(
    gameState.context.state.inventory,
    "PUMPKIN_PLAZA"
  );
  const isPartyActive =
    isBetaTester || (Date.now() > party.startAt && Date.now() < party.endAt);

  const websocketService = useInterpret(websocketMachine, {
    context: {
      currentPosition: { x: 1680 + randomXOffset, y: 1880 + randomYOffset },
      accountId: authState.context.farmId as number,
      jwt: authState.context.rawToken,
      bumpkin: gameState.context.state.bumpkin,
      canAccess: isPartyActive,
      kickedAt: gameState.context.state.pumpkinPlaza?.kickedAt,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(websocketService);

  useEffect(() => {
    return () => {
      console.log("Time to disconnect!");
      websocketService.send("DISCONNECT");
    };
  }, []);

  const walk = (e: React.MouseEvent<HTMLElement>) => {
    const scrollContainer = document.getElementsByClassName(
      "page-scroll-container"
    )[0];

    const x = e.pageX + scrollContainer.scrollLeft;
    const y = scrollContainer.scrollTop + e.pageY;

    const clampedX = Math.floor(x / GRID_WIDTH_PX);
    const clampedY = Math.floor(y / GRID_WIDTH_PX);

    if (RESTRICTED_AREA[clampedX]?.[clampedY]) {
      setRestrictedHelper({ x, y });
      return;
    }

    const myBumpkin = document.getElementById("my-bumpkin") as HTMLDivElement;
    const currentPosition = myBumpkin.getBoundingClientRect();
    const oldX = currentPosition.x + scrollContainer.scrollLeft;
    const oldY = currentPosition.y + scrollContainer.scrollTop;

    websocketService.send("SEND_LOCATION", {
      coordinates: { x: x, y: y },
      previousCoordinates: { x: oldX, y: oldY },
    });
  };

  console.log({
    KICKED_COOLDOWN_MS,
    kickedAt: chatState.context.kickedAt,
    seconds:
      (chatState.context.kickedAt ?? 0) + KICKED_COOLDOWN_MS - Date.now(),
    // - Date.now()) / 1000,
  });

  console.log({ restrictedArea });

  // Load data
  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
        }}
        // TODO dynamic game board size based on tile dimensions
      >
        <img
          src={background}
          className="h-auto absolute "
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
          }}
        />
        <Modal
          show={
            chatState.matches("initialising") || chatState.matches("connecting")
          }
          centered
        >
          <Panel>
            <span className="loading">Connecting</span>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("closed")} centered>
          <Panel>
            <div className="flex flex-col items-center p-2">
              <p className="mb-4">Party is over!</p>
              <img src={SUNNYSIDE.icons.stopwatch} className="w-1/4 mb-4" />
              <div className="flex flex-wrap justify-center">
                <p className="text-sm mr-2 mb-2">Next session:</p>
                <div className="flex mb-2 items-center justify-center bg-blue-600 text-white text-xxs px-1.5 pb-1 pt-0.5 border rounded-md">
                  <img
                    src={SUNNYSIDE.icons.stopwatch}
                    className="w-3 left-0 mr-1"
                  />
                  <span>{`${new Date(
                    party.startAt
                  ).toLocaleString()} - ${new Date(
                    party.endAt
                  ).toLocaleTimeString()}`}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate(`/land/${id}`)}>Return</Button>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("kicked")} centered>
          <Panel>
            <div className="flex flex-col items-center p-2">
              <p className="mb-4">You've been removed</p>

              <div className="flex flex-wrap justify-center">
                <p className="text-sm mr-2 mb-2">Cooldown</p>
                <div className="flex mb-2 items-center justify-center bg-blue-600 text-white text-xxs px-1.5 pb-1 pt-0.5 border rounded-md">
                  <img
                    src={SUNNYSIDE.icons.stopwatch}
                    className="w-3 left-0 mr-1"
                  />
                  <span>{`${secondsToString(
                    ((chatState.context.kickedAt ?? 0) +
                      KICKED_COOLDOWN_MS -
                      Date.now()) /
                      1000,
                    { length: "full" }
                  )}`}</span>
                </div>
              </div>
              <a
                className="underline text-xxs my-2 text-center mx-auto"
                href="https://docs.sunflower-land.com/support/code-of-conduct"
              >
                Code of conduct
              </a>
            </div>
            <Button onClick={() => navigate(`/land/${id}`)}>Return</Button>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("codeOfConduct")} centered>
          <Panel>
            <CodeOfConduct
              onAcknowledge={() => {
                acknowledgeCodeOfConduct();
                websocketService.send("ACKNOWLEDGE");
              }}
            />
          </Panel>
        </Modal>

        <Modal show={chatState.matches("loadingPlayers")} centered>
          <Panel>
            <span className="loading">Loading Players</span>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("disconnected")} centered>
          <Panel>
            <div className="p-2 flex flex-col items-center">
              <p className="mb-4">Are you still there?</p>
              <img src={sleeping} className="w-1/3 -mb-4" />
            </div>
            <Button onClick={() => websocketService.send("CONNECT")}>
              Continue
            </Button>
          </Panel>
        </Modal>
        <Modal show={chatState.matches("error")} centered>
          <Panel>
            <div className="p-2 flex flex-col items-center">
              <p className="mb-4">Something went wrong!</p>
              <img src={SUNNYSIDE.icons.unhappy} className="w-1/3 mb-2" />
            </div>
            <Button onClick={() => websocketService.send("CONNECT")}>
              Continue
            </Button>
          </Panel>
        </Modal>

        <div className="absolute inset-0 cursor-pointer" onClick={walk} />

        <Bumpkins
          messages={chatState.context.messages}
          discoveries={chatState.context.discoveries}
          bumpkin={chatState.context.bumpkin}
          websocketService={websocketService}
          position={chatState.context.currentPosition}
          lastPosition={chatState.context.lastPosition}
          bumpkins={chatState.context.bumpkins}
          onVisit={(id) => gameService.send({ type: "VISIT", landId: id })}
        />

        <DailyReward />
        <Streamer />

        <RestrictedHelper position={restrictedHelper} />

        <IslandTravel
          inventory={gameState.context.state.inventory}
          bumpkin={gameState.context.state.bumpkin}
          x={0}
          y={-21}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          travelAllowed={!gameState.matches("autosaving")}
        />

        {chatState.matches("connected") && (
          <ChatUI
            onMessage={({ reaction, text }) => {
              websocketService.send("SEND_CHAT_MESSAGE", {
                text,
                reaction,
              });
            }}
            game={chatState.context.game}
          />
        )}

        {/* )} */}
      </div>
      <Hud isFarming={false} />
    </>
  );
};
