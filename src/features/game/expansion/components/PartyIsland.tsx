import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import partyIsland from "assets/land/party_island.png";
import beachBall from "assets/seasons/solar-flare/beach_ball.webp";
import lockIcon from "assets/skills/lock.png";
import levelUpIcon from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";

import * as AuthProvider from "features/auth/lib/Provider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { upcomingParty } from "features/pumpkinPlaza/lib/streaming";
import { Context } from "features/game/GameProvider";
import { getBumpkinLevel } from "features/game/lib/level";
import { Room } from "features/pumpkinPlaza/websocketMachine";
import {
  loadRooms,
  Rooms as IRooms,
} from "features/pumpkinPlaza/actions/loadRooms";

import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";

import { MapPlacement } from "./MapPlacement";
import classNames from "classnames";
import { Button } from "components/ui/Button";

type PartyRoom = {
  roomId: Room;
  name: string;
  levelRequired: number;
  image: string;
  path: string;
};

export const Rooms: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [roomCapacity, setRoomCapacity] = useState<IRooms>();

  useEffect(() => {
    const load = async () => {
      const { rooms } = await loadRooms({
        token: authState.context.user.rawToken as string,
      });

      setRoomCapacity(rooms);
      setIsLoading(false);
    };
    load();
  }, []);

  const ROOMS: PartyRoom[] = [
    {
      roomId: "plaza",
      name: "Pumpkin Plaza",
      image: CROP_LIFECYCLE.Pumpkin.crop,
      path: `/land/${id}/plaza`,
      levelRequired: 3,
    },
    {
      roomId: "beach",
      name: "Beach Party",
      image: SUNNYSIDE.resource.crab,
      path: `/land/${id}/beach`,
      levelRequired: 10,
    },
    {
      roomId: "headquarters",
      name: "Head Quarters",
      image: SUNNYSIDE.icons.heart,
      path: `/land/${id}/headquarters`,
      levelRequired: 20,
    },
    {
      roomId: "stoneHaven",
      name: "Stone Haven",
      image: SUNNYSIDE.tools.stone_pickaxe,
      path: `/land/${id}/stone-haven`,
      levelRequired: 30,
    },
  ];

  const level = getBumpkinLevel(
    gameState.context.state.bumpkin?.experience ?? 0
  );

  if (isLoading) {
    return <p className="loading">Loading</p>;
  }
  return (
    <>
      {ROOMS.map((room) => (
        <OuterPanel
          className={classNames(
            "flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200",
            {
              "cursor-not-allowed": level < room.levelRequired,
            }
          )}
          key={room.roomId}
          onClick={() => {
            if (level >= room.levelRequired) {
              navigate(room.path);
            }
          }}
        >
          <div className="w-16 justify-center flex mr-2">
            <img src={room.image} className="h-9" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex">
              {level < room.levelRequired && (
                <img src={lockIcon} className="h-6 mr-2" />
              )}
              <p className="text-sm">{room.name}</p>
            </div>
            <div className="flex gap-2 items-center mt-2 mb-1">
              {level < room.levelRequired && (
                <Label type="danger" className="flex gap-2 items-center">
                  <img src={levelUpIcon} className="h-4" />
                  Lvl {room.levelRequired}
                </Label>
              )}
              {roomCapacity && roomCapacity[room.roomId] >= 50 && (
                <Label type="danger" className="flex gap-2 items-center">
                  <img src={SUNNYSIDE.icons.player} className="h-4" />
                  {`50/50 - FULL`}
                </Label>
              )}
              {roomCapacity &&
                roomCapacity[room.roomId] >= 25 &&
                roomCapacity[room.roomId] < 50 && (
                  <Label type="info" className="flex gap-2 items-center">
                    <img src={SUNNYSIDE.icons.player} className="h-4" />
                    {`${roomCapacity[room.roomId]}/50`}
                  </Label>
                )}
              {roomCapacity && roomCapacity[room.roomId] < 25 && (
                <Label type="info" className="flex gap-2 items-center">
                  <img src={SUNNYSIDE.icons.player} className="h-4" />
                  {`${roomCapacity[room.roomId]}/50`}
                </Label>
              )}
            </div>
          </div>
        </OuterPanel>
      ))}
    </>
  );
};

interface Props {
  offset: number;
}

export const PartyIsland: React.FC<Props> = ({ offset }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showSharkModal, setShowSharkModal] = useState(false);
  const [showTigerModal, setShowTigerModal] = useState(false);
  const [showPirateModal, setShowPirateModal] = useState(false);

  const isGuest = gameState.matches("playingGuestGame");

  const party = upcomingParty();

  const isPartyActive = Date.now() > party.startAt && Date.now() < party.endAt;

  const hasAccess = false;

  const onUpgrade = () => {
    gameService.send("UPGRADE");
    setShowSharkModal(false);
  };

  const PartyModalContent = () => {
    if (isGuest) {
      return (
        <>
          <div className="p-2 pt-0 mb-2 text-sm space-y-2">
            <img
              src={beachBall}
              className="mb-2 mx-auto"
              style={{
                width: `${PIXEL_SCALE * 15}px`,
              }}
            />
            <p>
              {`Don't miss out on all the fun and excitement of meeting the team and interacting with other Bumpkins on party island.`}
            </p>
            <p>Upgrade to a full farm account and be a part of the action!</p>
          </div>
          <Button onClick={onUpgrade}>Upgrade now!</Button>
        </>
      );
    }

    return (
      <div className="p-2">
        <p className="text-sm mb-3">
          Meet the team and interact with other Bumpkins.
        </p>
        {!hasAccess && (
          <p className="text-sm italic mb-2">
            Coming soon. This is an experimental feature being tested.
          </p>
        )}

        {hasAccess && <Rooms />}
      </div>
    );
  };

  return (
    <>
      <Modal
        show={showSharkModal}
        centered
        onHide={() => setShowSharkModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowSharkModal(false)}
          bumpkinParts={{
            body: "Dark Brown Farmer Potion",
            onesie: "Shark Onesie",
            hair: "Buzz Cut",
          }}
          title={
            <div className="flex justify-center">
              <p>Party Time!</p>
            </div>
          }
        >
          {PartyModalContent()}
        </CloseButtonPanel>
      </Modal>

      <Modal
        show={showTigerModal}
        centered
        onHide={() => setShowTigerModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowTigerModal(false)}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            onesie: "Tiger Onesie",
            hair: "Red Long Hair",
          }}
        >
          <div className="p-2">
            <p className="mb-3">Rooooooar!</p>
            <p className="mb-3">{`I hope there are other tigers at the party.`}</p>
          </div>
        </CloseButtonPanel>
      </Modal>
      <Modal
        show={showPirateModal}
        centered
        onHide={() => setShowPirateModal(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowPirateModal(false)}
          bumpkinParts={{
            body: "Goblin Potion",
            hat: "Pirate Hat",
            hair: "Buzz Cut",
            shirt: "SFL T-Shirt",
            pants: "Farmer Pants",
            tool: "Pirate Scimitar",
          }}
        >
          <div className="p-2">
            <p className="mb-3">Ahoy!</p>
            <p className="mb-3">{`I can't wait to pillage treasure at the Pumpkin Plaza.`}</p>
          </div>
        </CloseButtonPanel>
      </Modal>
      <MapPlacement x={10 + offset} y={3} width={6}>
        <img
          src={partyIsland}
          style={{
            width: `${PIXEL_SCALE * 78}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 1}px`,
            bottom: `${GRID_WIDTH_PX * 4.5}px`,
          }}
        >
          <NPC
            parts={{
              body: "Dark Brown Farmer Potion",
              onesie: "Shark Onesie",
              hair: "Buzz Cut",
            }}
            onClick={() => setShowSharkModal(true)}
          />
        </div>

        <img
          src={SUNNYSIDE.icons.expression_chat}
          className="absolute animate-float"
          style={{
            width: `${PIXEL_SCALE * 9}px`,
            top: `${PIXEL_SCALE * -4}px`,
            left: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 4.5}px`,
            bottom: `${GRID_WIDTH_PX * 3.5}px`,
            transform: "scaleX(-1)",
          }}
        >
          <NPC
            parts={{
              body: "Goblin Potion",
              hat: "Pirate Hat",
              hair: "Buzz Cut",
            }}
            onClick={() => setShowPirateModal(true)}
          />
        </div>
        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 2}px`,
            bottom: `${GRID_WIDTH_PX * 3.5}px`,
          }}
        >
          <NPC
            parts={{
              body: "Beige Farmer Potion",
              onesie: "Tiger Onesie",
              hair: "Red Long Hair",
            }}
            onClick={() => setShowTigerModal(true)}
          />
        </div>
      </MapPlacement>
    </>
  );
};
