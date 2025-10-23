import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import {
  Inventory,
  InventoryItemName,
  Wardrobe,
} from "features/game/types/game";
import Decimal from "decimal.js-light";
import { wallet } from "lib/blockchain/wallet";
import { getInventoryBalances } from "lib/blockchain/Inventory";
import { balancesToInventory } from "lib/utils/visitUtils";
import { toWei } from "web3-utils";

import chest from "assets/icons/chest.png";
import petNFTEgg from "assets/icons/pet_nft_egg.png";

import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import { KNOWN_IDS } from "features/game/types";
import { Button } from "components/ui/Button";
import { Loading } from "features/auth/components";
import { DepositArgs } from "lib/blockchain/Deposit";
import { CopyAddress } from "components/ui/CopyAddress";
import { getItemUnit } from "features/game/lib/conversion";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { loadWardrobe } from "lib/blockchain/BumpkinItems";
import { getBudsBalance } from "lib/blockchain/Buds";
import { CONFIG } from "lib/config";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getImageUrl } from "lib/utils/getImageURLS";
import { MachineState } from "features/game/lib/gameMachine";
import { Context as GameContext } from "features/game/GameProvider";
import { GameWallet } from "features/wallet/Wallet";
import { getPetsBalance } from "lib/blockchain/Pets";
import { getPetImage } from "features/island/pets/lib/petShared";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

export function transferInventoryItem(
  itemName: InventoryItemName,
  setFrom: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
  setTo: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
) {
  let amount = new Decimal(1);

  // Subtract 1 or remaining
  setFrom((prev) => {
    const remaining = prev[itemName] ?? new Decimal(0);
    if (remaining.lessThan(1)) {
      amount = remaining;
    }
    return {
      ...prev,
      [itemName]: prev[itemName]?.minus(amount),
    };
  });

  // Add 1 or remaining
  setTo((prev) => ({
    ...prev,
    [itemName]: (prev[itemName] ?? new Decimal(0)).add(amount),
  }));
}

export type Status = "loading" | "loaded" | "error";

interface Props {
  farmAddress: string;
  linkedWallet: string;
  onDeposit: (
    args: Pick<
      DepositArgs,
      | "itemIds"
      | "itemAmounts"
      | "wearableIds"
      | "wearableAmounts"
      | "budIds"
      | "petIds"
    >,
  ) => void;
  onClose?: () => void;
  onLoaded?: (loaded: boolean) => void;
}

export const DepositGameItems: React.FC<Props> = ({
  onClose,
  onDeposit,
  onLoaded,
  farmAddress,
  linkedWallet,
}) => {
  return (
    <GameWallet action="depositItems">
      <DepositOptions
        onClose={onClose}
        onDeposit={onDeposit}
        onLoaded={onLoaded}
        farmAddress={farmAddress}
        linkedWallet={linkedWallet}
      />
    </GameWallet>
  );
};

const DepositOptions: React.FC<Props> = ({
  onClose,
  onDeposit,
  onLoaded,
  linkedWallet,
}) => {
  const { t } = useAppTranslation();

  const [status, setStatus] = useState<Status>("loading");
  const [inventoryBalance, setInventoryBalance] = useState<Inventory>({});
  const [wardrobeBalance, setWardrobeBalance] = useState<Wardrobe>({});
  const [budBalance, setBudBalance] = useState<number[]>([]);
  const [petsBalance, setPetsBalance] = useState<number[]>([]);
  const [inventoryToDeposit, setInventoryToDeposit] = useState<Inventory>({});
  const [wearablesToDeposit, setWearablesToDeposit] = useState<Wardrobe>({});
  const [budsToDeposit, setBudsToDeposit] = useState<number[]>([]);
  const [petsToDeposit, setPetsToDeposit] = useState<number[]>([]);

  useEffect(() => {
    if (status !== "loading") return;
    // Load balances from the user's personal wallet
    const loadBalances = async () => {
      if (!wallet.getAccount()) {
        setStatus("error");
        // Notify parent that we're done loading
        onLoaded && onLoaded(false);
        return;
      }

      try {
        const inventoryBalanceFn = getInventoryBalances(
          wallet.getAccount() as `0x${string}`,
        );

        const wearableBalanceFn = loadWardrobe(
          wallet.getAccount() as `0x${string}`,
        );

        const budBalanceFn = getBudsBalance(
          wallet.getAccount() as `0x${string}`,
        );

        const petsBalanceFn = getPetsBalance(
          wallet.getAccount() as `0x${string}`,
        );

        const [inventoryBalance, wearableBalance, budBalance, petsBalance] =
          await Promise.all([
            inventoryBalanceFn,
            wearableBalanceFn,
            budBalanceFn,
            petsBalanceFn,
          ]);

        setInventoryBalance(balancesToInventory(inventoryBalance));
        setWardrobeBalance(wearableBalance);
        setBudBalance(budBalance);
        setPetsBalance(petsBalance);

        setStatus("loaded");
        // Notify parent that we're done loading
        onLoaded && onLoaded(true);
      } catch (error: unknown) {
        setStatus("error");
        // Notify parent that we're done loading
        onLoaded && onLoaded(false);
      }
    };

    loadBalances();
  }, [onLoaded, status]);

  if (status === "error") {
    <div className="p-2">
      <p>{t("deposit.errorLoadingBalances")}</p>
    </div>;
  }

  const onAddItem = (itemName: InventoryItemName) => {
    // Transfer from inventory to selected
    transferInventoryItem(itemName, setInventoryBalance, setInventoryToDeposit);
  };

  const onAddWearable = (itemName: BumpkinItem) => {
    // Transfer from inventory to selected
    setWardrobeBalance((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));

    setWearablesToDeposit((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));
  };

  const onAddBud = (budId: number) => {
    setBudBalance((prev) => prev.filter((bud) => bud !== budId));
    setBudsToDeposit((prev) => [...prev, budId]);
  };

  const onRemoveBud = (budId: number) => {
    setBudBalance((prev) => [...prev, budId]);
    setBudsToDeposit((prev) => prev.filter((bud) => bud !== budId));
  };

  const onAddPet = (petId: number) => {
    setPetsBalance((prev) => prev.filter((pet) => pet !== petId));
    setPetsToDeposit((prev) => [...prev, petId]);
  };

  const onRemovePet = (petId: number) => {
    setPetsBalance((prev) => [...prev, petId]);
    setPetsToDeposit((prev) => prev.filter((pet) => pet !== petId));
  };

  const onRemoveWearable = (itemName: BumpkinItem) => {
    // Transfer from inventory to selected
    setWardrobeBalance((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));

    setWearablesToDeposit((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));
  };

  const onRemoveItem = (itemName: InventoryItemName) => {
    // Transfer from selected to inventory
    transferInventoryItem(itemName, setInventoryToDeposit, setInventoryBalance);
  };

  const handleDeposit = async () => {
    const itemIds = selectedItems.map((item) => KNOWN_IDS[item]);
    const itemAmounts = selectedItems.map((item) =>
      toWei(inventoryToDeposit[item]?.toString() as string, getItemUnit(item)),
    );

    const wearableIds = selectedWearables.map((item) => ITEM_IDS[item]);
    const wearableAmounts = selectedWearables.map(
      (item) => wearablesToDeposit[item],
    ) as number[];

    onDeposit({
      itemIds,
      itemAmounts,
      wearableIds,
      wearableAmounts,
      budIds: budsToDeposit,
      petIds: petsToDeposit,
    });

    onClose && onClose();
  };

  const depositableItems = getKeys(inventoryBalance)
    .filter((item) => inventoryBalance[item]?.gt(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  const depositableWearables = getKeys(wardrobeBalance)
    .filter((item) => !!wardrobeBalance[item])
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  const selectedItems = getKeys(inventoryToDeposit)
    .filter((item) => inventoryToDeposit[item]?.gt(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  const selectedWearables = getKeys(wearablesToDeposit)
    .filter((item) => !!wearablesToDeposit[item])
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  const hasItemsToDeposit = selectedItems.length > 0;
  const hasWearablesToDeposit = selectedWearables.length > 0;
  const hasBudsToDeposit = budsToDeposit.length > 0;
  const hasPetsToDeposit = petsToDeposit.length > 0;
  const hasItemsInInventory = depositableItems.length > 0;
  const hasItemsInWardrobe = depositableWearables.length > 0;
  const hasBuds = budBalance.length > 0;
  const hasPets = petsBalance.length > 0;
  const emptyWallet =
    getKeys(wardrobeBalance).length === 0 &&
    getKeys(inventoryBalance).length === 0 &&
    budBalance.length === 0 &&
    budsToDeposit.length === 0 &&
    petsBalance.length === 0 &&
    petsToDeposit.length === 0;

  const hasAnythingToDeposit =
    hasItemsToDeposit ||
    hasWearablesToDeposit ||
    hasBudsToDeposit ||
    hasPetsToDeposit;

  return (
    <>
      {status === "loading" && <Loading />}
      {status === "loaded" && emptyWallet && (
        <div>
          <div className="p-2 space-y-2">
            <p className="flex text-xs sm:text-xs">
              {t("deposit.addCollectiblesToPolygonWallet")}
            </p>
            <div className="flex text-xs sm:text-xs space-x-1 pb-8">
              <span className="whitespace-nowrap">
                {`${t("deposit.linkedWallet")}`}
              </span>
              <CopyAddress address={linkedWallet} />
            </div>
          </div>
          <Button onClick={() => setStatus("loading")}>
            {t("deposit.refreshWallet")}
          </Button>
        </div>
      )}
      {status === "loaded" && !emptyWallet && (
        <>
          <div className="p-2 mb-1">
            <div className="divide-y-2 divide-dashed divide-brown-600">
              <div className="space-y-3">
                {hasItemsInInventory && (
                  <div>
                    <Label
                      type="default"
                      className="mb-2"
                      icon={SUNNYSIDE.icons.basket}
                    >
                      {t("collectibles")}
                    </Label>
                    <div
                      className="flex flex-wrap h-fit -ml-1.5 overflow-y-auto scrollable pr-1"
                      style={{ maxHeight: "200px" }}
                    >
                      {depositableItems.map((item) => {
                        return (
                          <Box
                            count={inventoryBalance[item]}
                            key={item}
                            onClick={() => onAddItem(item)}
                            image={ITEM_DETAILS[item].image}
                            canBeLongPressed
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {hasBuds && (
                  <div>
                    <Label
                      className="mb-2"
                      type="default"
                      icon={SUNNYSIDE.icons.plant}
                    >
                      {t("buds")}
                    </Label>
                    <div
                      className="flex flex-wrap h-fit -ml-1.5 overflow-y-auto scrollable pr-1"
                      style={{ maxHeight: "200px" }}
                    >
                      {budBalance.map((budId) => {
                        return (
                          <Box
                            key={`bud-${budId}`}
                            onClick={() => onAddBud(budId)}
                            image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                            iconClassName="scale-[1.8] origin-bottom absolute"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {hasPets && (
                  <div>
                    <Label className="mb-2" type="default" icon={petNFTEgg}>
                      {t("petNFTs")}
                    </Label>
                    <div
                      className="flex flex-wrap h-fit -ml-1.5 overflow-y-auto scrollable pr-1"
                      style={{ maxHeight: "200px" }}
                    >
                      {petsBalance.map((petId) => {
                        return (
                          <Box
                            key={`pet-${petId}`}
                            onClick={() => onAddPet(petId)}
                            // TODO: Update with pet image
                            image={getPetImage("happy", petId)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {hasItemsInWardrobe && (
                  <div>
                    <Label type="default" className="mb-2" icon={chest}>
                      {t("wearables")}
                    </Label>
                    <div
                      className="flex flex-wrap h-fit -ml-1.5 overflow-y-auto scrollable pr-1"
                      style={{ maxHeight: "200px" }}
                    >
                      {depositableWearables.map((item) => {
                        return (
                          <Box
                            count={new Decimal(wardrobeBalance[item] ?? 0)}
                            key={item}
                            onClick={() => onAddWearable(item)}
                            image={getImageUrl(ITEM_IDS[item])}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {hasAnythingToDeposit && (
                  <div>
                    <Label type="warning" className="mb-2" icon={chest}>
                      {t("deposit.farmWillReceive")}
                    </Label>

                    <div>
                      {hasItemsToDeposit && (
                        <div className="flex flex-wrap h-fit -ml-1.5">
                          {selectedItems.map((item) => {
                            return (
                              <Box
                                count={inventoryToDeposit[item]}
                                key={item}
                                onClick={() => onRemoveItem(item)}
                                image={ITEM_DETAILS[item].image}
                                canBeLongPressed
                              />
                            );
                          })}
                        </div>
                      )}
                      {hasWearablesToDeposit && (
                        <div className="flex flex-wrap h-fit -ml-1.5">
                          {selectedWearables.map((item) => {
                            return (
                              <Box
                                count={
                                  new Decimal(wearablesToDeposit[item] ?? 0)
                                }
                                key={item}
                                onClick={() => onRemoveWearable(item)}
                                image={getImageUrl(ITEM_IDS[item])}
                                canBeLongPressed
                              />
                            );
                          })}
                        </div>
                      )}

                      {hasBudsToDeposit && (
                        <div className="flex flex-wrap h-fit -ml-1.5">
                          {budsToDeposit.map((budId) => {
                            return (
                              <Box
                                key={`bud-${budId}`}
                                onClick={() => onRemoveBud(budId)}
                                image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                                iconClassName="scale-[1.8] origin-bottom absolute"
                              />
                            );
                          })}
                        </div>
                      )}
                      {hasPetsToDeposit && (
                        <div className="flex flex-wrap h-fit -ml-1.5">
                          {petsToDeposit.map((petId) => {
                            return (
                              <Box
                                key={`pet-${petId}`}
                                onClick={() => onRemovePet(petId)}
                                // TODO: Update with pet image
                                image={getPetImage("happy", petId)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-1 mt-2">
              <a
                target="_blank"
                className="underline text-xxs hover:text-blue-500"
                href={`https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles`}
                rel="noreferrer"
              >
                {t("deposit.depositDidNotArrive")}
              </a>
            </div>
          </div>
          <Button
            onClick={handleDeposit}
            className="w-full"
            disabled={
              !hasWearablesToDeposit &&
              !hasItemsToDeposit &&
              !hasBudsToDeposit &&
              !hasPetsToDeposit
            }
          >
            {t("deposit.sendToFarm")}
          </Button>
        </>
      )}
    </>
  );
};

interface DepositModalProps {
  farmAddress: string;
  linkedWallet: string;
  showDepositModal: boolean;
  handleDeposit: (args: Pick<DepositArgs, "itemIds" | "itemAmounts">) => void;
  handleClose: () => void;
}

export const DepositGameItemsModal: React.FC<DepositModalProps> = ({
  farmAddress,
  linkedWallet,
  showDepositModal,
  handleDeposit,
  handleClose,
}) => {
  const { t } = useAppTranslation();

  return (
    <Modal show={showDepositModal} onHide={handleClose}>
      <CloseButtonPanel
        onClose={handleClose}
        tabs={[
          {
            icon: chest,
            name: t("deposit"),
          },
        ]}
      >
        <DepositGameItems
          farmAddress={farmAddress}
          linkedWallet={linkedWallet}
          onDeposit={handleDeposit}
          onClose={handleClose}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _linkedWallet = (state: MachineState) => state.context.linkedWallet ?? "";

export const DepositWrapper: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(GameContext);
  const farmAddress = useSelector(gameService, _farmAddress);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const handleDeposit = (
    args: Pick<DepositArgs, "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  return (
    <DepositGameItems
      farmAddress={farmAddress}
      linkedWallet={linkedWallet}
      onDeposit={handleDeposit}
      onClose={onClose}
    />
  );
};
