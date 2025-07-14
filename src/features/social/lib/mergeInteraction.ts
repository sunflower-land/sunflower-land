import { Player } from "../types/types";

type SocialRoomUpdate = {
  current: Player;
  farmId: number;
  update: any;
};

export const mergeInteraction = ({
  current,
  farmId,
  update,
}: SocialRoomUpdate) => {
  if (update.type === "chat") {
    return {
      data: {
        ...current.data,
        messages: [update, ...(current?.data?.messages ?? [])],
      },
    };
  }

  if (update.type === "follow") {
    //  old mate data is updated followed by [spencer]
    return {
      data: {
        ...current.data,
        followedBy: update.followedBy,
        followedByCount: update.followedByCount,
      },
    };
  }

  return current;
};
