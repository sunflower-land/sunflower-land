import React, { useContext, useState } from "react";
import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import shopIcon from "assets/icons/shop.png";
import flipped from "assets/icons/flipped.webp";
import flipIcon from "assets/icons/flip.webp";
import cleanBroom from "assets/icons/clean_broom.webp";

import { isMobile } from "mobile-device-detect";

import {
  LandscapingPlaceable,
  MachineInterpreter,
  MachineState,
  placeEvent,
} from "features/game/expansion/placeable/landscapingMachine";
import { Label } from "components/ui/Label";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";
import { LandscapingChest } from "./components/LandscapingChest";
import { getChestItems } from "./components/inventory/utils/inventory";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getRemoveAction,
  getSelectedCollectible,
  isCollectible,
} from "../collectibles/MovableComponent";
import { RemoveKuebikoModal } from "../collectibles/RemoveKuebikoModal";
import { PlaceableLocation } from "features/game/types/collectibles";
import { HudContainer } from "components/ui/HudContainer";
import { RemoveHungryCaterpillarModal } from "../collectibles/RemoveHungryCaterpillarModal";
import { useSound } from "lib/utils/hooks/useSound";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RoundButton } from "components/ui/RoundButton";
import { CraftDecorationsModal } from "./components/decorations/CraftDecorationsModal";
import { RemoveAllConfirmation } from "../collectibles/RemoveAllConfirmation";
import { NFTName } from "features/game/events/landExpansion/placeNFT";
import { useNow } from "lib/utils/hooks/useNow";
import { PET_SHRINES } from "features/game/types/pets";
import { isPetCollectible } from "features/game/events/landExpansion/placeCollectible";
import { hasFeatureAccess } from "lib/flags";

const compareBalance = (prev: Decimal, next: Decimal) => {
  return prev.eq(next);
};

const compareCoins = (prev: number, next: number) => {
  return prev === next;
};

const compareBlockBucks = (prev: Decimal, next: Decimal) => {
  const previous = prev ?? new Decimal(0);
  const current = next ?? new Decimal(0);
  return previous.eq(current);
};

const selectMovingItem = (state: MachineState) => state.context.moving;
const isIdle = (state: MachineState) => state.matches({ editing: "idle" });

const LandscapingHudComponent: React.FC<{ location: PlaceableLocation }> = ({
  location,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showRemoveAllConfirmation, setShowRemoveAllConfirmation] =
    useState(false);
  const [showDecorations, setShowDecorations] = useState(false);
  const button = useSound("button");

  const child = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const balance = useSelector(
    gameService,
    (state) => state.context.state.balance,
    compareBalance,
  );

  const coins = useSelector(
    gameService,
    (state) => state.context.state.coins,
    compareCoins,
  );

  const gems = useSelector(
    gameService,
    (state) => state.context.state.inventory["Gem"] ?? new Decimal(0),
    compareBlockBucks,
  );

  const selectedItem = useSelector(child, selectMovingItem);
  const idle = useSelector(child, isIdle);
  const gameState = useSelector(gameService, (state) => state.context.state);
  const hasFarmHandPlacement = hasFeatureAccess(gameState, "PLACE_FARM_HAND");
  const farmHandIds = hasFarmHandPlacement
    ? getKeys(gameState.farmHands.bumpkins)
    : [];

  const isShrine =
    selectedItem?.name &&
    (selectedItem.name in PET_SHRINES ||
      selectedItem.name === "Obsidian Shrine");

  const now = useNow({ live: isShrine });
  const selectedCollectible = useSelector(
    gameService,
    getSelectedCollectible(selectedItem?.name, selectedItem?.id, location),
  );

  const removeAction = getRemoveAction(
    selectedItem?.name,
    now,
    selectedCollectible,
  );

  const showRemove = isMobile && selectedItem && removeAction;

  const showFlip = isMobile && selectedItem && isCollectible(selectedItem.name);

  const remove = () => {
    const action = selectedItem && removeAction;

    if (!action) {
      return;
    }

    if (showRemoveConfirmation) {
      child.send({
        type: "REMOVE",
        event: action,
        id: selectedItem?.id,
        name: selectedItem?.name,
        location,
      });
      setShowRemoveConfirmation(false);
    } else {
      setShowRemoveConfirmation(true);
    }
  };

  const removeAll = () => {
    if (showRemoveAllConfirmation) {
      child.send({ type: "REMOVE_ALL", event: "items.removed", location });
      setShowRemoveAllConfirmation(false);
    } else {
      setShowRemoveAllConfirmation(true);
    }
  };

  const flip = () => {
    if (selectedItem && isCollectible(selectedItem.name)) {
      child.send({
        type: "FLIP",
        id: selectedItem.id,
        name: selectedItem.name,
        location,
      });
    }
  };

  const isFlipped = useSelector(gameService, (state) => {
    if (!selectedItem || !isCollectible(selectedItem.name)) return false;
    const name = selectedItem.name;
    const collectibles =
      location === "home"
        ? state.context.state.home.collectibles[name]
        : location === "petHouse" && isPetCollectible(name)
          ? state.context.state.petHouse.pets[name]
          : state.context.state.collectibles[name];
    return (
      collectibles?.find((collectible) => collectible.id === selectedItem.id)
        ?.flipped ?? false
    );
  });

  return (
    <HudContainer>
      <div className="absolute right-0 top-0 p-2.5">
        <Balances sfl={balance} coins={coins} gems={gems ?? new Decimal(0)} />
      </div>

      <>
        {idle && (
          <>
            <div
              className="absolute flex z-50 flex-col"
              style={{
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginBottom: `${PIXEL_SCALE * 25}px`,
                width: `${PIXEL_SCALE * 22}px`,
                right: `${PIXEL_SCALE * 3}px`,
                top: `${PIXEL_SCALE * 31}px`,
              }}
            >
              <RoundButton
                className="mb-3.5"
                onClick={() => {
                  button.play();
                  child.send({ type: "CANCEL" });
                }}
              >
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="absolute group-active:translate-y-[2px]"
                  style={{
                    top: `${PIXEL_SCALE * 5.5}px`,
                    left: `${PIXEL_SCALE * 5.5}px`,
                    width: `${PIXEL_SCALE * 11}px`,
                  }}
                />
              </RoundButton>
              <RoundButton className="mb-3.5" onClick={removeAll}>
                <img
                  src={cleanBroom}
                  className="absolute group-active:translate-y-[2px]"
                  style={{
                    top: `${PIXEL_SCALE * 5}px`,
                    left: `${PIXEL_SCALE * 5}px`,
                    width: `${PIXEL_SCALE * 13}px`,
                  }}
                />
              </RoundButton>

              {location === "farm" && (
                <>
                  <RoundButton
                    className="mb-3.5"
                    onClick={() => setShowDecorations(true)}
                  >
                    <img
                      src={shopIcon}
                      className="absolute group-active:translate-y-[2px]"
                      style={{
                        top: `${PIXEL_SCALE * 2}px`,
                        left: `${PIXEL_SCALE * 3.7}px`,
                        width: `${PIXEL_SCALE * 14}px`,
                      }}
                    />
                  </RoundButton>
                  <CraftDecorationsModal
                    show={showDecorations}
                    onHide={() => setShowDecorations(false)}
                  />
                </>
              )}

              <Chest
                location={location}
                onPlaceChestItem={(selected) => {
                  child.send("SELECT", {
                    action: placeEvent(selected),
                    placeable: { name: selected },
                    multiple: true,
                  });
                }}
                onPlaceNFT={(id, nft) => {
                  child.send("SELECT", {
                    action: "nft.placed",
                    placeable: { id, name: nft },
                    location,
                  });
                }}
                onPlaceFarmHand={
                  farmHandIds.length > 0
                    ? (id) => {
                        button.play();
                        child.send("SELECT", {
                          placeable: { name: "FarmHand", id },
                          action: "farmHand.placed",
                          requirements: { coins: 0, ingredients: {} },
                        });
                      }
                    : undefined
                }
              />

              {/* {farmHandIds.length > 0 && (
                <>
                  {farmHandIds.map((id) => (
                    <RoundButton
                      key={id}
                      className="mb-3.5"
                      onClick={() => {
                        button.play();
                        child.send("SELECT", {
                          placeable: { name: "FarmHand", id },
                          action: "farmHand.placed",
                          requirements: { coins: 0, ingredients: {} },
                        });
                      }}
                    >
                      <img
                        src={SUNNYSIDE.achievement.farmHand}
                        className="absolute group-active:translate-y-[2px]"
                        style={{
                          top: `${PIXEL_SCALE * 3}px`,
                          left: `${PIXEL_SCALE * 3}px`,
                          width: `${PIXEL_SCALE * 16}px`,
                        }}
                      />
                    </RoundButton>
                  ))}
                </>
              )} */}
            </div>
          </>
        )}
      </>

      {showFlip && (
        <div
          className="absolute flex z-50 flex-col"
          style={{
            marginRight: `${PIXEL_SCALE * 2}px`,
            width: `${PIXEL_SCALE * 22}px`,
            left: `${PIXEL_SCALE * 3.5}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
          }}
          onClick={flip}
        >
          <div
            className="absolute"
            style={{
              bottom: `${PIXEL_SCALE * 24}px`,
              left: `${PIXEL_SCALE * 2.5}px`,
            }}
          >
            <Label type="default">{t("flip.mobile.label")}</Label>
          </div>
          <img className="w-full" src={SUNNYSIDE.icons.disc} />
          {isFlipped ? (
            <img
              className="absolute"
              src={flipped}
              style={{
                width: `${PIXEL_SCALE * 14}px`,
                right: `${PIXEL_SCALE * 4}px`,
                top: `${PIXEL_SCALE * 4.5}px`,
              }}
            />
          ) : (
            <img
              className="absolute"
              src={flipIcon}
              style={{
                width: `${PIXEL_SCALE * 15}px`,
                right: `${PIXEL_SCALE * 3.5}px`,
                top: `${PIXEL_SCALE * 4.5}px`,
              }}
            />
          )}
        </div>
      )}

      {showRemoveConfirmation && selectedItem?.name === "Kuebiko" && (
        <RemoveKuebikoModal
          onClose={() => setShowRemoveConfirmation(false)}
          onRemove={() => remove()}
        />
      )}
      {showRemoveConfirmation &&
        selectedItem?.name === "Hungry Caterpillar" && (
          <RemoveHungryCaterpillarModal
            onClose={() => setShowRemoveConfirmation(false)}
            onRemove={() => remove()}
          />
        )}
      {showRemoveAllConfirmation && (
        <RemoveAllConfirmation
          onClose={() => setShowRemoveAllConfirmation(false)}
          onRemove={() => removeAll()}
          location={location}
        />
      )}
      {showRemove && (
        <div
          className="absolute flex z-50 flex-col"
          style={{
            marginLeft: `${PIXEL_SCALE * 2}px`,
            width: `${PIXEL_SCALE * 22}px`,
            right: `${PIXEL_SCALE * 3}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        >
          <div
            className="absolute"
            style={{
              bottom: `${PIXEL_SCALE * 23}px`,
              right: `${PIXEL_SCALE * -2}px`,
            }}
          >
            <Label type="danger">{t("remove")}</Label>
          </div>

          <RoundButton onClick={remove}>
            {showRemoveConfirmation ? (
              <img
                className="absolute group-active:translate-y-[2px]"
                src={SUNNYSIDE.icons.confirm}
                style={{
                  width: `${PIXEL_SCALE * 12}px`,
                  right: `${PIXEL_SCALE * 4.5}px`,
                  top: `${PIXEL_SCALE * 5}px`,
                }}
              />
            ) : (
              <>
                <img
                  className="absolute group-active:translate-y-[2px]"
                  src={ITEM_DETAILS["Rusty Shovel"].image}
                  style={{
                    width: `${PIXEL_SCALE * 14}px`,
                    right: `${PIXEL_SCALE * 4.5}px`,
                    top: `${PIXEL_SCALE * 4.5}px`,
                  }}
                />
              </>
            )}
          </RoundButton>
        </div>
      )}

      <PlaceableController location={location} />
    </HudContainer>
  );
};

const Chest: React.FC<{
  location: PlaceableLocation;
  onPlaceChestItem: (item: LandscapingPlaceable) => void;
  onPlaceNFT: (id: string, nft: NFTName) => void;
  onPlaceFarmHand?: (id: string) => void;
}> = ({ location, onPlaceChestItem, onPlaceNFT, onPlaceFarmHand }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showChest, setShowChest] = useState(false);
  const chestItems = getChestItems(gameState.context.state);

  return (
    <>
      <RoundButton className="mb-4" onClick={() => setShowChest(true)}>
        <img
          src={chest}
          className="absolute group-active:translate-y-[2px]"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <Label
          type="default"
          className="text-xxs absolute -top-1.5 -right-0.5 group-active:translate-y-[2px]"
          style={{ padding: "0 2.5", height: "24px" }}
        >
          {getKeys(chestItems).reduce(
            (acc, key) => acc + (chestItems[key]?.toNumber() ?? 0),
            0,
          )}
        </Label>
      </RoundButton>

      <LandscapingChest
        state={gameState.context.state}
        onHide={() => setShowChest(false)}
        show={showChest}
        onPlace={onPlaceChestItem}
        onPlaceNFT={onPlaceNFT}
        onPlaceFarmHand={onPlaceFarmHand}
        location={location}
      />
    </>
  );
};

export const LandscapingHud = React.memo(LandscapingHudComponent);
