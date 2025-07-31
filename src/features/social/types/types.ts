import { Equipped } from "features/game/types/bumpkin";
import { FactionName, IslandType } from "features/game/types/game";

export type ParticipantInfo = {
  id: number;
  username: string;
  clothing?: Equipped;
};

export type InteractionType = "chat" | "follow" | "milestone" | "announcement";

export type Interaction = {
  type: InteractionType;
  sender: ParticipantInfo;
  recipient: ParticipantInfo;
  message: string;
  createdAt: number;
  readAt?: number; // Timestamp when the message was read by the recipient
  id?: string; // Unique identifier for the message
};

export type Milestone = Interaction & {
  isGlobal?: boolean;
  followers?: number[];
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
