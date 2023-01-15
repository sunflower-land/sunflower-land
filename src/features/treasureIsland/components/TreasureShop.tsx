import React, { useState } from "react";

import goblin from "assets/npcs/shovel_seller.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { TreasureShopBuy as TreasureShopItems } from "./TreasureShopBuy";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TreasureShopSell } from "./TreasureShopSell";
import { SUNNYSIDE } from "assets/sunnyside";

export const TreasureShop: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState(0);

  return (
    <MapPlacement x={-5} y={-2} height={1} width={1}>
      <img
        src={shadow}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          bottom: `0px`,
          left: `0px`,
        }}
      />
      <div className="w-max h-full relative">
        <img
          src={goblin}
          className="relative cursor-pointer hover:img-highlight"
          id="shovel-shop"
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * -3}px`,
          }}
          onClick={() => setShowModal(true)}
        />
      </div>

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Teal Mohawk",
            shirt: "Red Farmer Shirt",
            pants: "Farmer Pants",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.tools.sand_shovel,
              name: "Buy",
            },
            {
              icon: SUNNYSIDE.resource.starfish,
              name: "Sell",
            },
          ]}
        >
          {tab === 0 && (
            <TreasureShopItems onClose={() => setShowModal(false)} />
          )}
          {tab === 1 && <TreasureShopSell />}
        </CloseButtonPanel>
      </Modal>
    </MapPlacement>
  );
};
