import React, { useContext, useEffect, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Bumpkins } from "./components/Bumpkins";
import {
  websocketMachine,
  MachineInterpreter,
  KICKED_COOLDOWN_MS,
  Room as RoomType,
} from "./websocketMachine";
import { Panel } from "components/ui/Panel";
import * as AuthProvider from "features/auth/lib/Provider";

import { ChatUI } from "./components/ChatUI";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { CodeOfConduct } from "features/game/components/ChatCodeOfConduct";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import sleeping from "assets/animals/chickens/sleeping.gif";
import { useNavigate, useParams } from "react-router-dom";
import { secondsToString } from "lib/utils/time";
import { acknowledgeCodeOfConduct } from "features/announcements/announcementsStorage";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { RestrictedHelper } from "./components/RestrictedHelper";
import { RestrictedPositions } from "./lib/restrictedArea";

interface Props {
  allowedArea: RestrictedPositions;
  canAccess: boolean;
  roomId: RoomType;
  spawnPoint: Coordinates;
}

export const Room: React.FC<Props> = ({
  allowedArea,
  canAccess,
  spawnPoint,
  roomId,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [restrictedHelper, setRestrictedHelper] = useState<Coordinates>();

  const [testArea, setTestArea] = useState<Coordinates[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const websocketService = useInterpret(websocketMachine, {
    context: {
      currentPosition: spawnPoint,
      accountId: authState.context.user.farmId as number,
      roomId,
      jwt: authState.context.user.rawToken,
      bumpkin: gameState.context.state.bumpkin,
      canAccess,
      kickedAt: gameState.context.state.pumpkinPlaza?.kickedAt,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(websocketService);

  useEffect(() => {
    return () => {
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

    // setTestArea((prev) => [...prev, { x: clampedX, y: clampedY }]);
    // return;

    if (
      !allowedArea[clampedX]?.[clampedY] &&
      !authState.context.user.token?.userAccess.admin
    ) {
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

  // Load data
  return (
    <>
      <div className="absolute w-full h-full">
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
              <p className="mb-4">Room is not open</p>
              <img src={SUNNYSIDE.icons.stopwatch} className="w-1/4 mb-4" />
            </div>
            <Button onClick={() => navigate(`/land/${id}`)}>Return</Button>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("kicked")} centered>
          <Panel>
            <div className="flex flex-col items-center p-2">
              <p className="mb-4">Party pooper!</p>
              <p className="mb-4 text-sm">
                Looks like you broke the rules of the room. Please wait before
                entering again.
              </p>

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
              <img src={SUNNYSIDE.icons.sad} className="w-1/3 mb-2" />
            </div>
            <Button onClick={() => websocketService.send("CONNECT")}>
              Continue
            </Button>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("full")} centered>
          <Panel>
            <div className="p-2 flex flex-col items-center">
              <p className="mb-4">This room is full.</p>
              <img src={SUNNYSIDE.icons.sad} className="w-1/3 mb-2" />
            </div>
            <Button onClick={() => navigate(`/land/${id}`)}>Return</Button>
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

        <RestrictedHelper position={restrictedHelper} />
      </div>

      {/* DEV Code only */}
      {testArea.map(({ x, y }) => (
        <div
          className="bg-green-50 opacity-50 absolute"
          id="allowed-area"
          key={`${x}-${y}`}
          style={{
            left: `${GRID_WIDTH_PX * x}px`,
            top: `${GRID_WIDTH_PX * y}px`,
            width: `${GRID_WIDTH_PX}px`,
            height: `${GRID_WIDTH_PX}px`,
          }}
        />
      ))}
      {chatState.matches("connected") && (
        <ChatUI
          farmId={0}
          onMessage={({ reaction, text }) => {
            websocketService.send("SEND_CHAT_MESSAGE", {
              text,
              reaction,
            });
          }}
          messages={[]}
        />
      )}

      {/* )} */}
    </>
  );
};
