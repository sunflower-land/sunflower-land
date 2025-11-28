import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import React from "react";

export const InteractionSenderMetadata: React.FC<{
  sender: string;
  createdAt: number;
}> = ({ sender, createdAt }) => {
  const now = useNow({ live: true });
  return (
    <div className="text-xxs">{`${sender} - ${getRelativeTime(createdAt, now)}`}</div>
  );
};
