import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import React from "react";

export const LastUpdatedAt: React.FC<{ lastUpdated: number | undefined }> = ({
  lastUpdated,
}) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });

  if (!lastUpdated) return <>{`${t("last.updated")} ...`}</>;

  return <>{`${t("last.updated")} ${getRelativeTime(lastUpdated, now)}`}</>;
};
