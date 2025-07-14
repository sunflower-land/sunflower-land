import React from "react";
import { useTranslation } from "react-i18next";
import { useSocial } from "../hooks/useSocial";

export const Followers = ({
  farmId,
  followers,
}: {
  farmId: number;
  followers: number[];
}) => {
  const { online } = useSocial({
    farmId,
    following: followers,
  });
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
