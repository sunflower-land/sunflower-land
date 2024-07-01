import React, {
  ChangeEvent,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";
import classNames from "classnames";

import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";
import { wallet } from "lib/blockchain/wallet";
import { shortAddress } from "lib/utils/shortAddress";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { isMobile } from "mobile-device-detect";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { getDeliverableItems } from "features/goblins/storageHouse/lib/storageItems";

interface Props {
  onWithdraw: () => void;
  allowLongpressWithdrawal?: boolean;
}

const DELIVERY_FEE = 30;
const INNER_CANVAS_WIDTH = 14;
const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

export const WithdrawResources: React.FC<Props> = ({ onWithdraw }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const deliveryItemsStartRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<Inventory>({});

  const inventory: Inventory = useMemo(() => {
    const deliverables = getDeliverableItems({ game: gameState.context.state });

    return Object.fromEntries(
      Object.entries(deliverables).filter(([_, v]) => v?.gt(0)),
    );
  }, [gameState.context.state.previousInventory]);

  const hasWrongInputs = (): boolean => {
    const entries = Object.entries(selected) as [InventoryItemName, Decimal][];
    const wrongInputs = entries.filter(
      ([itemName, amount]) =>
        amount?.lte(0) || amount?.gt(inventory[itemName] || new Decimal(0)),
    );

    return !entries.length || !!wrongInputs.length;
  };

  const withdraw = () => {
    const itemsForWithdraw = Object.entries(selected) as [
      InventoryItemName,
      Decimal,
    ][];

    const ids = itemsForWithdraw.map(([item]) => KNOWN_IDS[item]);
    const amounts = itemsForWithdraw.map(([item]) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item)),
    );

    gameService.send("WITHDRAW", {
      ids,
      amounts,
      sfl: 0,
      captcha: "0x",
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

  const handleAmountChange = (
    e: ChangeEvent<HTMLInputElement>,
    itemName: InventoryItemName,
  ) => {
    if (/^0+(?!\.)/.test(e.target.value) && e.target.value.length > 1) {
      e.target.value = e.target.value.replace(/^0/, "");
    }

    if (VALID_NUMBER.test(e.target.value)) {
      const input = Number(e.target.value.slice(0, INPUT_MAX_CHAR));

      setSelected((prev) => ({
        ...prev,
        [itemName]: new Decimal(input),
      }));
    }
  };

  return (
    <>
      <div className="p-2 mb-2">
        <h2 className="mb-1 text-sm">{t("deliveryitem.inventory")}</h2>
        <div className="flex flex-wrap h-fit -ml-1.5 mb-2">
          {getKeys(inventory).map((itemName) => (
            <Box
              key={itemName}
              count={inventory[itemName]}
              onClick={() => onAdd(itemName)}
              image={ITEM_DETAILS[itemName].image}
            />
          ))}
        </div>

        <h2 className="mb-1 text-sm">{t("deliveryitem.itemsToDeliver")}</h2>
        <div
          className="flex flex-col gap-2 min-h-[48px] scrollable overflow-y-auto"
          style={{ maxHeight: 158 }}
        >
          <div ref={deliveryItemsStartRef} className="-mt-2"></div>
          {getKeys(selected).map((itemName) => (
            <div
              className="flex items-center justify-between gap-2"
              key={itemName}
            >
              <div className="flex items-center gap-2">
                <div
                  className="bg-brown-600"
                  style={{
                    width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
                    height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
                    ...pixelDarkBorderStyle,
                  }}
                >
                  <SquareIcon
                    icon={ITEM_DETAILS[itemName as InventoryItemName].image}
                    width={INNER_CANVAS_WIDTH}
                  />
                </div>
                <input
                  type="number"
                  name={itemName + "amount"}
                  value={parseFloat(selected[itemName]?.toString() || "0")}
                  onChange={(e) => handleAmountChange(e, itemName)}
                  className={classNames(
                    "px-2 py-1 bg-brown-200 text-shadow shadow-inner shadow-black",
                    isMobile ? "w-[80px]" : "w-[140px]",
                    {
                      "text-error":
                        selected[itemName]?.gt(
                          inventory[itemName] || new Decimal(0),
                        ) || selected[itemName]?.lte(new Decimal(0)),
                    },
                  )}
                />
                <div className="flex flex-col">
                  <span
                    className={isMobile ? "text-xxs" : "text-xs"}
                  >{`${parseFloat(
                    selected[itemName]
                      ?.mul(1 - DELIVERY_FEE / 100)
                      .toFixed(4, Decimal.ROUND_DOWN) as string,
                  )} ${itemName}`}</span>
                  <span className="text-xxs">{`${parseFloat(
                    selected[itemName]
                      ?.mul(DELIVERY_FEE / 100)
                      .toFixed(4, Decimal.ROUND_DOWN) as string,
                  )} Goblin fee`}</span>
                </div>
              </div>
              <img
                src={SUNNYSIDE.icons.cancel}
                className="h-4 mr-2 cursor-pointer"
                onClick={() => onRemove(itemName)}
              />
            </div>
          ))}
        </div>

        <div className="w-full my-3 border-t-2 border-white" />
        <div className="flex items-center mb-2 text-xs">
          <img src={SUNNYSIDE.icons.player} className="h-8 mr-2" />
          <div>
            <p>{t("deliveryitem.deliverToWallet")}</p>
            <p className="font-secondary">
              {shortAddress(wallet.myAccount || "XXXX")}
            </p>
          </div>
        </div>

        <p className="text-xs">{t("deliveryitem.viewOnOpenSea")}</p>
      </div>
      <Button onClick={withdraw} disabled={hasWrongInputs()}>
        {t("deliveryitem.deliver")}
      </Button>
    </>
  );
};
