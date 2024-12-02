import classNames from "classnames";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import token from "assets/icons/sfl.webp";
import { Decimal } from "decimal.js-light";

type TableItem = {
  id: string;
  price: number;
  pricePerUnit: number;
  quantity: number;
  createdById: number;
};

export const ResourceTable: React.FC<{
  items: TableItem[];
  id: number;
  balance: Decimal;
  tableType: "listings" | "offers";
  inventoryCount: number;
  onClick: (id: string) => void;
}> = ({ items, id: farmId, balance, tableType, inventoryCount, onClick }) => {
  const { t } = useAppTranslation();

  return (
    <div className="max-h-[200px] scrollable overflow-y-auto relative">
      <table className="w-full text-xxs sm:text-xs border-collapse">
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
              <p>{t("marketplace.qty")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/3">
              <p>{t("marketplace.sfl")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/3">
              <p>{t("marketplace.unitPrice")}</p>
            </th>
            <th
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 w-[84px]"
            ></th>
          </tr>
        </thead>
        <tbody className="w-full text-xxs sm:text-xs border-collapse">
          {items.map(
            ({ id, createdById, quantity, price, pricePerUnit }, index) => (
              <tr
                key={index}
                className={classNames("relative", {
                  "bg-[#ead4aa]": !!(index % 2),
                })}
              >
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 text-center"
                >
                  {quantity}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 truncate text-center"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <img src={token} className="h-4" />
                    <span>{price}</span>
                  </div>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 truncate text-center relative"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <img src={token} className="h-4" />
                    <span>{pricePerUnit}</span>
                  </div>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1 text-center min-w-[94px]"
                >
                  <Button
                    disabled={
                      createdById === farmId ||
                      (tableType === "listings" && balance.lt(price)) ||
                      (tableType === "offers" && inventoryCount < quantity)
                    }
                    className="w-full h-8 rounded-none"
                    onClick={() => onClick(id)}
                  >
                    {t(tableType === "listings" ? "buy" : "accept")}
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
