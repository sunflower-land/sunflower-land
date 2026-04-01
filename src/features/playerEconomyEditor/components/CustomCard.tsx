import React, { useLayoutEffect } from "react";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ActionForm } from "../lib/types";
import { CustomMintRowList, CustomBurnRowList } from "./ActionRowList";
import { FieldRow } from "./FieldRow";

const CUSTOM_REQUIRE_PLACEHOLDER: ActionForm["require"][number] = {
  token: "",
  amount: 1,
};

export const CustomCard: React.FC<{
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
    if (action.require.length === 0) {
      onUpdate({ require: [{ ...CUSTOM_REQUIRE_PLACEHOLDER }] });
    } else if (action.require.length > 1) {
      onUpdate({
        require: [
          {
            token: action.require[0].token,
            amount: 1,
          },
        ],
      });
    }
  }, [action.require.length, action, onUpdate]);

  const requireToken = action.require[0]?.token ?? "";

  return (
    <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <Label type="default">
          {`Custom - #${String(ruleSequenceStart).padStart(3, "0")}`}
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

      <p className="text-xs opacity-80 bg-[#1a3d2e]/60 border border-[#286c4e]/50 rounded px-2 py-1.5">
        Use custom rules carefully in your minigame code
      </p>

      <div className="space-y-2">
        <Label type="default">Mint</Label>
        <CustomMintRowList
          rows={action.customMint}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(customMint) => onUpdate({ customMint })}
        />
        <p className="text-[10px] opacity-60">
          Your game can determine how much to mint
        </p>
      </div>

      <div className="space-y-2">
        <Label type="default">Burn</Label>
        <CustomBurnRowList
          rows={action.customBurn}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(customBurn) => onUpdate({ customBurn })}
        />
        <p className="text-[10px] opacity-60">
          Your game decides how much to burn
        </p>
      </div>

      <div className="space-y-2">
        <Label type="default">Requires</Label>
        <p className="text-[10px] opacity-60 -mt-1">
          Player must have at least 1 of the selected item (not consumed).
        </p>
        <FieldRow label="Item">
          <Dropdown
            options={itemKeys}
            value={requireToken || undefined}
            onChange={(v) =>
              onUpdate({
                require: [{ token: v, amount: 1 }],
              })
            }
            placeholder="Select item"
            showSearch
            getOptionLabel={getItemOptionLabel}
          />
        </FieldRow>
      </div>

      <FieldRow label="Daily cap (action uses)">
        <NumberInput
          value={new Decimal(action.customDailyUsesCap ?? 0)}
          maxDecimalPlaces={0}
          onValueChange={(v) =>
            onUpdate({
              customDailyUsesCap: Math.max(0, Math.floor(v.toNumber())),
            })
          }
        />
      </FieldRow>
      <p className="text-[10px] opacity-60 -mt-1 ml-1">
        Max times this action can succeed per UTC day (0 = unlimited).
      </p>
    </InnerPanel>
  );
};
