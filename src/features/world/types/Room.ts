import type { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import type { NPCName } from "lib/npcs";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { SceneId } from "../mmoMachine";
// NOTE: `moderation` is deliberately absent from `Player` below, and should
// stay that way. It was replicated behind a `@filter`, which forced the server
// to re-encode the whole room separately for every client on every patch. The
// MMO no longer carries moderation state at all.
import type { FactionName } from "features/game/types/game";
import type { PetNFTType } from "features/game/types/pets";

export interface InputData {
  x: number;
  y: number;
  tick: number;
  text: string;
  /** Community-game score, sent live so the room stores it on the player. */
  points?: number;
  /** The community game the player is currently in. Sent on entry + every
   * update; the room resets points when it changes, and clients filter the
   * board/other players by it so different games never mix. */
  giveawayId?: string;
}

export interface Player extends Schema {
  username: string;
  farmId: number;
  faction?: FactionName;
  x: number;
  y: number;
  /** Community-game score, submitted live by the mini-game the player is in.
   * Authoritative for the giveaway leaderboard. Optional until the room syncs it. */
  points?: number;
  /** The community game this player is currently in — clients filter the board
   * and rendered players by it, so different/back-to-back games never mix. */
  giveawayId?: string;
  experience: number;
  // Ascension band — needed to read `experience` as a level. Optional until the MMO
  // server syncs it; consumers default to 0 (legacy pre-ascension reading) meanwhile.
  ascensionLevel?: number;
  tick: number;
  clothing: BumpkinParts & { updatedAt: number };
  npc: NPCName;
  sceneId: SceneId;

  inputQueue: InputData[];
}

export interface Bud extends Schema {
  farmId: number;
  x: number;
  y: number;
  id: number;
  sceneId: SceneId;
}

export interface Pet extends Schema {
  sessionId: string;
  farmId: number;
  x: number;
  y: number;
  id: number;
  name: string;
  type: PetNFTType;
  sceneId: SceneId;
}

export interface Message extends Schema {
  text: string;
  farmId?: number;
  username?: string;
  sessionId: string;
  sceneId: SceneId;
  sentAt: number;
}

export interface Reaction extends Schema {
  reaction: "heart" | "sad" | "happy";
  quantity?: number;
  farmId?: number;
  sessionId: string;
  sceneId: SceneId;
  sentAt: number;
}

export interface Action extends Schema {
  farmId?: number;
  sceneId: SceneId;
  sentAt: number;
  event: string;
  x?: number;
  y?: number;
}
export interface Trade extends Schema {
  text: string;
  sellerId: string;
  createdAt: number;
  buyerId?: string;
  boughtAt?: number;
  sceneId?: string;
  tradeId: string;
}

export interface MicroInteraction extends Schema {
  type:
    | "wave"
    | "wave_ack"
    | "wave_cancel"
    | "cheer"
    | "cheer_ack"
    | "cheer_cancel";
  receiverId: number;
  senderId: number;
  sentAt: number;
  sceneId: SceneId;
}

export interface Dog extends Schema {
  id: 1 | 2;
  x: number;
  y: number;
  isWalking: boolean;
}

export type PetalState = "active" | "inactive" | "solved" | "overloaded";

export interface GiantFlower extends Schema {
  puzzleSolvedAt?: number;
  leftPetal?: PetalState;
  rightPetal?: PetalState;
  topPetal?: PetalState;
  bottomPetal?: PetalState;
}

/**
 * Love Island "Love Dilemma" round, published by the room while that puzzle
 * is active. Rounds run on a fixed 40s clock (30s choose + 10s reveal).
 */
export interface LoveDilemma extends Schema {
  roundId: number;
  /** Epoch ms - end of the choose phase. */
  chooseEndsAt: number;
  /** Epoch ms - end of the reveal phase (start of the next round). */
  revealEndsAt: number;
  /** Tier (0 = best) shown on each platform, indexed by platform 0-2 (length 3). */
  tiers: ArraySchema<number>;
  /** How many players have locked in a choice this round. */
  chosenCount: number;
  /**
   * sessionId -> platform. Kept EMPTY during the choose phase so nobody can
   * see where the crowd is going; populated by the server at reveal.
   */
  choices: MapSchema<number>;
}

/**
 * Love Island "Love Boulder", published by the love_island room. The whole
 * island taps one boulder down from `hits` to zero; everyone who landed a
 * hit that round can claim a Love Charm prize once a day.
 */
export interface LoveBoulder extends Schema {
  /** Increments every time a fresh boulder appears. */
  roundId: number;
  /** Hits a fresh boulder starts with (1000). 0 means the room isn't running it. */
  hits: number;
  /** Hits still needed to break it. */
  hitsRemaining: number;
  /** Epoch ms the boulder broke; 0 while it's standing. */
  brokenAt: number;
  /** Epoch ms a fresh boulder appears; 0 while it's standing. */
  respawnAt: number;
  /** farmId -> hits landed this round. Proof of who helped. */
  miners: MapSchema<number>;
}

export interface PlazaRoomState extends Schema {
  mapWidth: number;
  mapHeight: number;

  /** Authoritative server clock (epoch ms); 0 when the room doesn't publish it. */
  serverTime: number;

  players: MapSchema<Player>;
  buds: MapSchema<Bud>;
  pets: MapSchema<Pet>;

  messages: ArraySchema<Message>;
  reactions: ArraySchema<Reaction>;
  trades: ArraySchema<Trade>;
  microInteractions: ArraySchema<MicroInteraction>;
  actions: ArraySchema<Action>;

  dogs: MapSchema<Dog>;
  giantFlower: GiantFlower;
  /** Only present in the love_island room while the dilemma puzzle is on. */
  loveDilemma?: LoveDilemma;
  /** Only present in the love_island room. */
  loveBoulder?: LoveBoulder;
}
