import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { WearablesItem, CollectiblesItem } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTimeLeft, secondsToString } from "lib/utils/time";
import React, { useState, useEffect, useContext } from "react";
import { ItemDetail } from "./components/ItemDetail";
import { ItemsList } from "./components/ItemsList";
import { getItemImage, getItemBuffLabel, isWearablesItem } from "./MegaStore";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import lightning from "assets/icons/lightning.png";

export const MegaStoreMonthly: React.FC<{
  readonly?: boolean;
}> = ({ readonly }) => {
  const { gameService } = useContext(Context);
  const _megastore = (state: MachineState) => state.context.state.megastore;
  const megastore = useSelector(gameService, _megastore);
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

  const getTotalSecondsAvailable = () => {
    const { from, to } = megastore.available;

    return (to - from) / 1000;
  };

  const timeRemaining = getTimeLeft(
    megastore.available.from,
    getTotalSecondsAvailable(),
  );

  const { t } = useAppTranslation();
  return (
    <div className="relative h-full w-full">
      <div className="flex justify-between px-2 flex-wrap pb-1">
        <Label type="vibrant" icon={lightning} className="mb-1">
          {t("megaStore.month.sale")}
        </Label>
        <Label icon={SUNNYSIDE.icons.stopwatch} type="danger" className="mb-1">
          {t("megaStore.timeRemaining", {
            timeRemaining: secondsToString(timeRemaining, {
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
          {readonly ? t("megaStore.visit") : t("megaStore.message")}
        </span>
        {/* Wearables */}
        <ItemsList
          itemsLabel={t("wearables")}
          type="wearables"
          items={megastore.wearables.filter(
            (name) => name.availableAllSeason === false,
          )}
          onItemClick={handleClickItem}
        />
        {/* Collectibles */}
        <ItemsList
          itemsLabel={t("collectibles")}
          type="collectibles"
          items={megastore.collectibles.filter(
            (name) => name.availableAllSeason === false,
          )}
          onItemClick={handleClickItem}
        />
      </div>

      <ModalOverlay
        show={!!selectedItem}
        onBackdropClick={() => setSelectedItem(null)}
      >
        <ItemDetail
          isVisible={isVisible}
          item={selectedItem}
          image={getItemImage(selectedItem)}
          buff={getItemBuffLabel(selectedItem)}
          isWearable={selectedItem ? isWearablesItem(selectedItem) : false}
          onClose={() => setSelectedItem(null)}
          readonly={readonly}
        />
      </ModalOverlay>
    </div>
  );
};
