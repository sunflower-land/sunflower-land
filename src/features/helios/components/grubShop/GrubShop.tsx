import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import stall from "assets/buildings/grub_shop.png";
import goblinChef from "assets/npcs/goblin_chef.gif";
import shadow from "assets/npcs/shadow.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { GrubShopModal } from "./components/GrubShopModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { ConsumableName } from "features/game/types/consumables";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { setImageWidth } from "lib/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { DeliveryModal } from "features/island/delivery/Delivery";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

export const GrubShop: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showModal, setShowModal] = React.useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const ordersFulfilled = state.grubOrdersFulfilled ?? [];
  let lastFulfilledItemName: ConsumableName | undefined;
  if (ordersFulfilled.length > 0) {
    lastFulfilledItemName = state.grubShop?.orders.find(
      (order) => order.id === ordersFulfilled[ordersFulfilled.length - 1].id
    )?.name;
  }

  const showDeliveries = Date.now() > new Date("2023-05-31").getTime();

  return (
    <>
      <Modal centered show={showModal} onHide={closeModal}>
        {showDeliveries ? (
          <DeliveryModal isOpen={showModal} onClose={closeModal} />
        ) : (
          <GrubShopModal onClose={closeModal} />
        )}
      </Modal>

      <MapPlacement x={2} y={1} height={5} width={5}>
        <div className="relative w-full h-full">
          {showDeliveries ? (
            <>
              <div
                className="flex absolute z-10"
                style={{
                  left: `${GRID_WIDTH_PX * 0}px`,
                  bottom: `${GRID_WIDTH_PX * 1.5}px`,
                }}
              >
                {state.delivery.orders
                  .filter((o) => o.readyAt < Date.now())
                  .slice(0, 1)
                  .map((order) => (
                    <div
                      key={order.id}
                      className="mr-2"
                      style={{
                        width: `${PIXEL_SCALE * 16}px`,
                      }}
                    >
                      <NPC parts={NPC_WEARABLES[order.from]} />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <>
              <img
                src={shadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 15}px`,
                  left: `${PIXEL_SCALE * 52}px`,
                  bottom: `${PIXEL_SCALE * 0}px`,
                }}
              />
              <img
                src={SUNNYSIDE.npcs.goblin}
                className="absolute z-10"
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                  left: `${PIXEL_SCALE * 51}px`,
                  bottom: `${PIXEL_SCALE * 2}px`,
                  transform: "scaleX(-1)",
                }}
              />

              <img
                src={shadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 15}px`,
                  left: `${PIXEL_SCALE * 5.5}px`,
                  bottom: `${PIXEL_SCALE * 2}px`,
                }}
              />
              <img
                src={SUNNYSIDE.npcs.goblin}
                className="absolute z-10"
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                  bottom: `${PIXEL_SCALE * 4}px`,
                }}
              />
            </>
          )}

          <img
            src={stall}
            style={{
              width: `${PIXEL_SCALE * 59}px`,
              bottom: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 0}px`,
            }}
            alt="bakery"
            className="absolute"
          />

          <img
            src={shadow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              left: `${PIXEL_SCALE * 60}px`,
              bottom: `${PIXEL_SCALE * 30}px`,
            }}
          />
          <img
            src={goblinChef}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              left: `${PIXEL_SCALE * 59}px`,
              bottom: `${PIXEL_SCALE * 32}px`,
              transform: "scaleX(-1)",
            }}
          />

          {lastFulfilledItemName && (
            <img
              src={ITEM_DETAILS[lastFulfilledItemName].image}
              className="absolute"
              onLoad={(e) => {
                const img = e.currentTarget;
                if (
                  !img ||
                  !img.complete ||
                  !img.naturalWidth ||
                  !img.naturalHeight
                ) {
                  return;
                }

                const left = Math.floor((76 - img.naturalWidth) / 2);
                const bottom = Math.floor((50 - img.naturalHeight) / 2);
                img.style.left = `${PIXEL_SCALE * left}px`;
                img.style.bottom = `${PIXEL_SCALE * bottom}px`;
                setImageWidth(img);
              }}
              style={{
                opacity: 0,
              }}
            />
          )}
        </div>
      </MapPlacement>
    </>
  );
};
