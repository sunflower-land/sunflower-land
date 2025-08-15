import React, { useState } from "react";
import { CollectibleProps } from "../Collectible";
import {
  getPetLevel,
  isPetNeglected,
  PET_RESOURCES,
  petLevelProgress,
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
import { getPetCravings } from "features/game/events/landExpansion/feedPet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import lightningIcon from "assets/icons/lightning.png";
import lockIcon from "assets/icons/lock.png";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useVisiting } from "lib/utils/visitUtils";
import { AnimatedBar } from "components/ui/ProgressBar";
import { canPetPet } from "features/game/events/landExpansion/petPet";
import { InventoryItemName } from "features/game/types/game";

const DEFAULT_PET_TOY: InventoryItemName = "Doll";

const Fetch: React.FC<{
  onClose: () => void;
  name: PetName;
  tab: number;
}> = ({ onClose, name, tab }) => {
  const { gameState, gameService } = useGame();

  const { t } = useAppTranslation();

  const petConfig = PETS[name];

  const [resource, setResource] = useState<PetResource>(
    petConfig.fetches[0].name,
  );

  const pet = gameState.context.state.pets?.[name];

  const fetch = () => {
    gameService.send({
      type: "pet.fetched",
      name,
      resource,
    });
  };

  const level = getPetLevel(pet);

  const { xpLeft, xpPercentage } = petLevelProgress(pet);

  const multiplier = pet?.multiplier ?? 1;

  const hasEnergy = (pet?.energy ?? 0) >= PET_RESOURCES[resource].energy;

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between">
          <Label type="default">{t("fetch")}</Label>

          {multiplier > 1 && (
            <Label type="vibrant" icon={lightningIcon}>
              {`x${multiplier}`}
            </Label>
          )}
          <div className="flex items-center">
            <Label type="transparent" className="ml-1">
              {`Lvl ${level}`}
            </Label>
            <AnimatedBar
              key={level}
              percentage={xpPercentage}
              type="progress"
            />
            <div className="flex items-center ml-1">
              <img src={lightningIcon} className="h-4 mr-1" />
              <p className="text-xs">{`${pet?.energy ?? 0}`}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          {petConfig.fetches.map((fetch) => {
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
                <div className="w-full">
                  <div className="flex items-center">
                    <p className="text-sm mr-2">{fetch.name}</p>

                    <div className="flex items-center ">
                      <img src={lightningIcon} className="h-4 mr-1" />
                      <p className="text-xs">{`${PET_RESOURCES[fetch.name].energy}`}</p>
                    </div>
                  </div>

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
        <Button onClick={fetch} disabled={!hasEnergy}>
          {t("fetch")}
        </Button>
      </div>
    </>
  );
};

const Feed: React.FC<{
  onClose: () => void;
  name: PetName;
  tab: number;
}> = ({ onClose, name, tab }) => {
  const { gameState, gameService } = useGame();

  const { t } = useAppTranslation();

  const petConfig = PETS[name];

  const pet = gameState.context.state.pets?.[name];

  const requests = getPetCravings({ pet, game: gameState.context.state });
  const [foodIndex, setFoodIndex] = useState<number>(0);

  const food = requests[foodIndex];

  const fetch = () => {
    gameService.send({
      type: "pet.fed",
      name,
      food: food.name,
    });
  };

  const level = getPetLevel(pet);

  const { xpLeft, xpPercentage } = petLevelProgress(pet);

  const multiplier = pet?.multiplier ?? 1;

  const itemAmount =
    gameState.context.state.inventory[food.name] ?? new Decimal(0);

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between">
          <Label type="default">{name}</Label>
          <div className="flex items-center">
            <Label type="transparent" className="ml-1">
              {`Lvl ${level}`}
            </Label>
            <AnimatedBar
              key={level}
              percentage={xpPercentage}
              type="progress"
            />
            <div className="flex items-center ml-1">
              <img src={lightningIcon} className="h-4 mr-1" />
              <p className="text-xs">{`${pet?.energy ?? 0}`}</p>
            </div>
          </div>
        </div>
        <p className="text-sm p-1">{t("pets.description")}</p>
        {requests.map((request, index) => (
          <div className="flex items-center" key={request.name}>
            <Box
              image={ITEM_DETAILS[request.name].image}
              count={gameState.context.state.inventory[request.name]}
              className="mr-2"
              isSelected={foodIndex === index}
              onClick={() => setFoodIndex(index)}
              secondaryImage={
                request.completedAt ? SUNNYSIDE.icons.confirm : undefined
              }
              disabled={!!request.completedAt}
            />
            <div>
              <p className="text-sm">{`${request.name}`}</p>

              <div className="flex items-center">
                <p className="text-xs">{`+100`}</p>
                <img src={lightningIcon} className="h-4 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </InnerPanel>

      <div className="relative">
        {!itemAmount.gte(1) && (
          <Label type="danger" className="absolute -top-3 right-0 z-10">
            {`Missing ${food.name}`}
          </Label>
        )}

        <Button
          onClick={fetch}
          disabled={!itemAmount.gte(1) || !!food.completedAt}
        >
          {`Feed`}
        </Button>
      </div>
    </>
  );
};

const Guide: React.FC<{
  onClose: () => void;
  name: PetName;
  tab: number;
}> = ({ onClose, name, tab }) => {
  const { gameState, gameService } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);

  const { t } = useAppTranslation();

  const petConfig = PETS[name];

  const pet = gameState.context.state.pets?.[name];
  const level = getPetLevel(pet);

  const { xpLeft, xpPercentage } = petLevelProgress(pet);

  const onWakeUp = () => {
    gameService.send("pet.wakeUp", {
      effect: {
        type: "pet.wakeUp",
        name,
      },
    });

    onClose();
  };

  if (showConfirm) {
    return (
      <InnerPanel>
        <Label type="danger">{t("confirmTitle")}</Label>
        <p className="text-xs m-1">
          {`Are you sure you want to give a Doll to give more requests?`}
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
      <InnerPanel className="mb-1">
        <div className="flex items-center justify-between">
          <Label type="default" className="mb-1">
            {t("perks")}
          </Label>

          <div className="flex">
            <AnimatedBar
              key={level}
              percentage={xpPercentage}
              type="progress"
            />
            <Label type="transparent" className="mb-1">
              {`Lvl ${level}`}
            </Label>
          </div>
        </div>
        <p className="text-sm">{`Lvl up to unlock more resources`}</p>
        <p className="text-sm">{`Lvl 10 - 10% faster`}</p>
        <p className="text-sm">{`Lvl 20 - 10% chance of double resource`}</p>
        <p className="text-sm">{`Lvl 50 - 20% faster`}</p>
        <p className="text-sm">{`Lvl 100 - 20% chance of double resource`}</p>
      </InnerPanel>
      <InnerPanel>
        <Label type="default" className="mb-1">
          {`New Requests`}
        </Label>
        <p className="text-sm mb-1">{`Each day, new requests will appear.`}</p>
        <Button
          disabled={
            !(gameState.context.state.inventory.Doll ?? new Decimal(0)).gte(1)
          }
          onClick={() => setShowConfirm(true)}
        >{`Reset requests`}</Button>
      </InnerPanel>
    </>
  );
};

const PetAction: React.FC<{ name: PetName }> = ({ name }) => {
  const { gameState } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState(0);

  const pet = gameState.context.state.pets?.[name as PetName];

  const isNeglected = isPetNeglected({
    pet: gameState.context.state.pets?.[name as PetName],
    game: gameState.context.state,
  });

  const isLonely = canPetPet({
    pet: gameState.context.state.pets?.[name as PetName],
    game: gameState.context.state,
  });

  if (isNeglected) {
    return (
      <img
        src={SUNNYSIDE.icons.sad}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * -2}px`,
          top: `${PIXEL_SCALE * -2}px`,
        }}
      />
    );
  }

  if (isLonely) {
    return (
      <img
        src={SUNNYSIDE.icons.sleeping}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * -2}px`,
          top: `${PIXEL_SCALE * -2}px`,
        }}
      />
    );
  }

  return null;
};

export const PetModal: React.FC<{
  name: PetName;
  tab: number;
  onClose: () => void;
}> = ({ name, tab, onClose }) => {
  const { isVisiting } = useVisiting();
  const { t } = useAppTranslation();
  const { gameService, gameState } = useGame();

  const pet = gameState.context.state.pets?.[name as PetName];
  const isNeglected = isPetNeglected({
    pet,
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
            {`Oh no, you neglected your pet. You have 500 XP`}
          </p>
        </InnerPanel>
        <Button onClick={() => gameService.send("pet.neglected", { name })}>
          {t("continue")}
        </Button>
      </>
    );
  }

  if (tab === 0) {
    return <Feed onClose={onClose} name={name as PetName} tab={tab} />;
  }

  if (tab === 1) {
    return <Fetch onClose={onClose} name={name as PetName} tab={tab} />;
  }

  if (tab === 2) {
    return <Guide onClose={onClose} name={name as PetName} tab={tab} />;
  }

  return null;
};

export const Pet: React.FC<CollectibleProps> = ({ name }) => {
  const { gameState, gameService } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState(0);
  const [showPetted, setShowPetted] = useState(false);

  const onClick = () => {
    if (
      isPetNeglected({
        pet: gameState.context.state.pets?.[name as PetName],
        game: gameState.context.state,
      })
    ) {
      setShowModal(true);
      return;
    }

    if (
      canPetPet({
        pet: gameState.context.state.pets?.[name as PetName],
        game: gameState.context.state,
      })
    ) {
      gameService.send("pet.petted", { name });

      setShowPetted(true);

      setTimeout(() => {
        setShowPetted(false);
      }, 1000);

      return;
    }

    setShowModal(true);
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              name: "Feed",
              icon: SUNNYSIDE.icons.expression_confused,
            },
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
            name={name as PetName}
            tab={tab}
            onClose={() => setShowModal(false)}
          />
        </CloseButtonPanel>
      </Modal>
      <div
        className="absolute"
        style={{
          left: `${PIXEL_SCALE * -1}px`,
          top: `${PIXEL_SCALE * -5}px`,
          width: `${PIXEL_SCALE * 20}px`,
        }}
      >
        <img
          src={ITEM_DETAILS[name].image}
          className="absolute w-full cursor-pointer hover:img-highlight"
          alt={name}
          onClick={onClick}
        />

        <PetAction name={name as PetName} />

        {!!showPetted && (
          <div
            className="flex justify-center absolute w-full z-40"
            style={{
              width: `${PIXEL_SCALE * 48}px`,
              left: `${PIXEL_SCALE * -16}px`,
              top: `${PIXEL_SCALE * -12}px`,
              transition: "opacity 0.2s ease-in",
            }}
          >
            <span className="yield-text text-white font-pixel">{`+10XP`}</span>
          </div>
        )}
      </div>
    </>
  );
};
