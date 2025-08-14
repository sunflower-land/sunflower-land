import React, { useState } from "react";
import { CollectibleProps } from "../Collectible";
import {
  isPetNeglected,
  msTillNeglect,
  PetName,
  PetResource,
  PETS,
} from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { useGame } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  DEFAULT_PET_CRAVINGS,
  getPetRequest,
  getPetRestLeft,
  isPetResting,
} from "features/game/events/landExpansion/feedPet";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DEFAULT_PET_TOY } from "features/game/events/landExpansion/wakeUpPet";
import lightningIcon from "assets/icons/lightning.png";
import lockIcon from "assets/icons/lock.png";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useVisiting } from "lib/utils/visitUtils";

export const PetModal: React.FC<{
  onClose: () => void;
  name: PetName;
  showGuide: boolean;
}> = ({ onClose, name, showGuide }) => {
  const { gameState, gameService } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);

  const { t } = useAppTranslation();
  const { isVisiting } = useVisiting();

  const petConfig = PETS[name];

  const [resource, setResource] = useState<PetResource>(
    petConfig.fetches[0].name,
  );

  const pet = gameState.context.state.pets?.[name];
  const request = getPetRequest({ pet, game: gameState.context.state });

  const itemAmount =
    gameState.context.state.inventory[request] ?? new Decimal(0);

  const fetch = () => {
    gameService.send({
      type: "pet.fed",
      name,
      resource,
    });
  };

  const restLeft = getPetRestLeft({
    pet: gameState.context.state.pets?.[name],
    game: gameState.context.state,
  });
  const isResting = isPetResting({
    pet: gameState.context.state.pets?.[name],
    game: gameState.context.state,
  });

  const nextRequests = pet?.cravings ?? DEFAULT_PET_CRAVINGS.slice(1);
  const onWakeUp = () => {
    gameService.send("pet.wakeUp", {
      name,
    });
    onClose();
  };

  const isNeglected = isPetNeglected({
    pet: gameState.context.state.pets?.[name],
    game: gameState.context.state,
  });

  // If is visiting
  if (isVisiting) {
    return (
      <InnerPanel>
        <Label type="default">{t("coming.soon")}</Label>
      </InnerPanel>
    );
  }

  if (isNeglected) {
    return (
      <>
        <InnerPanel className="mb-1">
          <Label type="danger" className="mb-2">
            {t("pets.neglected")}
          </Label>
          <p className="text-sm">
            {`Oh no, you neglected your pet. You have lost 1 lvl.`}
          </p>
        </InnerPanel>
        <Button onClick={() => gameService.send("pet.neglected", { name })}>
          {t("continue")}
        </Button>
      </>
    );
  }

  if (showGuide) {
    return (
      <>
        <InnerPanel className="mb-1">
          <NoticeboardItems
            items={[
              {
                text: "Pets when fed can gather different resources",
                icon: SUNNYSIDE.icons.heart,
              },
              {
                text: "The stronger the pet, the more perks you unlock",
                icon: lightningIcon,
              },
              {
                text: "Pets can be neglected if they are not fed for a while",
                icon: SUNNYSIDE.icons.sad,
              },
            ]}
          />
        </InnerPanel>
        <InnerPanel>
          <div className="flex items-center justify-between">
            <Label type="default" className="mb-1">
              {t("perks")}
            </Label>
            <Label icon={lightningIcon} type="default" className="mb-1">
              {`Lvl ${pet?.level ?? 1}`}
            </Label>
          </div>
          <p className="text-sm">{`Lvl 3 - Unlock bonus resource`}</p>
          <p className="text-sm">{`Lvl 5 - Unlock Fossil Shell`}</p>
          <p className="text-sm">{`Lvl 10 - 10% faster`}</p>
          <p className="text-sm">{`Lvl 20 - 10% chance of double resource`}</p>
          <p className="text-sm">{`Lvl 50 - 20% faster`}</p>
          <p className="text-sm">{`Lvl 100 - 20% chance of double resource`}</p>
        </InnerPanel>
      </>
    );
  }

  if (showConfirm) {
    return (
      <InnerPanel>
        <Label type="danger">{t("confirmTitle")}</Label>
        <p className="text-xs m-1">
          {t("sleepingAnimal.confirmMessage", {
            name: DEFAULT_PET_TOY,
            animal: name,
          })}
        </p>

        <div className="flex">
          <Button onClick={() => setShowConfirm(false)} className="mr-1">
            {t("sleepingAnimal.cancel")}
          </Button>
          <Button onClick={onWakeUp}>{t("sleepingAnimal.confirm")}</Button>
        </div>
      </InnerPanel>
    );
  }

  const level = pet?.level ?? 1;

  if (isResting) {
    const dollCount =
      gameState.context.state.inventory[DEFAULT_PET_TOY] ?? new Decimal(0);
    return (
      <>
        <InnerPanel className="mb-1">
          <div className="flex items-center justify-between mb-2">
            <Label type="default">{t("pets.sleeping")}</Label>
            <Label
              type="chill"
              icon={lightningIcon}
            >{`Lvl ${pet?.level ?? 1}`}</Label>
          </div>

          <p className="text-sm p-1">
            {secondsToString(restLeft / 1000, { length: "medium" })}
          </p>
        </InnerPanel>
        <InnerPanel className="mb-1">
          <Label type="default" className="mb-2">
            {t("pets.nextRequests")}
          </Label>
          {nextRequests.map((request) => (
            <div key={request} className="flex items-center">
              <Box image={ITEM_DETAILS[request].image} className="mr-2" />
              <div>
                <p className="text-sm">{`1 x ${request}`}</p>
              </div>
            </div>
          ))}
        </InnerPanel>
        <InnerPanel className="mb-1">
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.heart} alt="Sleep" className="h-6 mr-2" />
            <p className="text-xs">
              {t("sleepingAnimal.sheepLoveToPlay", { name })}
            </p>
          </div>

          <div className="flex items-center mt-1">
            <Box
              image={ITEM_DETAILS[DEFAULT_PET_TOY].image}
              count={dollCount}
            />
            <div className="ml-1">
              <p className="text-sm">
                {t("sleepingAnimal.dollCount", { name: DEFAULT_PET_TOY })}
              </p>
              <p className="text-xs italic">
                {t("sleepingAnimal.availableAtCraftingBox")}
              </p>
            </div>
          </div>
        </InnerPanel>

        <Button disabled={dollCount.lt(1)} onClick={() => setShowConfirm(true)}>
          {t("sleepingAnimal.wakeUp")}
        </Button>
      </>
    );
  }

  const multiplier = pet?.multiplier ?? 1;
  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between">
          <Label type="default">{name}</Label>
          <Label
            type="chill"
            icon={lightningIcon}
          >{`Lvl ${pet?.level ?? 1}`}</Label>
        </div>
        <p className="text-sm p-1">{t("pets.description")}</p>
        <div className="flex items-center">
          <Box
            image={ITEM_DETAILS[request].image}
            count={itemAmount}
            className="mr-2"
          />
          <div>
            <p className="text-sm">{`1 x ${request}`}</p>
            {pet?.readyAt && (
              <div className="flex items-center">
                <img
                  src={SUNNYSIDE.icons.stopwatch}
                  alt="Sleep"
                  className="h-6 mr-2"
                />
                <p>
                  {secondsToString(
                    msTillNeglect({ pet, now: Date.now() }) / 1000,
                    { length: "medium" },
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between">
          <Label type="default">{t("fetch")}</Label>
          {multiplier > 1 && (
            <Label type="vibrant" icon={lightningIcon}>
              {`x${multiplier}`}
            </Label>
          )}
        </div>

        <div className="flex flex-col">
          {petConfig.fetches.map((fetch) => {
            const level = pet?.level ?? 1;
            const isLocked = level < fetch.level;

            return (
              <div key={fetch.name} className="flex items-center">
                <Box
                  key={fetch.name}
                  isSelected={resource === fetch.name}
                  onClick={() => setResource(fetch.name)}
                  image={ITEM_DETAILS[fetch.name].image}
                  className="mr-2"
                  disabled={isLocked}
                  secondaryImage={isLocked ? lockIcon : undefined}
                />
                <div>
                  <p className="text-sm">{fetch.name}</p>
                  {isLocked ? (
                    <Label type="transparent">{`Lvl ${fetch.level} required`}</Label>
                  ) : (
                    <p className="text-xs">
                      {ITEM_DETAILS[fetch.name].description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </InnerPanel>
      <div className="relative">
        {!itemAmount.gte(1) && (
          <Label type="danger" className="absolute -top-3 right-0 z-10">
            {`Missing ${request}`}
          </Label>
        )}

        <Button onClick={fetch} disabled={!itemAmount.gte(1) || !request}>
          {t("fetch")}
        </Button>
      </div>
    </>
  );
};

export const Pet: React.FC<CollectibleProps> = ({ name }) => {
  const { gameState } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState(0);

  const pet = gameState.context.state.pets?.[name as PetName];
  const request = getPetRequest({ pet, game: gameState.context.state });

  const isSleeping = isPetResting({
    pet: gameState.context.state.pets?.[name as PetName],
    game: gameState.context.state,
  });

  const isNeglected = isPetNeglected({
    pet: gameState.context.state.pets?.[name as PetName],
    game: gameState.context.state,
  });

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              name: "Fetch",
              icon: SUNNYSIDE.icons.expression_confused,
            },
            {
              name: "Guide",
              icon: SUNNYSIDE.icons.expression_confused,
            },
          ]}
          container={OuterPanel}
        >
          <PetModal
            onClose={() => setShowModal(false)}
            name={name as PetName}
            showGuide={tab === 1}
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

        {isSleeping ? (
          <img
            src={SUNNYSIDE.icons.sleeping}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * -2}px`,
              top: `${PIXEL_SCALE * -2}px`,
            }}
          />
        ) : isNeglected ? (
          <img
            src={SUNNYSIDE.icons.sad}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * -2}px`,
              top: `${PIXEL_SCALE * -2}px`,
            }}
          />
        ) : (
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
              src={ITEM_DETAILS[request]?.image}
            />
          </div>
        )}
      </div>
    </>
  );
};
