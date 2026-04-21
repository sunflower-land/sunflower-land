import React, { useMemo, useState } from "react";
import Decimal from "decimal.js-light";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Loading } from "features/auth/components";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Tradeable } from "features/game/types/marketplace";
import { MinigamesLeaderboard } from "features/marketplace/components/MinigamesLeaderboard";
import { resolveMarketplaceMinigameItemImage } from "features/marketplace/lib/resolveMinigameMarketplaceImage";
import { MINIGAME_TOKEN_IMAGE_FALLBACK } from "features/minigame/lib/minigameTokenIcons";

type Row = Tradeable & { collection: "economies" };

type Props = {
  items: Row[];
  isLoading: boolean;
};

/**
 * Sort helper — mirrors MinigamesLeaderboard so the top-3 we surface on
 * the hub is consistent with the full list.
 */
const sortByVolumeThenFloor = (a: Row, b: Row) => {
  const volA = a.volume ?? 0;
  const volB = b.volume ?? 0;
  if (volB !== volA) return volB - volA;
  if (a.floor === b.floor) return a.id - b.id;
  if (a.floor === 0) return 1;
  if (b.floor === 0) return -1;
  return a.floor - b.floor;
};

/**
 * Left-column mini leaderboard of the top-3 ranked tradeable items by
 * price/volume. "View more" opens a modal containing the full marketplace
 * minigame leaderboard.
 */
export const TopTradeablesWidget: React.FC<Props> = ({ items, isLoading }) => {
  const { t } = useAppTranslation();
  const [showMore, setShowMore] = useState(false);

  const topThree = useMemo(
    () => [...items].sort(sortByVolumeThenFloor).slice(0, 3),
    [items],
  );

  return (
    <>
      <InnerPanel className="mb-2">
        <div className="flex items-center justify-between mb-2 flex-wrap">
          <Label type="default">{t("economyHub.topTradeables")}</Label>
        </div>

        {isLoading ? (
          <div className="p-1">
            <Loading />
          </div>
        ) : topThree.length === 0 ? (
          <p className="text-xs p-1">{t("economyHub.topTradeablesEmpty")}</p>
        ) : (
          <div className="flex flex-col gap-1">
            {topThree.map((item, index) => (
              <div
                key={`${item.economy}-${item.id}`}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-4 text-brown-700">{`#${index + 1}`}</span>
                <img
                  src={resolveMarketplaceMinigameItemImage(
                    item.image,
                    item.currencyName,
                  )}
                  alt=""
                  className="h-6 w-6 object-contain"
                  style={{ imageRendering: "pixelated" }}
                  onError={(e) => {
                    e.currentTarget.src = MINIGAME_TOKEN_IMAGE_FALLBACK;
                  }}
                />
                <span className="flex-1 truncate">{item.economyLabel}</span>
                <span className="tabular-nums">
                  {new Decimal(item.floor).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {topThree.length > 0 && (
          <p
            className="text-xxs underline my-1 mx-1 cursor-pointer"
            onClick={() => setShowMore(true)}
          >
            {t("economyHub.viewMore")}
          </p>
        )}
      </InnerPanel>

      <Modal show={showMore} onHide={() => setShowMore(false)} size="lg">
        <CloseButtonPanel onClose={() => setShowMore(false)}>
          <div className="p-1 h-[70vh] flex flex-col">
            <p className="text-sm mb-2 px-1">
              {t("economyHub.topTradeablesModalTitle")}
            </p>
            <div className="flex-1 min-h-0">
              <MinigamesLeaderboard
                items={items}
                onNavigated={() => setShowMore(false)}
                panelClassName="h-full max-h-full"
              />
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
