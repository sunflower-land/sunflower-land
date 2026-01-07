import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { FISH, MarineMarvelName } from "features/game/types/fishing";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import mapIcon from "assets/icons/map.webp";

interface Props {
  maps: Partial<Record<MarineMarvelName, number>>;
  farmActivity: GameState["farmActivity"];
  caught: Partial<Record<InventoryItemName, number>>;
  onClaim: () => void;
  multiplier?: number;
  difficultCatch: {
    name: InventoryItemName | MarineMarvelName;
    amount: number;
    difficulty: number;
  }[];
}

export const FishCaught: React.FC<Props> = ({
  farmActivity,
  caught,
  maps,
  onClaim,
  multiplier = 1,
}) => {
  const { t } = useAppTranslation();

  const [showMapPieces, setShowMapPieces] = useState(false);
  const isMultiCast = (multiplier ?? 1) > 1;
  const caughtEntries = getKeys(caught).filter(
    (name) => (caught[name] ?? 0) > 0,
  );

  const useListLayout = isMultiCast || caughtEntries.length > 1;

  const mapPieces = getKeys(maps);

  const claim = () => {
    // If there are map pieces, show the map pieces modal
    if (mapPieces.length > 0) {
      setShowMapPieces(true);
    } else {
      onClaim();
    }
  };

  if (showMapPieces) {
    return (
      <>
        <div className="p-1">
          <div className="flex flex-col ">
            <Label type="vibrant" className="mb-2">
              {t("fishing.mapDiscovered.title")}
            </Label>
            <p className="text-xs mb-2">{t("fishing.mapDiscovered.message")}</p>
            {mapPieces.map((map) => {
              const collected =
                (farmActivity[`${map} Map Piece Found`] ?? 0) +
                (maps[map] ?? 0);

              return (
                <div className="flex items-center" key={map}>
                  <Box
                    image={mapIcon}
                    count={new Decimal(maps[map] ?? 0)}
                    secondaryImage={ITEM_DETAILS[map].image}
                  />
                  <div className="ml-1">
                    <p className="text-sm">
                      {t("fishing.mapDiscovered.mapName", { map })}
                    </p>
                    <p className="text-xs">
                      {t("fishing.mapDiscovered.progress", {
                        collected,
                        total: 9,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Button onClick={onClaim}>{t("ok")}</Button>
      </>
    );
  }

  if (useListLayout) {
    return (
      <>
        <div className="p-1">
          {caughtEntries.length > 0 && (
            <>
              <Label
                type="default"
                className="mb-2"
                icon={SUNNYSIDE.tools.fishing_rod}
              >
                {t("fishing.yourCatch")}
              </Label>
              <div className="flex flex-col gap-1 -py-1">
                {caughtEntries.map((name) => {
                  const amount = caught[name] ?? 0;
                  const isNew =
                    name in FISH &&
                    (!farmActivity[`${name} Caught`] ||
                      farmActivity[`${name} Caught`] === 0);

                  return (
                    <InnerPanel
                      key={name}
                      className="flex items-center justify-between -mx-1"
                    >
                      <div className="flex items-center p-1 space-x-1 w-full">
                        <img
                          src={ITEM_DETAILS[name]?.image}
                          className="h-6"
                          alt={name}
                        />
                        <div className="flex justify-between items-center w-full pr-1">
                          <span className="text-xs">{name}</span>
                          <div className="flex items-center gap-1">
                            {isNew && (
                              <Label
                                type="warning"
                                className="text-[10px] px-1 py-0.5"
                                icon={SUNNYSIDE.icons.search}
                              >
                                {t("new")}
                              </Label>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap">{`x ${amount}`}</span>
                    </InnerPanel>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <Button onClick={claim}>{t("ok")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        {caughtEntries.map((name) => {
          const isNew =
            name in FISH &&
            (!farmActivity[`${name} Caught`] ||
              farmActivity[`${name} Caught`] === 0);

          return (
            <div
              className="flex flex-col justify-center items-center"
              key={name}
            >
              {isNew && (
                // TODO - use codex icon
                <Label type="warning" icon={SUNNYSIDE.icons.search}>
                  {t("fishermanQuest.Newfish")}
                </Label>
              )}
              <span className="text-sm mb-2">{name}</span>
              <img src={ITEM_DETAILS[name]?.image} className="h-12 mb-2" />
              <span className="text-xs text-center mb-2">
                {ITEM_DETAILS[name].description}
              </span>
            </div>
          );
        })}
      </div>
      <Button onClick={claim}>{t("ok")}</Button>
    </>
  );
};
