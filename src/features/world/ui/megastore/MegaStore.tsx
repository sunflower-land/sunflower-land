import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { getTimeLeft, secondsToString } from "lib/utils/time";

import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BuffLabel } from "features/game/types";
import { ItemDetail } from "./components/ItemDetail";
import { ItemsList } from "./components/ItemsList";
import { WearablesItem, CollectiblesItem } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

import lightning from "assets/icons/lightning.png";
import shopIcon from "assets/icons/shop.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ModalOverlay } from "components/ui/ModalOverlay";
import classNames from "classnames";
import { getCurrentSeason, SEASONS } from "features/game/types/seasons";
import { getKeys } from "features/game/types/decorations";

interface Props {
  onClose: () => void;
}

// type guard for WearablesItem | CollectiblesItem
export const isWearablesItem = (
  item: WearablesItem | CollectiblesItem,
): item is WearablesItem => {
  return (item as WearablesItem).name in ITEM_IDS;
};

export const getItemImage = (
  item: WearablesItem | CollectiblesItem | null,
): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.name]);
  }

  return ITEM_DETAILS[item.name].image;
};

export const getItemBuffLabel = (
  item: WearablesItem | CollectiblesItem | null,
): BuffLabel | undefined => {
  if (!item) return;

  if (isWearablesItem(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.name];
  }

  return COLLECTIBLE_BUFF_LABELS[item.name];
};

const _megastore = (state: MachineState) => state.context.state.megastore;

export const MegaStore: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      tabs={[
        { icon: shopIcon, name: t("monthly") },
        { icon: lightning, name: t("seasonal") },
      ]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <MegaStoreContent />}
      {tab === 1 && <MegaSeasonContent />}
    </CloseButtonPanel>
  );
};

export const MegaStoreContent: React.FC<{ readonly?: boolean }> = ({
  readonly,
}) => {
  const { gameService } = useContext(Context);
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
          items={megastore.wearables.filter((name) => name.megaItem === false)}
          onItemClick={handleClickItem}
        />
        {/* Collectibles */}
        <ItemsList
          itemsLabel={t("collectibles")}
          type="collectibles"
          items={megastore.collectibles.filter(
            (name) => name.megaItem === false,
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

export const MegaSeasonContent: React.FC<{ readonly?: boolean }> = ({
  readonly,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const megastore = useSelector(gameService, _megastore);
  const getTotalSecondsAvailableMega = () => {
    const { startDate, endDate } = SEASONS[getCurrentSeason()];

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
    megastore.available.from,
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
          megastore.collectibles.filter((name) => name.megaItem === true),
        ).length > 0 && (
          <ItemsList
            itemsLabel={t("mega.collectibles")}
            type="collectibles"
            items={megastore.collectibles.filter(
              (name) => name.megaItem === true,
            )}
            onItemClick={handleClickItem}
          />
        )}
        {getKeys(megastore.wearables.filter((name) => name.megaItem === true))
          .length > 0 && (
          <ItemsList
            itemsLabel={t("mega.wearables")}
            type="wearables"
            items={megastore.wearables.filter((name) => name.megaItem === true)}
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
          buff={getItemBuffLabel(selectedItem)}
          isWearable={selectedItem ? isWearablesItem(selectedItem) : false}
          onClose={() => setSelectedItem(null)}
          readonly={readonly}
        />
      </ModalOverlay>
    </div>
  );
};
