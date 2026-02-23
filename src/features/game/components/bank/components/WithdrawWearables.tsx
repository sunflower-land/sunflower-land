import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";

import { BoostName, Wardrobe } from "features/game/types/game";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { BUMPKIN_RELEASES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { getImageUrl } from "lib/utils/getImageURLS";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { InfoPopover } from "features/island/common/InfoPopover";
import { secondsToString } from "lib/utils/time";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";

interface Props {
  onWithdraw: (ids: number[], amounts: number[]) => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawWearables: React.FC<Props> = ({
  onWithdraw,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const getTrueAvailableWardrobe = () => {
    let available = availableWardrobe(state);

    available = getKeys(available).reduce((acc, key) => {
      const currentAmount = available[key] ?? 0;
      const onChainAmount = state.previousWardrobe[key] ?? 0;
      return {
        ...acc,
        [key]: Math.min(currentAmount, onChainAmount),
      };
    }, {} as Wardrobe);

    return available;
  };

  const [wardrobe, setWardrobe] = useState<Wardrobe>(
    getTrueAvailableWardrobe(),
  );
  const [selected, setSelected] = useState<Wardrobe>({});

  const [showInfo, setShowInfo] = useState("");

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => ITEM_IDS[item]);
    const amounts = getKeys(selected).map((item) => selected[item]) as number[];

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));
  };

  const onRemove = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));

    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[itemName] === 1) {
        delete newSelected[itemName];
      } else {
        newSelected[itemName] = (newSelected[itemName] ?? 0) - 1;
      }
      return newSelected;
    });
  };

  const getRestrictionStatus = (itemName: BoostName) => {
    const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
      boostUsedAt: state.boostsUsedAt,
      item: itemName,
    });
    return { isRestricted, cooldownTimeLeft };
  };

  const hasMoreOffChainItems = (itemName: BumpkinItem) => {
    const wardrobeCount = wardrobe[itemName] ?? 0;
    const currentAmount = availableWardrobe(state)[itemName] ?? 0;
    const onChainAmount = state.previousWardrobe[itemName] ?? 0;

    // No items available to select, but there are more off-chain items
    return wardrobeCount <= 0 && currentAmount > onChainAmount;
  };

  // Precompute/cached values for sorting to avoid repeated expensive calls
  const withdrawableItemCache = getKeys(wardrobe).reduce(
    (cache, itemName) => {
      const { cooldownTimeLeft } = getRestrictionStatus(itemName);
      const isOnCooldown = cooldownTimeLeft > 0;
      const hasMoreOffChain = hasMoreOffChainItems(itemName);
      const hasBuff = !!BUMPKIN_ITEM_BUFF_LABELS[itemName]?.length;

      cache[itemName] = {
        cooldownMs: cooldownTimeLeft,
        isOnCooldown,
        hasMoreOffChain,
        hasBuff,
      };

      return cache;
    },
    {} as {
      [key in BumpkinItem]?: {
        cooldownMs: number;
        isOnCooldown: boolean;
        hasMoreOffChain: boolean;
        hasBuff: boolean;
      };
    },
  );

  const sortWithdrawableItems = (itemA: BumpkinItem, itemB: BumpkinItem) => {
    const a = withdrawableItemCache[itemA];
    const b = withdrawableItemCache[itemB];

    // Handle undefined cases first
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    // 1. Items on cooldown come first, sorted by most cooldown time left
    if (a.isOnCooldown && b.isOnCooldown) {
      return b.cooldownMs - a.cooldownMs;
    }
    if (a.isOnCooldown !== b.isOnCooldown) {
      return a.isOnCooldown ? -1 : 1;
    }

    // 2. Items that have more off-chain than on-chain copies
    if (a.hasMoreOffChain !== b.hasMoreOffChain) {
      return a.hasMoreOffChain ? -1 : 1;
    }

    // 3. Boosted items come before non-boosted items
    if (a.hasBuff !== b.hasBuff) {
      return a.hasBuff ? -1 : 1;
    }

    // 4. Otherwise, sort by item IDs
    return ITEM_IDS[itemA] - ITEM_IDS[itemB];
  };

  const withdrawableItems = [...new Set([...getKeys(wardrobe)])]
    .filter((itemName) => {
      const withdrawAt = BUMPKIN_RELEASES[itemName]?.withdrawAt;
      const canWithdraw = !!withdrawAt && withdrawAt <= new Date();
      return canWithdraw;
    })
    .filter(
      (itemName) =>
        hasMoreOffChainItems(itemName) || (wardrobe[itemName] ?? 0) > 0,
    )
    .sort((a, b) => sortWithdrawableItems(a, b));

  const selectedItems = getKeys(selected)
    .filter((item) => !!selected[item])
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  if (!isFaceVerified({ game: state })) {
    return <FaceRecognition />;
  }

  return (
    <>
      <div className="p-2 mb-2">
        <Label type="warning" className="mb-2">
          <span className="text-xs">{t("withdraw.restricted")}</span>
        </Label>
        <Label type="default" className="mb-2">
          {t("withdraw.select.item")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {withdrawableItems.map((itemName) => {
            const wardrobeCount = wardrobe[itemName] ?? 0;

            const { isRestricted, cooldownTimeLeft } =
              getRestrictionStatus(itemName);

            const RestrictionCooldown = cooldownTimeLeft / 1000;
            const isLocked = isRestricted || wardrobeCount <= 0;

            const shouldShowPopover =
              isRestricted || hasMoreOffChainItems(itemName);

            const handleBoxClick = () => {
              if (shouldShowPopover) {
                setShowInfo((prev) => (prev === itemName ? "" : itemName));
              }
            };

            return (
              <div
                key={itemName}
                onClick={handleBoxClick}
                className="flex relative text-center"
              >
                <InfoPopover
                  className="absolute top-14 text-xxs sm:text-xs"
                  showPopover={showInfo === itemName}
                >
                  {hasMoreOffChainItems(itemName)
                    ? t("withdraw.requires.storeOnChain")
                    : isRestricted &&
                      t("withdraw.boostedItem.timeLeft", {
                        time: secondsToString(RestrictionCooldown, {
                          length: "medium",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        }),
                      })}
                </InfoPopover>

                <Box
                  count={new Decimal(wardrobeCount ?? 0)}
                  key={itemName}
                  onClick={() => onAdd(itemName)}
                  disabled={isLocked}
                  image={getImageUrl(ITEM_IDS[itemName])}
                  secondaryImage={
                    shouldShowPopover ? SUNNYSIDE.icons.lock : undefined
                  }
                />
              </div>
            );
          })}
          {/* Pad with empty boxes */}
          {withdrawableItems.length < 4 &&
            new Array(4 - withdrawableItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-4">
          <Label type="default" className="mb-2">
            {t("selected")}
          </Label>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selectedItems.map((itemName) => {
              return (
                <Box
                  count={new Decimal(selected[itemName] ?? 0)}
                  key={itemName}
                  onClick={() => onRemove(itemName)}
                  image={getImageUrl(ITEM_IDS[itemName])}
                />
              );
            })}
            {/* Pad with empty boxes */}
            {selectedItems.length < 4 &&
              new Array(4 - selectedItems.length)
                .fill(null)
                .map((_, index) => <Box disabled key={index} />)}
          </div>
        </div>

        <div className="w-full my-3 border-t border-white" />
        <div className="flex items-center mb-2 text-xs">
          <img
            src={SUNNYSIDE.icons.player}
            className="mr-3"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <div className="flex flex-col gap-1">
            <p>{t("withdraw.send.wallet")}</p>
            <WalletAddressLabel
              walletAddress={wallet.getConnection() || "XXXX"}
            />
          </div>
        </div>

        <p className="text-xs">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
        </p>
      </div>

      <Button
        onClick={withdraw}
        disabled={selectedItems.length <= 0 || withdrawDisabled}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
