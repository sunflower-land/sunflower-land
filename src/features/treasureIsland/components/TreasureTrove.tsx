import React, { useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getEntries } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import {
  BOOST_TREASURE,
  isBoostTreasure,
  isBeachBountyTreasure,
  isDecorationTreasure,
  TreasureName,
  SEASONAL_REWARDS,
  Treasure,
  REWARDS,
} from "features/game/types/treasure";
import { NPC } from "features/island/bumpkin/components/NPC";
import { Equipped } from "features/game/types/bumpkin";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

enum RarityOrder {
  "rare",
  "good",
  "average",
}

const TREASURE_TROVE_ITEMS = (
  getEntries(REWARDS()) as [TreasureName, Treasure][]
)
  // Sort by name first
  .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
  // Then sort by rarity
  .sort(
    ([, treasureA], [, treasureB]) =>
      RarityOrder[treasureA.type] - RarityOrder[treasureB.type]
  );

const getTreasurePurpose = (treasureName: TreasureName) => {
  if (isBoostTreasure(treasureName))
    return <span className="text-[12px]">{BOOST_TREASURE[treasureName]}</span>;
  if (isBeachBountyTreasure(treasureName))
    return <span className="text-[12px]">{translate("beach.bounty")}</span>;
  if (isDecorationTreasure(treasureName))
    return <span className="text-[12px]">{translate("decoration")}</span>;
};

const TreasureTroveItem: React.FC<{
  treasureName: TreasureName;
  rarity: "good" | "average" | "rare";
}> = ({ treasureName, rarity }) => (
  <div key={treasureName} className="flex">
    <div className="justify-center items-center flex mr-2">
      <img
        src={ITEM_DETAILS[treasureName].image}
        className="w-9 h-9 object-contain"
      />
    </div>
    <div className="flex flex-col w-full justify-center">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm leading-3">{treasureName}</span>
          {getTreasurePurpose(treasureName)}
        </div>
        <div className="flex items-center">
          {rarity === "rare" && <Label type="warning">{"Rare"}</Label>}
          {rarity === "good" && <Label type="success">{"Uncommon"}</Label>}
          {rarity === "average" && <Label type="default">{"Common"}</Label>}
        </div>
      </div>
    </div>
  </div>
);

const bumpkin: Equipped = {
  body: "Pirate Potion",
  hair: "White Long Hair",
  hat: "Pirate Hat",
  shirt: "Fancy Top",
  pants: "Pirate Pants",
  tool: "Pirate Scimitar",
  background: "Seashore Background",
  shoes: "Black Farmer Boots",
};

const TreasureTroveModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  // Refresh the countdown timer on the time limited treasure
  useUiRefresher();

  const SEASONAL_ITEMS = (
    getEntries(SEASONAL_REWARDS().rewards) as [TreasureName, Treasure][]
  )
    .filter(([name]) => {
      const item = SEASONAL_REWARDS().rewards[name];
      if (!item) return false;

      return (
        Date.now() > SEASONAL_REWARDS().startDate &&
        Date.now() < SEASONAL_REWARDS().endDate
      );
    })
    // Sort by name first
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    // Then sort by rarity
    .sort(
      ([, treasureA], [, treasureB]) =>
        RarityOrder[treasureA.type] - RarityOrder[treasureB.type]
    );

  const secondsLeftInSeason = (SEASONAL_REWARDS().endDate - Date.now()) / 1000;

  return (
    <CloseButtonPanel
      onClose={() => onClose()}
      title={"Treasure Trove"}
      bumpkinParts={bumpkin}
    >
      <div
        className="flex flex-col p-2 overflow-y-auto scrollable overflow-x-hidden divide-y-2 divide-dashed divide-brown-600"
        style={{ maxHeight: 400 }}
      >
        {secondsLeftInSeason > 0 && (
          <div className="pb-2">
            <div className="flex flex-wrap gap-y-1 items-start justify-between pb-2">
              <div>
                <p className="pb-0.5">{translate("seasonal.treasure")}</p>
                <p className="text-xs">{translate("season.limitedOffer")}</p>
              </div>
              <CountdownLabel timeLeft={secondsLeftInSeason} endText="left" />
            </div>

            <div className="pt-2 space-y-3">
              {SEASONAL_ITEMS.map(([name, treasure]) => (
                <TreasureTroveItem
                  key={name}
                  treasureName={name}
                  rarity={treasure.type}
                />
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 space-y-3">
          <p className="text-xs">{t("available.all.year")}</p>

          {TREASURE_TROVE_ITEMS.map(([name, treasure]) => (
            <TreasureTroveItem
              key={name}
              treasureName={name}
              rarity={treasure.type}
            />
          ))}
        </div>
      </div>
    </CloseButtonPanel>
  );
};

export const TreasureTrove: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <MapPlacement x={-5} y={1} height={1} width={1}>
      <NPC onClick={() => setShowModal(true)} parts={bumpkin} />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <TreasureTroveModal onClose={() => setShowModal(false)} />
      </Modal>
    </MapPlacement>
  );
};
