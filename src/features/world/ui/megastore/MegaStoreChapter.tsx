import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { getTimeLeft, secondsToString } from "lib/utils/time";

import { ItemDetail } from "./components/ItemDetail";
import { ItemsList } from "./components/ItemsList";
import { WearablesItem, CollectiblesItem } from "features/game/types/game";

import lightning from "assets/icons/lightning.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";
import classNames from "classnames";
import { getCurrentSeason, CHAPTERS } from "features/game/types/chapters";
import { getKeys } from "features/game/types/decorations";
import {
  getItemImage,
  getItemBuffLabel,
  isWearablesItem,
  _megastore,
} from "./MegaStore";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

export const MegaStoreSeasonal: React.FC<{
  readonly?: boolean;
}> = ({ readonly }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const megastore = useSelector(gameService, _megastore);
  const getTotalSecondsAvailableMega = () => {
    const { startDate, endDate } = CHAPTERS[getCurrentSeason()];

    return (endDate.getTime() - startDate.getTime()) / 1000;
  };
  const [selectedItem, setSelectedItem] = useState<
    WearablesItem | CollectiblesItem | null
  >(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedItem && !isVisible) {
      setIsVisible(true);
    }
  }, [selectedItem, isVisible]);

  const handleClickItem = (item: WearablesItem | CollectiblesItem) => {
    setSelectedItem(item);
  };

  const megaTimeRemaining = getTimeLeft(
    CHAPTERS[getCurrentSeason()].startDate.getTime(),
    getTotalSecondsAvailableMega(),
  );

  return (
    <div className="relative h-full w-full">
      <div className="flex justify-between px-2 flex-wrap pb-1">
        <Label type="vibrant" icon={lightning} className="mb-1">
          {t("available.all.season")}
        </Label>
        <Label icon={SUNNYSIDE.icons.stopwatch} type="danger" className="mb-1">
          {t("megaStore.timeRemaining", {
            timeRemaining: secondsToString(megaTimeRemaining, {
              length: "medium",
              removeTrailingZeros: true,
            }),
          })}
        </Label>
      </div>
      <div
        className={classNames("flex flex-col p-2 pt-1 space-y-3 ", {
          ["max-h-[300px] overflow-y-auto scrollable "]: !readonly,
        })}
      >
        <span className="text-xs pb-2">
          {readonly ? t("megaStore.visit") : t("megastore.message.allSeason")}
        </span>
        {getKeys(
          megastore.collectibles.filter(
            (name) => name.availableAllSeason === true,
          ),
        ).length > 0 && (
          <ItemsList
            itemsLabel={t("mega.collectibles")}
            type="collectibles"
            items={megastore.collectibles.filter(
              (name) =>
                name.availableAllSeason === true && name.type === "collectible",
            )}
            onItemClick={handleClickItem}
          />
        )}
        {getKeys(
          megastore.wearables.filter(
            (name) => name.availableAllSeason === true,
          ),
        ).length > 0 && (
          <ItemsList
            itemsLabel={t("mega.wearables")}
            type="wearables"
            items={megastore.wearables.filter(
              (name) => name.availableAllSeason === true,
            )}
            onItemClick={handleClickItem}
          />
        )}
        {getKeys(
          megastore.collectibles.filter(
            (name) => name.availableAllSeason === true,
          ),
        ).length > 0 && (
          <ItemsList
            itemsLabel={t("keys")}
            type="keys"
            items={megastore.collectibles.filter(
              (name) =>
                name.availableAllSeason === true && name.type === "keys",
            )}
            onItemClick={handleClickItem}
          />
        )}
      </div>

      <ModalOverlay
        show={!!selectedItem}
        onBackdropClick={() => setSelectedItem(null)}
      >
        <ItemDetail
          isVisible={isVisible}
          item={selectedItem}
          image={getItemImage(selectedItem)}
          buff={getItemBuffLabel(selectedItem, state)}
          isWearable={selectedItem ? isWearablesItem(selectedItem) : false}
          onClose={() => setSelectedItem(null)}
          readonly={readonly}
        />
      </ModalOverlay>
    </div>
  );
};
