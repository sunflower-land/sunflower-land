import React from "react";

import useSWR from "swr";
import { useAuth } from "features/auth/lib/Provider";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getDiscordRoadmapDataCached } from "../actions/discordRoadmap";

export const DiscordRoadmap: React.FC = () => {
  const { authState } = useAuth();
  const { t } = useAppTranslation();

  const { data, isLoading, error } = useSWR(
    ["/data?type=discordRoadmap", authState.context.user.rawToken],
    () =>
      getDiscordRoadmapDataCached({
        token: authState.context.user.rawToken as string,
      }),
    {
      dedupingInterval: 10 * 60 * 1000,
    },
  );

  if (isLoading) return <Loading />;

  if (error || !data) return <p className="text-xs p-1">{t("error")}</p>;

  const items = data;

  if (items.length === 0) {
    return <p className="text-xs p-1">{t("roadmap.empty")}</p>;
  }

  return (
    <div className="max-h-[450px] overflow-y-auto scrollable pr-0.5">
      {items.map((item) => (
        <div key={item.id} className="mb-4">
          <div className="flex items-baseline justify-between gap-2 px-1">
            <p className="text-sm">{item.name}</p>
            {item.date && (
              <span className="text-xxs whitespace-nowrap">{item.date}</span>
            )}
          </div>
          {item.description && (
            <p className="text-xs mt-1 mb-2 px-1">{item.description}</p>
          )}
          {item.image && (
            <img
              src={item.image}
              className="w-full rounded-sm"
              alt={item.name}
            />
          )}
        </div>
      ))}
      <p className="text-xxs italic px-1 mt-2 mb-1">
        {t("roadmap.disclaimer")}
      </p>
    </div>
  );
};
