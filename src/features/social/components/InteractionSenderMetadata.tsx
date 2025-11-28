import { useNow } from "lib/utils/hooks/useNow";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { getRelativeTime } from "lib/utils/time";
import React from "react";

export const InteractionSenderMetadata: React.FC<{
  sender: string;
  createdAt: number;
}> = ({ sender, createdAt }) => {
  useUiRefresher();
  const now = useNow();
  return (
    <div className="text-xxs">{`${sender} - ${getRelativeTime(createdAt, now)}`}</div>
  );
};
