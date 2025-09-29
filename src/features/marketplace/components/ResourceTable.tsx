import React from "react";
import { Decimal } from "decimal.js-light";
import { TradeableDisplay } from "../lib/tradeables";
import { TableRow } from "./TableRow";
import { TableItem } from "./TableRow";

export const ResourceTable: React.FC<{
  details: TradeableDisplay;
  isResource: boolean;
  isBulkBuy: boolean;
  items: TableItem[];
  id: number;
  balance: Decimal;
  tableType: "listings" | "offers";
  inventoryCount: number;
  bulkListingIds: string[];
  onClick?: (id: string) => void;
  onBulkListingCheck?: (id: string, checked: boolean) => void;
}> = ({
  items,
  id: farmId,
  balance,
  tableType,
  inventoryCount,
  onClick,
  details,
  isResource,
  isBulkBuy,
  bulkListingIds,
  onBulkListingCheck,
}) => {
  return (
    <div className="max-h-[200px] scrollable overflow-y-auto relative">
      {items.map((item, index) => (
        <TableRow
          key={item.id}
          item={item}
          index={index}
          farmId={farmId}
          balance={balance}
          tableType={tableType}
          inventoryCount={inventoryCount}
          onClick={onClick}
          details={details}
          isResource={isResource}
          isBulkBuy={isBulkBuy}
          isSelected={bulkListingIds.includes(item.id)}
          onBulkListingCheck={onBulkListingCheck}
        />
      ))}
    </div>
  );
};
