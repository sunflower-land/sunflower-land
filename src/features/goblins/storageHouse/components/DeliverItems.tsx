import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";
import classNames from "classnames";

import { Context } from "features/game/GoblinProvider";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";
import * as AuthProvider from "features/auth/lib/Provider";
import { wallet } from "lib/blockchain/wallet";
import { getDeliverableItemsLegacy } from "../lib/storageItems";
import { shortAddress } from "lib/utils/shortAddress";
import { loadBanDetails } from "features/game/actions/bans";
import { Jigger, JiggerStatus } from "features/game/components/Jigger";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { isMobile } from "mobile-device-detect";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onWithdraw: () => void;
  allowLongpressWithdrawal?: boolean;
}

const DELIVERY_FEE = 30;
const INNER_CANVAS_WIDTH = 14;
const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

export const DeliverItems: React.FC<Props> = ({ onWithdraw }) => {
  const { t } = useAppTranslation();

  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const deliveryItemsStartRef = useRef<HTMLDivElement>(null);

  const [jiggerState, setJiggerState] =
    useState<{ url: string; status: JiggerStatus }>();
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Inventory>({});

  const inventory: Inventory = useMemo(() => {
    const deliverables = getDeliverableItemsLegacy(
      goblinState.context.state.inventory
    );

    return Object.fromEntries(
      Object.entries(deliverables).filter(([_, v]) => v?.gt(0))
    );
  }, [goblinState.context.state.inventory]);

  useEffect(() => {
    const load = async () => {
      const check = await loadBanDetails(
        String(goblinState.context.farmId),
        authState.context.user.rawToken as string,
        authState.context.transactionId as string
      );

      if (check.verificationUrl) {
        setJiggerState({
          url: check.verificationUrl,
          status: check.botStatus as JiggerStatus,
        });
      }
      setIsLoading(false);
    };

    load();
  }, []);

  const hasWrongInputs = (): boolean => {
    const entries = Object.entries(selected) as [InventoryItemName, Decimal][];
    const wrongInputs = entries.filter(
      ([itemName, amount]) =>
        amount?.lte(0) || amount?.gt(inventory[itemName] || new Decimal(0))
    );

    return !entries.length || !!wrongInputs.length;
  };

  const withdraw = () => {
    const itemsForWithdraw = Object.entries(selected) as [
      InventoryItemName,
      Decimal
    ][];

    const ids = itemsForWithdraw.map(([item]) => KNOWN_IDS[item]);
    const amounts = itemsForWithdraw.map(([item]) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item))
    );

    goblinService.send("WITHDRAW", {
      ids,
      amounts,
      sfl: "0",
      captcha: goblinState.context.sessionId,
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
    itemName: InventoryItemName
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

  if (isLoading) {
    return <span className="loading">{t("loading")}</span>;
  }

  if (jiggerState) {
    return (
      <Jigger
        onClose={onWithdraw}
        status={jiggerState.status}
        verificationUrl={jiggerState.url}
      />
    );
  }

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
                          inventory[itemName] || new Decimal(0)
                        ) || selected[itemName]?.lte(new Decimal(0)),
                    }
                  )}
                />
                <div className="flex flex-col">
                  <span
                    className={isMobile ? "text-xxs" : "text-xs"}
                  >{`${parseFloat(
                    selected[itemName]
                      ?.mul(1 - DELIVERY_FEE / 100)
                      .toFixed(4, Decimal.ROUND_DOWN) as string
                  )} ${itemName}`}</span>
                  <span className="text-xxs">{`${parseFloat(
                    selected[itemName]
                      ?.mul(DELIVERY_FEE / 100)
                      .toFixed(4, Decimal.ROUND_DOWN) as string
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
            <p>{shortAddress(wallet.myAccount || "XXXX")}</p>
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
