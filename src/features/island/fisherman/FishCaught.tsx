import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";
import { Button } from "components/ui/Button";
import { Label, LABEL_STYLES } from "components/ui/Label";
import { getKeys } from "lib/object";
import { FISH, type MarineMarvelName } from "features/game/types/fishing";
import type {
  BoostName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import React, { useRef, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import mapIcon from "assets/icons/map.webp";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";

const CatchBoost: React.FC<{
  shrimpBonus: number;
  otterBonus: number;
  state: GameState;
}> = ({ shrimpBonus, otterBonus, state }) => {
  const { t } = useAppTranslation();
  const [showBoosts, setShowBoosts] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const boosts: { name: BoostName; value: string }[] = [
    ...(shrimpBonus > 0
      ? [{ name: "Shrimp Onesie" as const, value: `+${shrimpBonus}` }]
      : []),
    ...(otterBonus > 0
      ? [{ name: "Otty the Otter" as const, value: `+${otterBonus}` }]
      : []),
  ];

  if (!boosts.length) return null;

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className="flex shrink-0 items-center gap-0.5 px-1 text-xs whitespace-nowrap cursor-pointer"
        style={{
          ...LABEL_STYLES.vibrant.borderStyle,
          background: LABEL_STYLES.vibrant.background,
          color: LABEL_STYLES.vibrant.textColour,
        }}
        aria-label={`${t("faction.boostsApplied")} +${shrimpBonus + otterBonus}`}
        aria-expanded={showBoosts}
        onClick={() => setShowBoosts((show) => !show)}
      >
        <img src={lightning} alt="" className="w-3" />
        <span>{`+${shrimpBonus + otterBonus}`}</span>
      </button>
      <BoostsDisplay
        boosts={boosts}
        show={showBoosts}
        state={state}
        onClick={() => setShowBoosts(false)}
        anchorRef={anchorRef}
        portalAlign="center"
      />
    </>
  );
};

interface Props {
  maps: Partial<Record<MarineMarvelName, number>>;
  farmActivity: GameState["farmActivity"];
  caught: Partial<Record<InventoryItemName, number>>;
  shrimpOnesieBonus?: Partial<Record<InventoryItemName, number>>;
  ottyBonus?: Partial<Record<InventoryItemName, number>>;
  onClaim: () => void;
  multiplier?: number;
  difficultCatch: {
    name: InventoryItemName | MarineMarvelName;
    amount: number;
    difficulty: number;
  }[];
  state: GameState;
}

export const FishCaught: React.FC<Props> = ({
  farmActivity,
  caught,
  shrimpOnesieBonus,
  ottyBonus,
  maps,
  onClaim,
  multiplier = 1,
  difficultCatch,
  state,
}) => {
  const { t } = useAppTranslation();

  const [showMapPieces, setShowMapPieces] = useState(false);
  const isMultiCast = (multiplier ?? 1) > 1;
  const caughtEntries = getKeys(caught).filter(
    (name) => (caught[name] ?? 0) > 0,
  );
  const missedFish = difficultCatch.filter((fish) => !caught[fish.name]);

  const useListLayout =
    isMultiCast || caughtEntries.length > 1 || missedFish.length > 0;

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

  if (!caughtEntries.length && !missedFish.length) {
    return (
      <>
        <div className="p-2">
          <div className="relative h-14">
            <img
              src={SUNNYSIDE.icons.sad}
              className="w-10 my-2 absolute -top-[12%] left-1/2 -translate-x-1/2"
            />
          </div>
          <p className="text-sm mb-2 text-center">{t("fishermanQuest.Ohno")}</p>
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
                  const shrimpBonus = shrimpOnesieBonus?.[name] ?? 0;
                  const otterBonus = ottyBonus?.[name] ?? 0;

                  return (
                    <InnerPanel
                      key={name}
                      className="flex items-center justify-between -mx-1"
                    >
                      <div className="flex min-w-0 items-center p-1 space-x-1 flex-1">
                        <img
                          src={ITEM_DETAILS[name]?.image}
                          className="h-6 shrink-0"
                          alt={getTranslatedItemName(name)}
                        />
                        <div className="flex min-w-0 justify-between items-center flex-1 pr-1 gap-1">
                          <span className="text-xs truncate">
                            {getTranslatedItemName(name)}
                          </span>
                          <div className="flex shrink-0 items-center gap-1">
                            <CatchBoost
                              shrimpBonus={shrimpBonus}
                              otterBonus={otterBonus}
                              state={state}
                            />
                            {isNew && (
                              <Label
                                type="warning"
                                icon={SUNNYSIDE.icons.search}
                              >
                                {t("new")}
                              </Label>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap shrink-0">{`x ${amount}`}</span>
                    </InnerPanel>
                  );
                })}
              </div>
            </>
          )}

          {missedFish.length > 0 && (
            <div className="mt-2 space-y-1">
              <Label type="danger" className="mb-1" icon={SUNNYSIDE.icons.sad}>
                {t("fishing.missedFish")}
              </Label>
              <div className="flex flex-col gap-1 -py-1">
                {missedFish.map((fish) => {
                  return (
                    <InnerPanel
                      key={`missed-${fish.name}`}
                      className="flex items-center justify-between opacity-80 -mx-1"
                    >
                      <div className="flex items-center p-1 space-x-1 w-full">
                        <img
                          src={ITEM_DETAILS[fish.name]?.image}
                          className="h-6 grayscale"
                          alt={getTranslatedItemName(fish.name)}
                        />
                        <div className="flex justify-between items-center w-full pr-2">
                          <span className="text-xs">
                            {getTranslatedItemName(fish.name)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap">{`x ${fish.amount}`}</span>
                    </InnerPanel>
                  );
                })}
              </div>
            </div>
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
          const shrimpBonus = shrimpOnesieBonus?.[name] ?? 0;
          const otterBonus = ottyBonus?.[name] ?? 0;

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
              <span className="text-sm mb-2">
                {getTranslatedItemName(name)}
              </span>
              {(shrimpBonus > 0 || otterBonus > 0) && (
                <div className="mb-2">
                  <CatchBoost
                    shrimpBonus={shrimpBonus}
                    otterBonus={otterBonus}
                    state={state}
                  />
                </div>
              )}
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
