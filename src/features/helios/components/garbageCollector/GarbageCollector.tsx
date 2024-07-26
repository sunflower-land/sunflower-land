import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "components/ui/Modal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/NPC";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { GarbageCollectorModal } from "./components/GarbageCollectorModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";

export const GarbageCollector: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useAppTranslation();

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <MapPlacement x={-6} y={-9} height={3} width={4}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={handleClick}
        >
          <img
            src={SUNNYSIDE.building.garbage}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 62}px`,
              left: `${PIXEL_SCALE * 9}px`,
              bottom: `${PIXEL_SCALE * 20}px`,
            }}
          />
          <img
            src={SUNNYSIDE.building.garbage_stall}
            className="absolute z-20"
            style={{
              width: `${PIXEL_SCALE * 36}px`,
              left: `${PIXEL_SCALE * 22}px`,
              bottom: `${PIXEL_SCALE * 6}px`,
            }}
          />

          <div
            className="absolute z-10"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              left: `${PIXEL_SCALE * 32}px`,
              bottom: `${PIXEL_SCALE * 41}px`,
            }}
          >
            <NPC
              parts={{
                body: "Goblin Potion",
                hair: "Teal Mohawk",
                shirt: "Fire Shirt",
              }}
            />
          </div>
        </div>
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          onClose={() => setIsOpen(false)}
          container={OuterPanel}
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Teal Mohawk",
            pants: "Farmer Pants",
            shirt: "Fire Shirt",
            tool: "Bumpkin Puppet",
          }}
          tabs={[
            {
              icon: ITEM_DETAILS["Solar Flare Ticket"].image,
              name: t("sell"),
            },
          ]}
        >
          <GarbageCollectorModal />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
