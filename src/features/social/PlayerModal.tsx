/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PlayerModalPlayer } from "features/world/ui/player/PlayerModals";
import React, { useContext, useState } from "react";

import vipIcon from "assets/icons/vip.webp";
import basicIsland from "assets/icons/islands/basic.webp";
import springIsland from "assets/icons/islands/spring.webp";
import desertIsland from "assets/icons/islands/desert.webp";
import volcanoIsland from "assets/icons/islands/volcano.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import deliveryBook from "assets/icons/chapter_icon_3.webp";

import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getLevel } from "features/game/types/skills";
import Decimal from "decimal.js-light";
import { capitalize } from "lib/utils/capitalize";
import { isMobile } from "mobile-device-detect";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { FollowerFeed } from "./components/FollowerFeed";
import { IslandType } from "features/game/types/game";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { getPlayer } from "./actions/getPlayer";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";
import { Interaction, Player, PlayerUpdate } from "./types/types";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useSocial } from "./hooks/useSocial";
import { useNavigate } from "react-router";
import { useVisiting } from "lib/utils/visitUtils";

const ISLAND_ICONS: Record<IslandType, string> = {
  basic: basicIsland,
  spring: springIsland,
  desert: desertIsland,
  volcano: volcanoIsland,
};

type Props = {
  player: PlayerModalPlayer;
};

const mergePlayerData = (current: Player, update: PlayerUpdate): Player => {
  return {
    data: { ...current.data, ...update },
  } as Player;
};

const Followers = ({
  farmId,
  followers,
}: {
  farmId: number;
  followers: number[];
}) => {
  const { online } = useSocial(farmId, followers);
  const { t } = useTranslation();

  if (!followers.length) {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-xs">{t("playerModal.noFollowers")}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {followers.map((follower) => {
        const isOnline = (online[follower] ?? 0) > Date.now() - 30 * 60 * 1000;
        return (
          <div key={`flw-${follower}`}>
            <div>{follower}</div>
            <div>{isOnline ? "Online" : "Offline"}</div>
          </div>
        );
      })}
    </div>
  );
};

const _farmId = (state: MachineState) => state.context.farmId;
const _token = (state: MachineState) => state.context.rawToken;
const _myUsername = (state: MachineState) => state.context.state.username;
const _myClothing = (state: MachineState) =>
  state.context.state.bumpkin.equipped;

export const PlayerDetails: React.FC<Props> = ({ player }) => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();

  const [followingLoading, setFollowingLoading] = useState(false);
  const [isFollowingFeedOpen, setIsFollowingFeedOpen] = useState(false);
  const { isVisiting } = useVisiting();

  const token = useSelector(gameService, _token);
  const farmId = useSelector(gameService, _farmId);
  const myUsername = useSelector(gameService, _myUsername);
  const myClothing = useSelector(gameService, _myClothing);

  // Used only to share my online status with the followers
  useSocial(farmId, []);

  const { t } = useTranslation();

  const {
    data,
    isLoading: playerLoading,
    error,
    mutate,
  } = useSWR(
    ["player", token, farmId, player.farmId],
    ([, token, farmId, followedPlayerId]) => {
      return getPlayer({ token: token as string, farmId, followedPlayerId });
    },
    {
      revalidateOnFocus: false,
    },
  );

  const iAmFollowing = data?.data?.followedBy.includes(farmId);
  const theyAreFollowingMe = data?.data?.following.includes(farmId);
  const isMutual = iAmFollowing && theyAreFollowingMe;

  const handleFollow = async () => {
    setFollowingLoading(true);
    try {
      if (iAmFollowing) {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.unfollowed",
            followedId: player.farmId,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: farmId,
        });

        mutate((current) => mergePlayerData(current!, response), {
          revalidate: false,
        });
      } else {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.followed",
            followedId: player.farmId,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: farmId,
        });

        mutate((current) => mergePlayerData(current!, response), {
          revalidate: false,
        });
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    } finally {
      setFollowingLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    const newMessage: Interaction = {
      type: "chat",
      message,
      recipient: {
        id: player.farmId,
        tokenUri: tokenUriBuilder(player.clothing),
        username: player.username ?? `#${player.farmId}`,
      },
      sender: {
        id: farmId,
        tokenUri: tokenUriBuilder(myClothing),
        username: myUsername ?? `#${farmId}`,
      },
      createdAt: Date.now(),
    };

    // Optimistically update the messages
    mutate(
      async (current) => {
        const { data: response } = await postEffect({
          effect: {
            type: "message.sent",
            recipientId: player.farmId,
            message,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: farmId,
        });

        return mergePlayerData(current!, response);
      },
      {
        revalidate: false,
        optimisticData: (_, current) =>
          mergePlayerData(current!, {
            messages: [...(current?.data?.messages ?? []), newMessage],
          }),
      },
    );
  };

  const visitFarm = () => {
    navigate(`/visit/${player.farmId}`);
  };

  const startDate = new Date(player?.createdAt).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex gap-1 w-full max-h-[370px]">
      <ModalOverlay
        show={isFollowingFeedOpen}
        onBackdropClick={() => setIsFollowingFeedOpen(false)}
      >
        <InnerPanel>
          <Followers farmId={farmId} followers={data?.data?.followedBy ?? []} />
        </InnerPanel>
      </ModalOverlay>
      <div className="flex flex-col flex-1 gap-1">
        <InnerPanel className="flex flex-col gap-1 flex-1 pb-1 px-1">
          <div className="flex items-center">
            <Label type="default">{player?.username}</Label>
            {player?.isVip && <img src={vipIcon} className="w-5 ml-2" />}
          </div>
          <div className="flex pb-1">
            <div className="w-10">
              <NPCIcon parts={player?.clothing} width={PIXEL_SCALE * 14} />
            </div>
            <div className="flex flex-col gap-1 text-xs mt-1 ml-2 flex-1">
              <div>{`Lvl ${getLevel(new Decimal(player?.experience ?? 0))}${player?.faction ? ` - ${capitalize(player?.faction)}` : ""}`}</div>
              <div className="flex items-center justify-between">
                <span>{`#${player?.farmId}`}</span>
                <span>{t("playerModal.since", { date: startDate })}</span>
              </div>
            </div>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col w-full pb-1">
          <div className="p-1 flex items-center">
            <div className="w-10">
              <img
                src={ISLAND_ICONS[player?.islandType ?? "basic"]}
                className="w-full"
              />
            </div>
            <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
              <div>
                {t("playerModal.island", {
                  island: capitalize(player?.islandType ?? ""),
                })}
              </div>
              <div className="flex items-center">
                <span>{t("playerModal.marketValue", { value: 1000 })}</span>
                <img src={flowerIcon} className="w-4 h-4 ml-1 mt-0.5" />
              </div>
            </div>
            {!isVisiting && (
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mt-1"
                onClick={visitFarm}
              >
                <div className="flex items-center px-1">
                  {!isMobile && <span className="pr-1">{t("visit")}</span>}
                  <img
                    src={SUNNYSIDE.icons.search}
                    className="flex justify-center items-center w-4 h-4"
                  />
                </div>
              </Button>
            )}
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col items-center w-full">
          <div className="flex flex-col gap-1 p-1 w-full ml-1 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span
                  className="text-xs underline cursor-pointer"
                  onClick={() => setIsFollowingFeedOpen(true)}
                >
                  {t("playerModal.followers", {
                    count: data?.data?.followedByCount,
                  })}
                </span>
                <div className="relative w-10 h-6">
                  <div className="absolute">
                    <NPCIcon
                      width={24}
                      parts={{
                        body: "Light Brown Farmer Potion",
                        pants: "Angler Waders",
                        hair: "Buzz Cut",
                        shirt: "Chic Gala Blouse",
                        tool: "Farmer Pitchfork",
                        background: "Farm Background",
                        shoes: "Black Farmer Boots",
                      }}
                    />
                  </div>
                  <div className="absolute left-3.5">
                    <NPCIcon
                      width={24}
                      parts={{
                        body: "Goblin Potion",
                        pants: "Grape Pants",
                        hair: "Ash Ponytail",
                        shirt: "Tiki Armor",
                        tool: "Axe",
                        background: "Farm Background",
                        shoes: "Crimstone Boots",
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mt-1 mr-0.5"
                disabled={playerLoading || followingLoading || error}
                onClick={handleFollow}
              >
                {followingLoading
                  ? `...`
                  : iAmFollowing
                    ? `Unfollow`
                    : `Follow`}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-1 pt-0 mb-2 w-full">
            <div className="text-xs">{`You cleaned their farm x times`}</div>
            <div className="text-xs">{`They cleaned your farm x times`}</div>
            <div className="text-xs">{`Top friend - Craig`}</div>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col w-full pb-1">
          <div className="p-1 flex items-center">
            <div className="w-10">
              <img src={deliveryBook} className="w-full" />
            </div>
            <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
              <div>
                {t("playerModal.dailyStreak", { streak: player?.dailyStreak })}
              </div>
              <div>
                {t("playerModal.totalDeliveries", {
                  count: player?.totalDeliveries,
                })}
              </div>
            </div>
          </div>
        </InnerPanel>
      </div>
      {!isMobile && (
        <FollowerFeed
          interactions={data?.data?.messages ?? []}
          onInteraction={(message) => {
            sendMessage(message);
          }}
          chatDisabled={!isMutual}
        />
      )}
    </div>
  );
};
