import React, { useState } from "react";

import beachBountyShop from "assets/buildings/treasure_shop.png";

import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { TreasureShopBuy } from "./TreasureShopBuy";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TreasureShopSell } from "./TreasureShopSell";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TreasureShop: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  return (
    <MapPlacement x={-5} y={-3} height={4} width={4}>
      <div className="w-max h-full relative group">
        <img
          src={beachBountyShop}
          className="relative cursor-pointer group-hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 69}px`,
            top: `${PIXEL_SCALE * 9.5}px`,
            left: `${PIXEL_SCALE * -6}px`,
          }}
          onClick={() => setShowModal(true)}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -15}px`,
          }}
        />
        <div
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            top: `${PIXEL_SCALE * 4.5}px`,
            left: `${PIXEL_SCALE * -3}px`,
          }}
        >
          <NPC
            parts={{
              body: "Pirate Potion",
              hair: "Teal Mohawk",
              pants: "Blue Suspenders",
              shirt: "Red Farmer Shirt",
            }}
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          bumpkinParts={{
            body: "Pirate Potion",
            hair: "Teal Mohawk",
            shirt: "Red Farmer Shirt",
            pants: "Farmer Pants",
            tool: "Sword",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.tools.sand_shovel,
              name: t("buy"),
            },
            {
              icon: SUNNYSIDE.resource.starfish,
              name: t("sell"),
            },
          ]}
        >
          {tab === 0 && <TreasureShopBuy onClose={() => setShowModal(false)} />}
          {tab === 1 && <TreasureShopSell />}
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
