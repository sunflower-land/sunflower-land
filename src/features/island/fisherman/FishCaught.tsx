import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { FISH, MarineMarvelName } from "features/game/types/fishing";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";

interface Props {
  farmActivity: GameState["farmActivity"];
  caught: Partial<Record<InventoryItemName, number>>;
  onClaim: () => void;
  multiplier?: number;
  difficultCatch?: {
    name: InventoryItemName | MarineMarvelName;
    amount: number;
    difficulty: number;
  }[];
  missedCatch?: Partial<Record<InventoryItemName, number>>;
}

export const FishCaught: React.FC<Props> = ({
  farmActivity,
  caught,
  onClaim,
  multiplier = 1,
  missedCatch = {},
}) => {
  const { t } = useAppTranslation();
  const isMultiCast = (multiplier ?? 1) > 1;
  const caughtEntries = getKeys(caught).filter(
    (name) => (caught[name] ?? 0) > 0,
  );
  const missedEntries = getKeys(missedCatch).filter(
    (name) => (missedCatch?.[name] ?? 0) > 0,
  );

  const useListLayout =
    isMultiCast || caughtEntries.length > 1 || missedEntries.length > 0;

  if (!caughtEntries.length && !missedEntries.length) {
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

          {missedEntries.length > 0 && (
            <div className="mt-2 space-y-1">
              <Label type="danger" className="mb-1">
                {t("fishing.missedFish")}
              </Label>
              <div className="flex flex-col gap-1 -py-1">
                {missedEntries.map((name) => {
                  const amount = missedCatch[name] ?? 0;

                  return (
                    <InnerPanel
                      key={`missed-${name}`}
                      className="flex items-center justify-between opacity-80 -mx-1"
                    >
                      <div className="flex items-center p-1 space-x-1 w-full">
                        <img
                          src={ITEM_DETAILS[name]?.image}
                          className="h-6 grayscale"
                          alt={name}
                        />
                        <div className="flex justify-between items-center w-full pr-2">
                          <span className="text-xs">{name}</span>
                        </div>
                      </div>
                      <span className="text-sm whitespace-nowrap">{`x ${amount}`}</span>
                    </InnerPanel>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <Button onClick={onClaim}>{t("ok")}</Button>
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
      <Button onClick={onClaim}>{t("ok")}</Button>
    </>
  );
};
