import React, { useState } from "react";
import { CollectibleProps } from "../Collectible";
import { PetName, PetResource, PETS } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { useGame } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { DEFAULT_PET_FOOD } from "features/game/events/landExpansion/feedPet";

export const PetModal: React.FC<{ onClose: () => void; name: PetName }> = ({
  onClose,
  name,
}) => {
  const { gameState, gameService } = useGame();

  const petConfig = PETS[name];

  const [resource, setResource] = useState<PetResource>(petConfig.fetches[0]);
  const request: InventoryItemName =
    gameState.context.state.pets?.[name]?.craves ?? DEFAULT_PET_FOOD;

  const itemAmount =
    gameState.context.state.inventory[request] ?? new Decimal(0);

  const fetch = () => {
    gameService.send({
      type: "pet.fed",
      name,
      resource,
    });
  };

  return (
    <>
      <InnerPanel className="mb-1">
        <Label type="default">Woof!</Label>
        <p className="text-sm p-1">
          Pets are loyal animals (when fed) that will fetch items for you.
        </p>
        <div className="flex items-center">
          <Box image={ITEM_DETAILS[request].image} count={itemAmount} />
          <div>
            <p className="text-sm">{`1 x ${request}`}</p>
            <p className="text-xs">{`? XP`}</p>
          </div>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <Label type="default">Fetch</Label>

        <div className="flex flex-col">
          {petConfig.fetches.map((fetch) => (
            <div className="flex items-center">
              <Box
                key={fetch}
                isSelected={resource === fetch}
                onClick={() => setResource(fetch)}
                image={ITEM_DETAILS[fetch].image}
                className="mr-2"
              />
              <div>
                <p className="text-sm">{fetch}</p>
                <p className="text-xs">{ITEM_DETAILS[fetch].description}</p>
              </div>
            </div>
          ))}
        </div>
      </InnerPanel>
      <Button onClick={fetch}>Fetch</Button>
    </>
  );
};

export const Pet: React.FC<CollectibleProps> = ({ name }) => {
  const [showModal, setShowModal] = useState(false);
  const request: InventoryItemName = "Pumpkin";

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel container={OuterPanel}>
          <PetModal
            onClose={() => setShowModal(false)}
            name={name as PetName}
          />
        </CloseButtonPanel>
      </Modal>
      <div
        className="absolute"
        style={{ left: `${PIXEL_SCALE * 4}px`, width: `${PIXEL_SCALE * 22}px` }}
      >
        <img
          src={ITEM_DETAILS[name].image}
          className="absolute w-full cursor-pointer hover:img-highlight"
          alt={name}
          onClick={() => setShowModal(true)}
        />

        <div
          className={`absolute inline-flex justify-center items-center z-10 pointer-events-none`}
          style={{
            left: `${PIXEL_SCALE * -10}px`,
            top: `${PIXEL_SCALE * -2}px`,
            borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
            borderStyle: "solid",
            borderTopWidth: `${PIXEL_SCALE * 2}px`,
            borderRightWidth: `${PIXEL_SCALE * 2}px`,
            borderBottomWidth: `${PIXEL_SCALE * 4}px`,
            borderLeftWidth: `${PIXEL_SCALE * 5}px`,
            borderImageSlice: "2 2 4 5 fill",
            imageRendering: "pixelated",
            borderImageRepeat: "stretch",
            // Flip it
            transform: "scaleX(-1)",
          }}
        >
          <img
            style={{
              width: `${PIXEL_SCALE * 6}px`,
            }}
            src={ITEM_DETAILS[request].image}
          />
        </div>
      </div>
    </>
  );
};
