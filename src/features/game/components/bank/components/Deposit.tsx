import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { TextInput } from "components/ui/TextInput";
import { CopyAddress } from "components/ui/CopyAddress";
import { Loading } from "features/auth/components";

import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import petNFTEgg from "assets/icons/pet_nft_egg.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "lib/object";

import { wallet } from "lib/blockchain/wallet";
import { getInventoryBalances } from "lib/blockchain/Inventory";
import { loadWardrobe } from "lib/blockchain/BumpkinItems";
import { getBudsBalance } from "lib/blockchain/Buds";
import { getPetsBalance } from "lib/blockchain/Pets";
import { balancesToInventory } from "lib/utils/visitUtils";

import type {
  Inventory,
  InventoryItemName,
  Wardrobe,
} from "features/game/types/game";
import { type BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { KNOWN_IDS } from "features/game/types";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import { getItemUnit } from "features/game/lib/conversion";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getBudImage } from "lib/buds/types";
import { getPetImage } from "features/island/pets/lib/petShared";

import type { DepositArgs } from "lib/blockchain/Deposit";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { GameWallet } from "features/wallet/Wallet";

import { WithdrawItemGrid } from "./withdraw/WithdrawItemGrid";
import { WithdrawItemDetail } from "./withdraw/WithdrawItemDetail";
import { WithdrawCart } from "./withdraw/WithdrawCart";
import type { WithdrawEntry } from "./withdraw/types";

const BUD_ICON_CLASS = "scale-[1.8] origin-bottom absolute";

type DepositCategory = "items" | "wearables" | "buds" | "pets";
type Page = "browse" | "review";
type MobileScreen = "grid" | "detail";

/** Normalised deposit entry: a WithdrawEntry plus the category/raw identifier
 *  needed to dispatch quantity changes back to the right selection state. */
interface DepositEntry extends WithdrawEntry {
  category: DepositCategory;
  itemName?: InventoryItemName;
  wearableName?: BumpkinItem;
}

// Categories render top-to-bottom as labelled sections in the left pane.
const CATEGORY_ORDER: DepositCategory[] = [
  "items",
  "wearables",
  "buds",
  "pets",
];

const CATEGORY_META: Record<
  DepositCategory,
  { icon: string; titleKey: TranslationKeys }
> = {
  items: { icon: chest, titleKey: "collectibles" },
  wearables: { icon: SUNNYSIDE.icons.wardrobe, titleKey: "wearables" },
  buds: { icon: SUNNYSIDE.icons.plant, titleKey: "buds" },
  pets: { icon: petNFTEgg, titleKey: "pets" },
};

interface Props {
  onClose: () => void;
}

const _linkedWallet = (state: MachineState) => state.context.linkedWallet ?? "";

/**
 * Deposit flow, redesigned to mirror the withdraw UI: a main menu of category
 * tiles → a grid → detail picker per category → a single shared cart. Unlike
 * withdraw (one transaction per category), deposit keeps a single combined
 * cart and sends everything to the farm in one transaction.
 */
const DepositContent: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const isMobile = useIsMobile();

  const { gameService } = useContext(Context);
  const linkedWallet = useSelector(gameService, _linkedWallet);

  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [inventoryBalance, setInventoryBalance] = useState<Inventory>({});
  const [wardrobeBalance, setWardrobeBalance] = useState<Wardrobe>({});
  const [budBalance, setBudBalance] = useState<number[]>([]);
  const [petsBalance, setPetsBalance] = useState<number[]>([]);

  const [inventoryToDeposit, setInventoryToDeposit] = useState<Inventory>({});
  const [wearablesToDeposit, setWearablesToDeposit] = useState<Wardrobe>({});
  const [budsToDeposit, setBudsToDeposit] = useState<number[]>([]);
  const [petsToDeposit, setPetsToDeposit] = useState<number[]>([]);

  const [page, setPage] = useState<Page>("browse");
  const [focusedKey, setFocusedKey] = useState<string | undefined>(undefined);
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>("grid");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (status !== "loading") return;

    const loadBalances = async () => {
      const account = wallet.getConnection();
      if (!account) {
        setStatus("error");
        return;
      }

      try {
        const [inventory, wardrobe, buds, pets] = await Promise.all([
          getInventoryBalances(account),
          loadWardrobe(account),
          getBudsBalance(account),
          getPetsBalance(account),
        ]);

        setInventoryBalance(balancesToInventory(inventory));
        setWardrobeBalance(wardrobe);
        setBudBalance(buds);
        setPetsBalance(pets);
        setStatus("loaded");
      } catch {
        setStatus("error");
      }
    };

    loadBalances();
  }, [status]);

  /* ---------------- selection mutations ---------------- */

  const setItemQty = (itemName: InventoryItemName, qty: number) => {
    let diff = qty - (inventoryToDeposit[itemName]?.toNumber() ?? 0);
    while (diff > 0) {
      setInventoryBalance((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? new Decimal(0)).minus(1),
      }));
      setInventoryToDeposit((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? new Decimal(0)).add(1),
      }));
      diff--;
    }
    while (diff < 0) {
      setInventoryBalance((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? new Decimal(0)).add(1),
      }));
      setInventoryToDeposit((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? new Decimal(0)).minus(1),
      }));
      diff++;
    }
  };

  const setWearableQty = (itemName: BumpkinItem, qty: number) => {
    let diff = qty - (wearablesToDeposit[itemName] ?? 0);
    while (diff > 0) {
      setWardrobeBalance((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? 0) - 1,
      }));
      setWearablesToDeposit((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? 0) + 1,
      }));
      diff--;
    }
    while (diff < 0) {
      setWardrobeBalance((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? 0) + 1,
      }));
      setWearablesToDeposit((prev) => ({
        ...prev,
        [itemName]: (prev[itemName] ?? 0) - 1,
      }));
      diff++;
    }
  };

  const setBudSelected = (budId: number, selectedQty: number) => {
    const isSelected = budsToDeposit.includes(budId);
    if (selectedQty >= 1 && !isSelected) {
      setBudBalance((prev) => prev.filter((id) => id !== budId));
      setBudsToDeposit((prev) => [...prev, budId]);
    }
    if (selectedQty <= 0 && isSelected) {
      setBudBalance((prev) => [...prev, budId]);
      setBudsToDeposit((prev) => prev.filter((id) => id !== budId));
    }
  };

  const setPetSelected = (petId: number, selectedQty: number) => {
    const isSelected = petsToDeposit.includes(petId);
    if (selectedQty >= 1 && !isSelected) {
      setPetsBalance((prev) => prev.filter((id) => id !== petId));
      setPetsToDeposit((prev) => [...prev, petId]);
    }
    if (selectedQty <= 0 && isSelected) {
      setPetsBalance((prev) => [...prev, petId]);
      setPetsToDeposit((prev) => prev.filter((id) => id !== petId));
    }
  };

  /* ---------------- entry building ---------------- */

  const itemEntries: DepositEntry[] = Array.from(
    new Set([
      ...getKeys(inventoryBalance).filter((n) => inventoryBalance[n]?.gt(0)),
      ...getKeys(inventoryToDeposit).filter((n) =>
        inventoryToDeposit[n]?.gt(0),
      ),
    ]),
  )
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b])
    .map((itemName) => ({
      key: `item-${itemName}`,
      category: "items" as const,
      itemName,
      id: KNOWN_IDS[itemName],
      name: getTranslatedItemName(itemName),
      image: ITEM_DETAILS[itemName].image,
      total:
        (inventoryBalance[itemName]?.toNumber() ?? 0) +
        (inventoryToDeposit[itemName]?.toNumber() ?? 0),
      locked: false,
      description: ITEM_DETAILS[itemName].description,
    }));

  const wearableEntries: DepositEntry[] = Array.from(
    new Set([
      ...getKeys(wardrobeBalance).filter((n) => (wardrobeBalance[n] ?? 0) > 0),
      ...getKeys(wearablesToDeposit).filter(
        (n) => (wearablesToDeposit[n] ?? 0) > 0,
      ),
    ]),
  )
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b])
    .map((wearableName) => ({
      key: `wearable-${wearableName}`,
      category: "wearables" as const,
      wearableName,
      id: ITEM_IDS[wearableName],
      name: wearableName,
      image: getImageUrl(ITEM_IDS[wearableName]),
      total:
        (wardrobeBalance[wearableName] ?? 0) +
        (wearablesToDeposit[wearableName] ?? 0),
      locked: false,
    }));

  const budEntries: DepositEntry[] = [...budBalance, ...budsToDeposit]
    .sort((a, b) => a - b)
    .map((budId) => ({
      key: `bud-${budId}`,
      category: "buds" as const,
      id: budId,
      name: `Bud #${budId}`,
      image: getBudImage(budId),
      iconClassName: BUD_ICON_CLASS,
      total: 1,
      unique: true,
      locked: false,
    }));

  const petEntries: DepositEntry[] = [...petsBalance, ...petsToDeposit]
    .sort((a, b) => a - b)
    .map((petId) => ({
      key: `pet-${petId}`,
      category: "pets" as const,
      id: petId,
      name: `Pet #${petId}`,
      image: getPetImage("happy", petId),
      total: 1,
      unique: true,
      locked: false,
    }));

  const entriesByCategory: Record<DepositCategory, DepositEntry[]> = {
    items: itemEntries,
    wearables: wearableEntries,
    buds: budEntries,
    pets: petEntries,
  };

  const allEntries = [
    ...itemEntries,
    ...wearableEntries,
    ...budEntries,
    ...petEntries,
  ];
  const entryByKey = new Map(allEntries.map((entry) => [entry.key, entry]));

  // Combined cart selection, keyed the same way as the entries.
  const selected: Record<string, number> = {};
  getKeys(inventoryToDeposit).forEach((n) => {
    const qty = inventoryToDeposit[n]?.toNumber() ?? 0;
    if (qty > 0) selected[`item-${n}`] = qty;
  });
  getKeys(wearablesToDeposit).forEach((n) => {
    const qty = wearablesToDeposit[n] ?? 0;
    if (qty > 0) selected[`wearable-${n}`] = qty;
  });
  budsToDeposit.forEach((id) => {
    selected[`bud-${id}`] = 1;
  });
  petsToDeposit.forEach((id) => {
    selected[`pet-${id}`] = 1;
  });

  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0);

  const onSetQty = (entry: WithdrawEntry, qty: number) => {
    const target = entryByKey.get(entry.key);
    if (!target) return;
    switch (target.category) {
      case "items":
        if (target.itemName) setItemQty(target.itemName, qty);
        break;
      case "wearables":
        if (target.wearableName) setWearableQty(target.wearableName, qty);
        break;
      case "buds":
        setBudSelected(target.id, qty);
        break;
      case "pets":
        setPetSelected(target.id, qty);
        break;
    }
  };

  const handleDeposit = () => {
    const selectedItems = getKeys(inventoryToDeposit).filter((i) =>
      inventoryToDeposit[i]?.gt(0),
    );
    const selectedWearables = getKeys(wearablesToDeposit).filter(
      (i) => (wearablesToDeposit[i] ?? 0) > 0,
    );

    const args: Pick<
      DepositArgs,
      | "itemIds"
      | "itemAmounts"
      | "wearableIds"
      | "wearableAmounts"
      | "budIds"
      | "petIds"
    > = {
      itemIds: selectedItems.map((i) => KNOWN_IDS[i]),
      itemAmounts: selectedItems.map((i) =>
        toWei(inventoryToDeposit[i]?.toString() as string, getItemUnit(i)),
      ),
      wearableIds: selectedWearables.map((i) => ITEM_IDS[i]),
      wearableAmounts: selectedWearables.map(
        (i) => wearablesToDeposit[i],
      ) as number[],
      budIds: budsToDeposit,
      petIds: petsToDeposit,
    };

    gameService.send("DEPOSIT", args);
    onClose();
  };

  /* ---------------- navigation ---------------- */

  const goToBrowse = () => {
    setPage("browse");
    setFocusedKey(undefined);
    setMobileScreen("grid");
  };

  const onPick = (entry: WithdrawEntry) => {
    setFocusedKey(entry.key);
    if (isMobile) setMobileScreen("detail");
  };

  const reviewButton = (
    <Button
      className="mt-1"
      disabled={totalSelected <= 0}
      onClick={() => setPage("review")}
    >
      <div className="flex items-center justify-center">
        <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
        {totalSelected > 0
          ? t("deposit.reviewDepositCount", { count: totalSelected })
          : t("deposit.reviewDeposit")}
      </div>
    </Button>
  );

  const farmFooter = (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex items-center">
        <img
          src={chest}
          className="mr-3"
          style={{ width: `${PIXEL_SCALE * 13}px` }}
        />
        <p>{t("deposit.farmWillReceive")}</p>
      </div>
      <a
        target="_blank"
        className="underline text-xxs hover:text-blue-500"
        href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
        rel="noreferrer"
      >
        {t("deposit.depositDidNotArrive")}
      </a>
    </div>
  );

  /* ---------------- loading / empty states ---------------- */

  if (status === "loading") return <Loading />;

  if (status === "error") {
    return (
      <div className="p-2">
        <p className="text-xs">{t("deposit.errorLoadingBalances")}</p>
        <Button className="mt-2" onClick={() => setStatus("loading")}>
          {t("deposit.refreshWallet")}
        </Button>
      </div>
    );
  }

  const emptyWallet = allEntries.length === 0;
  if (emptyWallet) {
    return (
      <div>
        <div className="p-2 space-y-2">
          <p className="text-xs">
            {t("deposit.addCollectiblesToPolygonWallet")}
          </p>
          <div className="flex text-xs space-x-1 pb-2">
            <span className="whitespace-nowrap">
              {t("deposit.linkedWallet")}
            </span>
            <CopyAddress address={linkedWallet} />
          </div>
        </div>
        <Button onClick={() => setStatus("loading")}>
          {t("deposit.refreshWallet")}
        </Button>
      </div>
    );
  }

  /* ---------------- review (shared cart) ---------------- */

  if (page === "review") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1 px-1">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="cursor-pointer"
            style={{ width: `${PIXEL_SCALE * 11}px` }}
            alt={t("back")}
            onClick={goToBrowse}
          />
          <Label type="default" icon={SUNNYSIDE.icons.confirm}>
            {t("deposit.reviewDeposit")}
          </Label>
        </div>
        <WithdrawCart
          entries={allEntries}
          selected={selected}
          onSetQty={onSetQty}
          onWithdraw={handleDeposit}
          walletAddress=""
          title={t("deposit.yourDeposit")}
          actionText={(count) =>
            count > 0 ? t("deposit.depositCount", { count }) : t("deposit")
          }
          footer={farmFooter}
        />
      </div>
    );
  }

  /* ---------------- browse (single combined screen) ---------------- */

  const focusedEntry = allEntries.find((entry) => entry.key === focusedKey);
  const focusedQty = focusedKey ? (selected[focusedKey] ?? 0) : 0;

  // One labelled section per non-empty category, each filtered by the search.
  const sections = CATEGORY_ORDER.map((category) => {
    const entries = entriesByCategory[category].filter((entry) =>
      query ? entry.name.toLowerCase().includes(query.toLowerCase()) : true,
    );
    return { category, entries };
  }).filter((section) => section.entries.length > 0);

  const detail = (
    <WithdrawItemDetail
      entry={focusedEntry}
      selectedQty={focusedQty}
      onSetQty={onSetQty}
      emptyText={t("deposit.detail.empty")}
      inCartText={t("deposit.inYourDeposit")}
    />
  );

  const search = (
    <TextInput
      value={query}
      onValueChange={setQuery}
      onCancel={() => setQuery("")}
      icon={SUNNYSIDE.icons.search}
      placeholder={t("search")}
    />
  );

  const sectionedGrid = (
    <div className="flex flex-col gap-2 w-full">
      {sections.map((section) => (
        <div key={section.category}>
          <Label
            type="default"
            icon={CATEGORY_META[section.category].icon}
            className="mb-1"
          >
            {t(CATEGORY_META[section.category].titleKey)}
          </Label>
          <WithdrawItemGrid
            entries={section.entries}
            selected={selected}
            focusedKey={isMobile ? undefined : focusedKey}
            onPick={onPick}
          />
        </div>
      ))}
    </div>
  );

  // Mobile item-detail screen
  if (isMobile && mobileScreen === "detail") {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1 px-1">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="cursor-pointer"
            style={{ width: `${PIXEL_SCALE * 11}px` }}
            alt={t("back")}
            onClick={() => setMobileScreen("grid")}
          />
          <Label type="default" icon={SUNNYSIDE.icons.search}>
            {t("withdraw.itemDetails")}
          </Label>
        </div>
        {detail}
        <Button className="mt-1" onClick={() => setMobileScreen("grid")}>
          <div className="flex items-center justify-center">
            <img src={SUNNYSIDE.icons.arrow_left} className="h-4 mr-1" />
            {t("withdraw.backToItems")}
          </div>
        </Button>
      </div>
    );
  }

  const availableCount = (
    <span className="text-xxs ml-auto">
      {t("deposit.availableCount", { count: allEntries.length })}
    </span>
  );

  // Desktop two-pane: sectioned grid on the left, detail + review on the right.
  if (!isMobile) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center px-1 mb-1">{availableCount}</div>
        <div className="px-1 mb-1">{search}</div>
        <SplitScreenView
          tallDesktopContent
          content={<div className="w-full">{sectionedGrid}</div>}
          panel={
            <div className="flex flex-col gap-1">
              {detail}
              {reviewButton}
            </div>
          }
        />
      </div>
    );
  }

  // Mobile grid screen
  return (
    <div className="flex flex-col">
      <div className="flex items-center px-1 mb-1">{availableCount}</div>
      <div className="px-1 mb-1">{search}</div>
      <div className="max-h-[55vh] overflow-y-auto scrollable">
        {sectionedGrid}
      </div>
      {reviewButton}
    </div>
  );
};

export const Deposit: React.FC<Props> = ({ onClose }) => (
  <GameWallet action="depositItems">
    <DepositContent onClose={onClose} />
  </GameWallet>
);
