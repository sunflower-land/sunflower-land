import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { InfoPopover } from "features/island/common/InfoPopover";
import { secondsToString } from "lib/utils/time";
import { BoostName } from "features/game/types/game";
import { getPetImage } from "features/island/pets/lib/petShared";
import {
  getPetNFTReleaseDate,
  isPetNFTRevealed,
} from "features/game/types/pets";
import { useNow } from "lib/utils/hooks/useNow";

// const imageDomain = CONFIG.NETWORK === "mainnet" ? "pets" : "testnet-pets";

interface Props {
  onWithdraw: (ids: number[]) => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawPets: React.FC<Props> = ({
  onWithdraw,
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
  const [showInfo, setShowInfo] = useState("");
  const [confirmationStep, setConfirmationStep] = useState<1 | 2 | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const now = useNow();

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
    const itemA = getPetName(a) as BoostName;
    const itemB = getPetName(b) as BoostName;
    const aCooldownMs = getRestrictionStatus(itemA).cooldownTimeLeft;
    const bCooldownMs = getRestrictionStatus(itemB).cooldownTimeLeft;

    const aIsOnCooldown = aCooldownMs > 0;
    const bIsOnCooldown = bCooldownMs > 0;

    // 1. Buds on cooldown come first
    if (aIsOnCooldown && bIsOnCooldown) {
      // 2. Among those, sort by most cooldown time left
      return bCooldownMs - aCooldownMs;
    }
    if (aIsOnCooldown !== bIsOnCooldown) {
      return aIsOnCooldown ? -1 : 1;
    }
    // 3. Otherwise, sort by pet IDs
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
      <div className="p-2 mb-2">
        <Label type="warning" className="mb-2">
          <span className="text-xs">{t("withdraw.restricted")}</span>
        </Label>
        <Label type="default" className="mb-2">
          {t("withdraw.pets")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {unselected
            .slice()
            .sort((a, b) => sortWithdrawableItems(a, b))
            .map((petId) => {
              const petName = getPetName(petId);
              const { isRestricted, cooldownTimeLeft } = getRestrictionStatus(
                petName as BoostName,
              );
              const RestrictionCooldown = cooldownTimeLeft / 1000;

              const handleBoxClick = () => {
                if (isRestricted || !isRevealed) {
                  setShowInfo((prev) => (prev === petName ? "" : petName));
                }
              };

              const isRevealed = isPetNFTRevealed(petId, now);
              const revealDate = getPetNFTReleaseDate(petId, now);

              return (
                <div
                  key={petName}
                  onClick={handleBoxClick}
                  className="flex relative"
                >
                  <InfoPopover
                    className="absolute top-14 text-xxs sm:text-xs"
                    showPopover={showInfo === `Pet #${petId}`}
                  >
                    {isRestricted
                      ? t("withdraw.boostedItem.timeLeft", {
                          time: secondsToString(RestrictionCooldown, {
                            length: "medium",
                            isShortFormat: true,
                            removeTrailingZeros: true,
                          }),
                        })
                      : !isRevealed && revealDate
                        ? t("withdraw.pet.notRevealed", {
                            date: revealDate.toLocaleDateString(),
                          })
                        : undefined}
                  </InfoPopover>

                  <Box
                    key={`pet-${petId}`}
                    onClick={() => onAdd(petId)}
                    image={getPetImage("happy", petId)}
                    disabled={isRestricted || !isRevealed}
                    secondaryImage={
                      isRestricted || !isRevealed
                        ? SUNNYSIDE.icons.lock
                        : undefined
                    }
                  />
                </div>
              );
            })}
          {/* Pad with empty boxes */}
          {unselected.length < 4 &&
            new Array(4 - unselected.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-4">
          <Label type="default" className="mb-2">
            {t("selected")}
          </Label>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selected.map((petId) => (
              <Box
                key={`pet-${petId}`}
                onClick={() => onRemove(petId)}
                image={getPetImage("happy", petId)}
                iconClassName="w-5"
              />
            ))}
            {/* Pad with empty boxes */}
            {selected.length < 4 &&
              new Array(4 - selected.length)
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
        onClick={handleOpenConfirmation}
        disabled={selected.length <= 0 || withdrawDisabled}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
