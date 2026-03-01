import React, { useContext, useRef, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";

import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";
import { wallet } from "lib/blockchain/wallet";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { getDeliverableItems } from "features/goblins/storageHouse/lib/storageItems";
import { formatNumber } from "lib/utils/formatNumber";
import { NumberInput } from "components/ui/NumberInput";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  onWithdraw: () => void;
  allowLongpressWithdrawal?: boolean;
  withdrawDisabled?: boolean;
}

const DELIVERY_FEE_PERCENTAGE = 30;

const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;
const _inventory =
  (now: number) =>
  (state: MachineState): Inventory => {
    const deliverables = getDeliverableItems({
      state: state.context.state,
      now,
    });

    return Object.fromEntries(
      Object.entries(deliverables).filter(([_, v]) => v?.gt(0)),
    );
  };

export const WithdrawResources: React.FC<Props> = ({
  onWithdraw,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();
  const now = useNow();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const farmId = useSelector(gameService, _farmId);
  const inventory = useSelector(gameService, _inventory(now));

  const deliveryItemsStartRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<Inventory>({});

  const hasWrongInputs = (): boolean => {
    const entries = Object.entries(selected) as [InventoryItemName, Decimal][];
    const wrongInputs = entries.filter(
      ([itemName, amount]) =>
        amount?.lte(0) || amount?.gt(inventory[itemName] || new Decimal(0)),
    );

    return !entries.length || !!wrongInputs.length;
  };

  const withdraw = () => {
    if (withdrawDisabled) return;
    const itemsForWithdraw = Object.entries(selected) as [
      InventoryItemName,
      Decimal,
    ][];

    const ids = itemsForWithdraw.map(([item]) => KNOWN_IDS[item]);
    const amounts = itemsForWithdraw.map(([item]) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item)),
    );

    gameService.send("TRANSACT", {
      transaction: "transaction.itemsWithdrawn",
      request: {
        farmId,
        effect: {
          type: "withdraw.items",
          amounts,
          ids,
        },
      },
    });

    onWithdraw();
  };

  const onAdd = (itemName: InventoryItemName) => {
    let amount = new Decimal(1);
    const total = inventory[itemName] || new Decimal(0);

    if (total.lt(amount)) {
      amount = total;
    }

    setSelected((prev) => ({
      [itemName]: prev[itemName] || amount,
      ...prev,
    }));
    deliveryItemsStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onRemove = (itemName: InventoryItemName) => {
    setSelected((prev) => {
      const copy = { ...prev };
      delete copy[itemName];

      return copy;
    });
  };

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Cropkeeper,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Cropkeeper} />;
  }

  return (
    <>
      <div className="p-2 mb-2" ref={divRef}>
        <Label type="default" className="mb-2">
          {t("withdraw.select.item")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5 mb-2">
          {getKeys(inventory).map((itemName) => (
            <Box
              key={itemName}
              count={inventory[itemName]}
              onClick={() => onAdd(itemName)}
              image={ITEM_DETAILS[itemName].image}
              parentDivRef={divRef}
            />
          ))}
        </div>

        {getKeys(selected).length > 0 && (
          <Label type="default" className="my-2">
            {t("deliveryitem.itemsToDeliver")}
          </Label>
        )}
        <div className="flex flex-col max-h-48 gap-1 pr-1 scrollable overflow-y-auto">
          <div ref={deliveryItemsStartRef} />
          {getKeys(selected).map((itemName) => {
            const inventoryAmount = inventory[itemName] ?? new Decimal(0);
            const selectedAmount = selected[itemName] ?? new Decimal(0);
            return (
              <OuterPanel
                className="flex items-center justify-between gap-2"
                key={itemName}
              >
                <div className="flex items-center gap-2">
                  <SquareIcon icon={ITEM_DETAILS[itemName].image} width={14} />

                  <NumberInput
                    className="w-24"
                    value={selectedAmount}
                    maxDecimalPlaces={2}
                    isOutOfRange={
                      selectedAmount.lte(0) ||
                      selectedAmount.gt(inventoryAmount)
                    }
                    onValueChange={(value) =>
                      setSelected((prev) => ({
                        ...prev,
                        [itemName]: value,
                      }))
                    }
                  />

                  <div className="flex flex-col">
                    <span className="text-xxs">{`${formatNumber(
                      selectedAmount.mul(1 - DELIVERY_FEE_PERCENTAGE / 100) ??
                        0,
                    )} x ${itemName}`}</span>
                    <span className="text-xxs">{`(${formatNumber(
                      selectedAmount.mul(DELIVERY_FEE_PERCENTAGE / 100) ?? 0,
                    )} ${t("fee")})`}</span>
                  </div>
                </div>
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="mr-2 cursor-pointer"
                  style={{
                    width: `${PIXEL_SCALE * 11}px`,
                    height: `${PIXEL_SCALE * 11}px`,
                  }}
                  onClick={() => onRemove(itemName)}
                />
              </OuterPanel>
            );
          })}
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
            <p>{t("deliveryitem.deliverToWallet")}</p>
            <WalletAddressLabel
              walletAddress={wallet.getConnection() || "XXXX"}
            />
          </div>
        </div>

        <p className="text-xs">
          {t("deliveryitem.viewOnOpenSea")}{" "}
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
        disabled={hasWrongInputs() || withdrawDisabled}
      >
        {t("deliveryitem.deliver")}
      </Button>
    </>
  );
};
