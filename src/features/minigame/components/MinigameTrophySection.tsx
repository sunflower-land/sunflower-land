import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const MinigameTrophySection: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
      <Label type="default" className="mb-2">
        {t("minigame.dashboard.trophy.title")}
      </Label>
      <p className="text-xs leading-relaxed whitespace-pre-line text-[#3e2731]">
        {t("minigame.dashboard.trophy.body")}
      </p>
    </InnerPanel>
  );
};
