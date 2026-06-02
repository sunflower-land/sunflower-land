import { useSelector } from "@xstate/react";
import React, { useContext, useMemo, useState } from "react";

import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { secondsToString } from "lib/utils/time";
import type { BoostName } from "features/game/types/game";
import { getPetImage } from "features/island/pets/lib/petShared";
import {
  getPetNFTReleaseDate,
  isPetNFTRevealed,
} from "features/game/types/pets";
import { getPetReleases } from "features/game/types/withdrawables";
import { useNow } from "lib/utils/hooks/useNow";
import petNFTEgg from "assets/icons/pet_nft_egg.png";

import { WithdrawCollection } from "./withdraw/WithdrawCollection";
import type { WithdrawEntry } from "./withdraw/types";

interface Props {
  onWithdraw: (ids: number[]) => void;
  onBack: () => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawPets: React.FC<Props> = ({
  onWithdraw,
  onBack,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const nfts = state.pets?.nfts ?? {};

  const [unselected, setUnselected] = useState<number[]>(
    getKeys(nfts)
      .filter((nftId) => !nfts[nftId].coordinates)
      .map(Number),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmationStep, setConfirmationStep] = useState<1 | 2 | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const now = useNow();

  const { petsToShow, petRowById } = useMemo(() => {
    const nowDate = new Date(now);
    type Row = {
      isRevealed: boolean;
      revealDate: Date | undefined;
      withdrawAt: Date | undefined;
      isRevealedButNotWithdrawable: boolean;
    };
    const petRowById = new Map<number, Row>();

    const withdrawable: number[] = [];
    const revealedLocked: number[] = [];
    const unrevealed: number[] = [];

    for (const petId of unselected) {
      const isRevealed = isPetNFTRevealed(petId, now);
      const { withdrawAt } = getPetReleases(petId);
      const revealDate = getPetNFTReleaseDate(petId, now);
      const isRevealedButNotWithdrawable =
        isRevealed && !!withdrawAt && withdrawAt > nowDate;

      petRowById.set(petId, {
        isRevealed,
        revealDate,
        withdrawAt,
        isRevealedButNotWithdrawable,
      });

      if (!isRevealed) {
        unrevealed.push(petId);
      } else if (isRevealedButNotWithdrawable) {
        revealedLocked.push(petId);
      } else if (!withdrawAt || withdrawAt <= nowDate) {
        withdrawable.push(petId);
      }
    }

    return {
      petsToShow: [...withdrawable, ...revealedLocked, ...unrevealed],
      petRowById,
    };
  }, [unselected, now]);

  const onAdd = (petId: number) => {
    setUnselected((prev) => prev.filter((pet) => pet !== petId));
    setSelected((prev) => [...prev, petId]);
  };

  const onRemove = (petId: number) => {
    setUnselected((prev) => [...prev, petId]);
    setSelected((prev) => prev.filter((pet) => pet !== petId));
  };

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
    now,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  const getRestrictionStatus = (itemName: BoostName) => {
    const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
      boostUsedAt: state.boostsUsedAt,
      item: itemName,
    });
    return { isRestricted, cooldownTimeLeft };
  };

  const getPetName = (petId: number) => {
    return `Pet #${petId}`;
  };

  const sortWithdrawableItems = (a: number, b: number) => {
    const aCooldownMs = getRestrictionStatus(
      getPetName(a) as BoostName,
    ).cooldownTimeLeft;
    const bCooldownMs = getRestrictionStatus(
      getPetName(b) as BoostName,
    ).cooldownTimeLeft;

    const aIsOnCooldown = aCooldownMs > 0;
    const bIsOnCooldown = bCooldownMs > 0;

    // 1. Pets on cooldown come first, by most cooldown time left
    if (aIsOnCooldown && bIsOnCooldown) {
      return bCooldownMs - aCooldownMs;
    }
    if (aIsOnCooldown !== bIsOnCooldown) {
      return aIsOnCooldown ? -1 : 1;
    }
    // 2. Otherwise, sort by pet ID
    return a - b;
  };

  const confirmationConfig = {
    1: {
      labelType: "warning" as const,
      labelText: t("warning"),
      message: t("withdraw.pet.confirmation1"),
      textClass: "text-sm",
    },
    2: {
      labelType: "danger" as const,
      labelText: t("danger"),
      message: t("withdraw.pet.confirmation2"),
      textClass: "text-base",
    },
  };

  const handleOpenConfirmation = () => {
    if (selected.length <= 0) {
      return;
    }

    setConfirmationStep(1);
    setShowConfirmationModal(true);
  };

  const handleCancelConfirmation = () => {
    setConfirmationStep(null);
    setShowConfirmationModal(false);
  };

  const handleConfirmStep = () => {
    if (confirmationStep === 1) {
      setConfirmationStep(2);
      return;
    }

    if (confirmationStep === 2) {
      setShowConfirmationModal(false);
      setConfirmationStep(null);
      onWithdraw(selected);
    }
  };

  const currentConfirmation = confirmationStep
    ? confirmationConfig[confirmationStep]
    : null;

  const onSetQty = (entry: WithdrawEntry, qty: number) => {
    const petId = entry.id;
    const isSelected = selected.includes(petId);
    if (qty >= 1 && !isSelected) onAdd(petId);
    if (qty <= 0 && isSelected) onRemove(petId);
  };

  // Cooldown-restricted pets first (longest first), then by ID — matching the
  // previous behaviour. Selected pets stay visible, appended after.
  const petIds = [...petsToShow].sort(sortWithdrawableItems).concat(selected);

  const entries: WithdrawEntry[] = petIds.map((petId) => {
    const petName = getPetName(petId);
    const { isRestricted, cooldownTimeLeft } = getRestrictionStatus(
      petName as BoostName,
    );

    const row = petRowById.get(petId);
    const isRevealed = row?.isRevealed ?? true;
    const revealDate = row?.revealDate;
    const withdrawAt = row?.withdrawAt;
    const isRevealedButNotWithdrawable =
      row?.isRevealedButNotWithdrawable ?? false;

    const locked =
      isRestricted || !isRevealed || isRevealedButNotWithdrawable;

    const cooldownText = secondsToString(cooldownTimeLeft / 1000, {
      length: "medium",
      isShortFormat: true,
      removeTrailingZeros: true,
    });

    const lockReason = isRestricted
      ? t("withdraw.boostedItem.timeLeft", { time: cooldownText })
      : !isRevealed && revealDate
        ? t("withdraw.pet.notRevealed", {
            date: revealDate.toLocaleDateString(),
          })
        : isRevealedButNotWithdrawable && withdrawAt
          ? t("withdraw.pet.withdrawableFrom", {
              date: withdrawAt.toLocaleDateString(),
            })
          : undefined;

    return {
      key: `pet-${petId}`,
      id: petId,
      name: petName,
      image: getPetImage("happy", petId),
      total: 1,
      unique: true,
      locked,
      lockReason,
      status: isRestricted
        ? {
            type: "warning" as const,
            icon: SUNNYSIDE.icons.timer,
            text: t("withdraw.status.cooldown", { time: cooldownText }),
          }
        : locked
          ? {
              type: "warning" as const,
              icon: SUNNYSIDE.icons.timer,
              text: t("withdraw.status.soon"),
            }
          : {
              type: "success" as const,
              text: t("withdraw.status.withdrawable"),
            },
    };
  });

  const selectedMap = selected.reduce(
    (acc, petId) => {
      acc[`pet-${petId}`] = 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      {showConfirmationModal && currentConfirmation && (
        <Modal
          show={showConfirmationModal}
          onHide={handleCancelConfirmation}
          backdrop="static"
        >
          <Panel className="sm:w-11/12 m-auto">
            <div className="flex flex-col p-1 gap-2 mb-1">
              <Label type={currentConfirmation.labelType}>
                {currentConfirmation.labelText}
              </Label>
              <p
                className={`${currentConfirmation.textClass} leading-5 sm:leading-6`}
              >
                {currentConfirmation.message}
              </p>
            </div>
            <div className="flex justify-around gap-1">
              <Button onClick={handleCancelConfirmation}>{t("cancel")}</Button>
              <Button onClick={handleConfirmStep}>{t("confirm")}</Button>
            </div>
          </Panel>
        </Modal>
      )}
      <WithdrawCollection
        title={t("pets")}
        icon={petNFTEgg}
        entries={entries}
        selected={selectedMap}
        onSetQty={onSetQty}
        onWithdraw={handleOpenConfirmation}
        withdrawDisabled={withdrawDisabled}
        walletAddress={wallet.getConnection() || "XXXX"}
        onBack={onBack}
        intro={t("withdraw.restricted.description")}
      />
    </>
  );
};
