import React, { useContext, useEffect, useState } from "react";
import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import shopIcon from "assets/icons/shop.png";

import { isMobile } from "mobile-device-detect";

import {
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
import { getRemoveAction } from "../collectibles/MovableComponent";
import { InventoryItemName } from "features/game/types/game";
import { RemoveKuebikoModal } from "../collectibles/RemoveKuebikoModal";
import { BudName } from "features/game/types/buds";
import { PlaceableLocation } from "features/game/types/collectibles";
import { HudContainer } from "components/ui/HudContainer";
import { RemoveHungryCaterpillarModal } from "../collectibles/RemoveHungryCaterpillarModal";
import { useSound } from "lib/utils/hooks/useSound";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RoundButton } from "components/ui/RoundButton";
import { CraftDecorationsModal } from "./components/decorations/CraftDecorationsModal";
import { hasFeatureAccess } from "lib/flags";
import { hasRemoveRestriction } from "features/game/types/removeables";
import { RemoveAllConfirmation } from "../collectibles/RemoveAllConfirmation";

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

  // TODO: Remove this once the feature flag is removed
  const hasLandscapingAccess = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "LANDSCAPING"),
  );

  const selectedItem = useSelector(child, selectMovingItem);
  const idle = useSelector(child, isIdle);

  const showRemove =
    isMobile &&
    selectedItem &&
    getRemoveAction(selectedItem.name, hasLandscapingAccess);
  const [isRestricted, restrictionReason] = showRemove
    ? hasRemoveRestriction({
        name: selectedItem.name,
        state: gameService.getSnapshot().context.state,
        id: selectedItem.id,
      })
    : [false, "No restriction"];

  useEffect(() => {
    setShowRemoveConfirmation(false);
  }, [selectedItem]);

  const remove = () => {
    const action = getRemoveAction(
      selectedItem?.name as InventoryItemName,
      hasLandscapingAccess,
    );
    if (!action) {
      return;
    }

    if (showRemoveConfirmation) {
      child.send("REMOVE", {
        event: action,
        id: selectedItem?.id,
        name: selectedItem?.name,
        location,
      });
    } else {
      setShowRemoveConfirmation(true);
    }
  };

  const removeAll = () => {
    if (showRemoveAllConfirmation) {
      child.send("REMOVE_ALL", {
        event: "items.removed",
        location,
      });
      setShowRemoveAllConfirmation(false);
    } else {
      setShowRemoveAllConfirmation(true);
    }
  };
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
                  child.send("CANCEL");
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
              {hasLandscapingAccess && (
                <RoundButton className="mb-3.5" onClick={removeAll}>
                  <img
                    src={ITEM_DETAILS["Rusty Shovel"].image}
                    className="absolute group-active:translate-y-[2px]"
                    style={{
                      top: `${PIXEL_SCALE * 5}px`,
                      left: `${PIXEL_SCALE * 5}px`,
                      width: `${PIXEL_SCALE * 13}px`,
                    }}
                  />
                </RoundButton>
              )}

              {location === "farm" &&
                hasFeatureAccess(
                  gameService.getSnapshot().context.state,
                  "LANDSCAPING_SHOP",
                ) && (
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
                onPlaceChestItem={(selected) => {
                  child.send("SELECT", {
                    action: placeEvent(selected),
                    placeable: selected,
                    multiple: true,
                  });
                }}
                onPlaceBud={(selected) => {
                  child.send("SELECT", {
                    action: "bud.placed",
                    placeable: selected,
                    location,
                  });
                }}
              />
            </div>
          </>
        )}
      </>
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
              bottom: `${PIXEL_SCALE * 25}px`,
              right: `${PIXEL_SCALE * -2}px`,
            }}
          >
            <Label type="danger">
              {isRestricted && !hasLandscapingAccess
                ? restrictionReason
                : t("remove")}
            </Label>
          </div>

          <RoundButton
            onClick={() => (!isRestricted || hasLandscapingAccess) && remove()}
            disabled={isRestricted && !hasLandscapingAccess}
          >
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
                {isRestricted && !hasLandscapingAccess && (
                  <img
                    src={SUNNYSIDE.icons.cancel}
                    className="absolute right-0 top-0 w-1/2 object-contain group-active:translate-y-[2px]"
                    alt="restricted"
                  />
                )}
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
  onPlaceChestItem: (item: InventoryItemName) => void;
  onPlaceBud: (bud: BudName) => void;
}> = ({ onPlaceChestItem, onPlaceBud }) => {
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
        onPlaceBud={onPlaceBud}
      />
    </>
  );
};

export const LandscapingHud = React.memo(LandscapingHudComponent);
