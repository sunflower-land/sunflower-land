import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ActionForm } from "../lib/types";
import { MintRowList, BurnRowList } from "./ActionRowList";

export const CraftCard: React.FC<{
  action: ActionForm;
  index: number;
  typeIndex: number;
  itemKeys: string[];
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({ action, index, typeIndex, itemKeys, onUpdate, onDelete }) => (
  <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Label type="default">
        {`Craft - #${String(typeIndex + 1).padStart(3, "0")}`}
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
      Craft, exchange and allow players to unlock something.
    </p>

    {/* Mint section */}
    <div className="space-y-2">
      <Label type="default">Mint</Label>
      <MintRowList
        rows={action.mint}
        itemKeys={itemKeys}
        onChange={(mint) => onUpdate({ mint })}
      />
    </div>

    {/* Burn section */}
    <div className="space-y-2">
      <Label type="default">Burn</Label>
      <BurnRowList
        rows={action.burn}
        itemKeys={itemKeys}
        onChange={(burn) => onUpdate({ burn })}
      />
    </div>
  </InnerPanel>
);
