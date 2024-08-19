import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

type TradeTableItem = {
  price: number;
  expiresAt: string;
  createdById: number;
};

export const TradeTable: React.FC<{ items: TradeTableItem[]; id: number }> = ({
  items,
  id,
}) => {
  const { t } = useAppTranslation();
  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <thead>
        <tr>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
            <p>{t("marketplace.sfl")}</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>{t("marketplace.expiry")}</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>{t("marketplace.from")}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ createdById, price, expiresAt }, index) => (
          <tr
            key={index}
            className={classNames({ "bg-[#ead4aa]": id === createdById })}
          >
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 text-center"
            >
              {price}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate text-center"
            >
              {expiresAt}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate text-center"
            >
              {createdById}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
