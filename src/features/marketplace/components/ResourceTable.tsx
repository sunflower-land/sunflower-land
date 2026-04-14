import React from "react";
import { Decimal } from "decimal.js-light";
import { TradeableDisplay } from "../lib/tradeables";
import { TableRow } from "./TableRow";
import { TableItem } from "./TableRow";

type Props = {
  details: TradeableDisplay;
  isResource: boolean;
  isBulkBuy?: boolean;
  items: TableItem[];
  id: number;
  balance: Decimal;
  tableType: "listings" | "offers";
  inventoryCount: number;
  bulkListingIds?: string[];
  onClick?: (id: string) => void;
  onBulkListingSelect?: (id: string, checked: boolean) => void;
};

export const ResourceTable: React.FC<Props> = ({
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
  onBulkListingSelect,
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
          isSelected={bulkListingIds?.includes(item.id) ?? false}
          onBulkListingSelect={onBulkListingSelect}
        />
      ))}
    </div>
  );
};
