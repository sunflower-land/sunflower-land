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
    messages: Interaction[];
  };
};

export type FollowUpdate = Partial<NonNullable<Player["data"]>>;
