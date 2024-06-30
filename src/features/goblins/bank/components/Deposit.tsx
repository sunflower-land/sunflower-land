import React, { ChangeEvent, useContext, useEffect, useState } from "react";
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
import { fromWei, toBN, toWei } from "web3-utils";

import token from "assets/icons/sfl.webp";
import classNames from "classnames";
import { setPrecision } from "lib/utils/formatNumber";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import { KNOWN_IDS } from "features/game/types";
import { Button } from "components/ui/Button";
import { Loading } from "features/auth/components";
import { DepositArgs } from "lib/blockchain/Deposit";
import { sflBalanceOf } from "lib/blockchain/Token";
import { CopyAddress } from "components/ui/CopyAddress";
import { getItemUnit } from "features/game/lib/conversion";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { loadWardrobe } from "lib/blockchain/BumpkinItems";
import { getBudsBalance } from "lib/blockchain/Buds";
import { CONFIG } from "lib/config";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isMobile } from "mobile-device-detect";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getImageUrl } from "lib/utils/getImageURLS";
import { MachineState } from "features/game/lib/gameMachine";
import { Context as GameContext } from "features/game/GameProvider";
import { getBumpkinLevel } from "features/game/lib/level";
import { GameWallet } from "features/wallet/Wallet";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

export function transferInventoryItem(
  itemName: InventoryItemName,
  setFrom: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
  setTo: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >
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

type Status = "loading" | "loaded" | "error";

interface Props {
  farmAddress: string;
  onDeposit: (
    args: Pick<
      DepositArgs,
      | "sfl"
      | "itemIds"
      | "itemAmounts"
      | "wearableIds"
      | "wearableAmounts"
      | "budIds"
    >
  ) => void;
  onClose?: () => void;
  onLoaded?: (loaded: boolean) => void;
  canDeposit?: boolean;
}

const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

export const Deposit: React.FC<Props> = ({
  onClose,
  onDeposit,
  onLoaded,
  farmAddress,
  canDeposit = true,
}) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();
  if (showIntro) {
    return (
      <>
        <div className="p-2">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            {t("deposit")}
          </Label>
          <p className="my-2 text-sm">{t("question.depositSFLItems")}</p>
        </div>
        <Button onClick={() => setShowIntro(false)}>{t("continue")}</Button>
      </>
    );
  }

  return (
    <GameWallet action="deposit">
      <DepositOptions
        onClose={onClose}
        onDeposit={onDeposit}
        onLoaded={onLoaded}
        farmAddress={farmAddress}
        canDeposit={canDeposit}
      />
    </GameWallet>
  );
};

const DepositOptions: React.FC<Props> = ({
  onClose,
  onDeposit,
  onLoaded,
  farmAddress,
}) => {
  const { t } = useAppTranslation();

  const [status, setStatus] = useState<Status>("loading");
  // These are the balances of the user's personal wallet
  const [sflBalance, setSflBalance] = useState<Decimal>(new Decimal(0));
  const [inventoryBalance, setInventoryBalance] = useState<Inventory>({});
  const [wardrobeBalance, setWardrobeBalance] = useState<Wardrobe>({});
  const [budBalance, setBudBalance] = useState<number[]>([]);
  const [sflDepositAmount, setSflDepositAmount] = useState(0);
  const [inventoryToDeposit, setInventoryToDeposit] = useState<Inventory>({});
  const [wearablesToDeposit, setWearablesToDeposit] = useState<Wardrobe>({});
  const [budsToDeposit, setBudsToDeposit] = useState<number[]>([]);

  useEffect(() => {
    if (status !== "loading") return;
    // Load balances from the user's personal wallet
    const loadBalances = async () => {
      if (!wallet.myAccount) {
        setStatus("error");
        // Notify parent that we're done loading
        onLoaded && onLoaded(false);
        return;
      }

      try {
        const sflBalanceFn = sflBalanceOf(
          wallet.web3Provider,
          wallet.myAccount
        );

        const inventoryBalanceFn = getInventoryBalances(
          wallet.web3Provider,
          wallet.myAccount
        );

        const wearableBalanceFn = loadWardrobe(
          wallet.web3Provider,
          wallet.myAccount
        );

        const budBalanceFn = getBudsBalance(
          wallet.web3Provider,
          wallet.myAccount
        );

        const [sflBalance, inventoryBalance, wearableBalance, budBalance] =
          await Promise.all([
            sflBalanceFn,
            inventoryBalanceFn,
            wearableBalanceFn,
            budBalanceFn,
          ]);

        setSflBalance(new Decimal(fromWei(sflBalance)));
        setInventoryBalance(balancesToInventory(inventoryBalance));
        setWardrobeBalance(wearableBalance);
        setBudBalance(budBalance);

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

  const handleSflDepositAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Strip the leading zero from numbers
    if (/^0+(?!\.)/.test(e.target.value) && e.target.value.length > 1) {
      e.target.value = e.target.value.replace(/^0/, "");
    }

    if (VALID_NUMBER.test(e.target.value)) {
      const input = Number(e.target.value.slice(0, INPUT_MAX_CHAR));

      setSflDepositAmount(input);
    }
  };

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
      toWei(inventoryToDeposit[item]?.toString() as string, getItemUnit(item))
    );

    const wearableIds = selectedWearables.map((item) => ITEM_IDS[item]);
    const wearableAmounts = selectedWearables.map(
      (item) => wearablesToDeposit[item]
    ) as number[];

    onDeposit({
      sfl: toWei(sflDepositAmount.toString()),
      itemIds,
      itemAmounts,
      wearableIds,
      wearableAmounts,
      budIds: budsToDeposit,
    });

    onClose && onClose();
  };

  const amountGreaterThanBalance = toBN(toWei(sflDepositAmount.toString())).gt(
    toBN(toWei(sflBalance.toString()))
  );

  const sflBalString = fromWei(toBN(toWei(sflBalance.toString())));
  const formattedSflBalance = setPrecision(
    new Decimal(sflBalString)
  ).toString();

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
  const hasItemsInInventory = depositableItems.length > 0;
  const hasItemsInWardrobe = depositableWearables.length > 0;
  const hasBuds = budBalance.length > 0;
  const emptyWallet =
    getKeys(wardrobeBalance).length === 0 &&
    getKeys(inventoryBalance).length === 0 &&
    budBalance.length === 0 &&
    budsToDeposit.length === 0 &&
    sflBalance.eq(0);
  const validDepositAmount = sflDepositAmount > 0 && !amountGreaterThanBalance;

  // if (!canDeposit) {
  //   return (
  //     <div className="p-2 space-y-2">
  //       <p>{t("deposit.toDepositLevelUp")}</p>
  //       <Label icon={lockIcon} type="danger">
  //        {t("deposit.level")}
  //       </Label>
  //     </div>
  //   );
  // }

  return (
    <>
      {status === "loading" && <Loading />}
      {status === "loaded" && emptyWallet && (
        <div className="p-2 space-y-2">
          <p>{t("deposit.noSflOrCollectibles")}</p>
          <div className="flex text-xs sm:text-xs mb-3 space-x-1">
            <span className="whitespace-nowrap">
              {t("deposit.farmAddress")}
            </span>
            <CopyAddress address={farmAddress} />
          </div>
        </div>
      )}
      {status === "loaded" && !emptyWallet && (
        <>
          <div className="p-2 mb-1">
            <p className="mb-2">{t("deposit.yourPersonalWallet")}</p>
            <div className="divide-y-2 divide-dashed divide-brown-600">
              <div className="space-y-3 mb-3">
                {sflBalance.gt(0) && (
                  <>
                    <p className="text-sm">{"SFL"}</p>
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative w-full mr-4">
                        <input
                          type="number"
                          name="sflDepositAmount"
                          value={sflDepositAmount}
                          disabled={false}
                          onInput={handleSflDepositAmountChange}
                          className={classNames(
                            "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2",
                            {
                              "text-error": amountGreaterThanBalance,
                            }
                          )}
                        />
                        <span className="text-xxs md:text-xs absolute top-1/2 -translate-y-1/2 right-2">{`${
                          isMobile ? t("balance.short") : t("balance")
                        }: ${formattedSflBalance}`}</span>
                      </div>
                      <div className="w-[10%] flex self-center justify-center">
                        <img className="w-6" src={token} alt="sfl token" />
                      </div>
                    </div>
                  </>
                )}

                {hasItemsInInventory && (
                  <>
                    <p className="text-sm">{t("collectibles")}</p>
                    <div className="flex flex-wrap h-fit -ml-1.5">
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
                  </>
                )}
                {hasBuds && (
                  <>
                    <p className="text-sm">{t("buds")}</p>
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
                  </>
                )}
                {hasItemsInWardrobe && (
                  <>
                    <p className="text-sm">{t("wearables")}</p>
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
                  </>
                )}
                <div className="pt-3">
                  <p className="mb-1">{t("deposit.farmWillReceive")}</p>
                  <div className="text-[11px] sm:text-xs mb-3">
                    <CopyAddress address={farmAddress} />
                  </div>
                  <div className="space-y-3">
                    {validDepositAmount && <p>{`${sflDepositAmount} SFL`}</p>}
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
                              count={new Decimal(wearablesToDeposit[item] ?? 0)}
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
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-1 mt-2">
              <a
                target="_blank"
                className="underline text-xxs hover:text-blue-500"
                href={`https://docs.sunflower-land.com/economy/depositing-and-custody#cant-see-the-items-you-deposited`}
                rel="noreferrer"
              >
                {t("deposit.depositDidNotArrive")}
              </a>
            </div>
            {sflDepositAmount > 0 && (
              <div className="mb-1 mt-2 text-xxs">
                <span>{t("deposit.goblinTaxInfo")}</span>
                <span>
                  <a
                    target="_blank"
                    className="underline text-xxs hover:text-blue-500"
                    href={`https://docs.sunflower-land.com/economy/withdrawing`}
                    rel="noreferrer"
                  >
                    {t("read.more")}
                  </a>
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={handleDeposit}
            className="w-full"
            disabled={
              (sflDepositAmount <= 0 &&
                !hasWearablesToDeposit &&
                !hasItemsToDeposit &&
                !hasBudsToDeposit) ||
              amountGreaterThanBalance
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
  canDeposit: boolean;
  showDepositModal: boolean;
  handleDeposit: (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => void;
  handleClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  farmAddress,
  canDeposit,
  showDepositModal,
  handleDeposit,
  handleClose,
}) => {
  return (
    <Modal show={showDepositModal} onHide={handleClose}>
      <CloseButtonPanel onClose={canDeposit ? handleClose : undefined}>
        <Deposit
          farmAddress={farmAddress}
          onDeposit={handleDeposit}
          onClose={handleClose}
          canDeposit={canDeposit}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _xp = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;

export const DepositWrapper: React.FC = () => {
  const { gameService } = useContext(GameContext);
  const farmAddress = useSelector(gameService, _farmAddress);
  const xp = useSelector(gameService, _xp);

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  return (
    <Deposit
      farmAddress={farmAddress}
      onDeposit={handleDeposit}
      canDeposit={getBumpkinLevel(xp) >= 3}
    />
  );
};
