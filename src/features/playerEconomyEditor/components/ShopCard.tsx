import React, { useLayoutEffect } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { NumberInput } from "components/ui/NumberInput";
import { EMPTY_BURN_ROW, EMPTY_MINT_ROW, type ActionForm } from "../lib/types";
import { MintRowList, BurnRowList } from "./ActionRowList";
import { FieldRow } from "./FieldRow";

export const ShopCard: React.FC<{
  action: ActionForm;
  index: number;
  ruleSequenceStart: number;
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({
  action,
  index,
  ruleSequenceStart,
  itemKeys,
  getItemOptionLabel,
  onUpdate,
  onDelete,
}) => {
  useLayoutEffect(() => {
    const patch: Partial<ActionForm> = {};
    if (action.burn.length === 0) {
      patch.burn = [{ ...EMPTY_BURN_ROW }];
    }
    if (action.mint.length === 0) {
      patch.mint = [{ ...EMPTY_MINT_ROW }];
    } else if (action.mint.length > 1) {
      patch.mint = [action.mint[0]];
    }
    if (Object.keys(patch).length > 0) {
      onUpdate(patch);
    }
  }, [action, onUpdate]);

  return (
    <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <Label type="default">
          {`Shop - #${String(ruleSequenceStart).padStart(3, "0")}`}
        </Label>
        <img
          src={SUNNYSIDE.icons.close}
          className="cursor-pointer hover:brightness-75"
          onClick={onDelete}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            imageRendering: "pixelated",
          }}
        />
      </div>

      <p className="text-xs opacity-70">
        {
          "Exchange and unlock items. These rules appear in the minigame shop by default."
        }
      </p>

      <div className="space-y-2">
        <Label type="default">{"Mint (one item)"}</Label>
        <MintRowList
          rows={action.mint}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          minRows={1}
          maxRows={1}
          onChange={(mint) =>
            onUpdate({
              mint:
                mint.length > 0 ? mint.slice(0, 1) : [{ ...EMPTY_MINT_ROW }],
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label type="default">{"Burn (price)"}</Label>
        <BurnRowList
          rows={action.burn}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          minRows={1}
          onChange={(burn) =>
            onUpdate({
              burn: burn.length > 0 ? burn : [{ ...EMPTY_BURN_ROW }],
            })
          }
        />
      </div>

      <FieldRow
        label="Limit"
        hint="Max times each farm can buy this (0 = unlimited). Uses saved purchase counts."
      >
        <NumberInput
          value={new Decimal(action.shopPurchaseLimit ?? 0)}
          maxDecimalPlaces={0}
          onValueChange={(v) =>
            onUpdate({
              shopPurchaseLimit: Math.max(0, Math.floor(v.toNumber())),
            })
          }
        />
      </FieldRow>
    </InnerPanel>
  );
};
