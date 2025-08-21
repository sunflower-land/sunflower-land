import { Equipped } from "features/game/types/bumpkin";
import { FactionName, IslandType } from "features/game/types/game";
import { MonumentName } from "features/game/types/monuments";

export type ParticipantInfo = {
  id: number;
  username: string;
  clothing?: Equipped;
};

export type InteractionType =
  | "chat"
  | "follow"
  | "milestone"
  | "announcement"
  | "cheer"
  | "help";

export type Interaction = {
  type: InteractionType;
  sender: ParticipantInfo;
  recipient: ParticipantInfo;
  message: string;
  createdAt: number;
  readAt?: number; // Timestamp when the message was read by the recipient
  id?: string; // Unique identifier for the message
  helpedThemToday?: boolean;
};

export type Milestone = Interaction & {
  isGlobal?: boolean;
  followers?: number[];
};

export type ActiveProjects = Partial<
  Record<MonumentName, { receivedCheers: number; requiredCheers: number }>
>;

export type Player = {
  data?: {
    id: number;
    following: number[];
    followedBy: number[];
    username: string;
    level: number;
    farmCreatedAt: number;
    marketValue: number;
    island: IslandType;
    isVip: boolean;
    clothing: Equipped;
    faction?: FactionName;
    lastUpdatedAt: number;
    socialPoints: number;
    projects: ActiveProjects;
    youHelpedThemCount: number;
    theyHelpedYouCount: number;
    helpedYouToday: boolean;
    helpedThemToday: boolean;
    helpStreak: number;
  };
};

export type PlayerUpdate = Partial<NonNullable<Player["data"]>>;
export type ChatUpdate = Interaction[];
