import { Equipped } from "features/game/types/bumpkin";
import { FactionName, IslandType } from "features/game/types/game";

export type ParticipantInfo = {
  id: number;
  username: string;
  tokenUri: string;
};

export type InteractionType = "chat" | "action" | "milestone" | "announcement";

export type Interaction = {
  type: InteractionType;
  sender: ParticipantInfo;
  recipient: ParticipantInfo;
  message: string;
  createdAt: number;
};

export type Player = {
  data?: {
    id: number;
    following: number[];
    followingCount: number;
    followedBy: number[];
    followedByCount: number;
    username: string;
    level: number;
    farmCreatedAt: number;
    experience: number;
    marketValue: number;
    island: IslandType;
    dailyStreak: number;
    totalDeliveries: number;
    isVip: boolean;
    clothing: Equipped;
    faction?: FactionName;
    lastUpdatedAt: number;
  };
};

export type PlayerUpdate = Partial<NonNullable<Player["data"]>>;
export type ChatUpdate = Interaction[];
