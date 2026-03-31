import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import { MinigameShopListBody } from "./MinigameShopListBody";

type Props = {
  items: MinigameShopItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  highlightedId?: string | null;
  onItemClick: (item: MinigameShopItemUi) => void;
};

export const MinigameShopPanel: React.FC<Props> = ({
  items,
  balances,
  tokenImages,
  highlightedId,
  onItemClick,
}) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
      <div className="shrink-0">
        <Label type="default">{t("minigame.dashboard.shop")}</Label>
      </div>
      <MinigameShopListBody
        items={items}
        balances={balances}
        tokenImages={tokenImages}
        highlightedId={highlightedId}
        onItemClick={onItemClick}
      />
    </InnerPanel>
  );
};
