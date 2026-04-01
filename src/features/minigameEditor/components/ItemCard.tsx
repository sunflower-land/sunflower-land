import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import Switch from "components/ui/Switch";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ItemForm } from "../lib/types";
import { FieldRow } from "./FieldRow";

export const ItemCard: React.FC<{
  item: ItemForm;
  index: number;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpdate: (next: Partial<ItemForm>) => void;
  onDelete: () => void;
  onUpload: (file: File) => void;
}> = ({ item, index, fileRef, onUpdate, onDelete, onUpload }) => (
  <InnerPanel className="p-3 space-y-2">
    {/* Card header: index badge + delete X */}
    <div className="flex items-center justify-between">
      <Label type="default">#{String(index + 1).padStart(3, "0")}</Label>
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

    {/* Name */}
    <FieldRow label="Name">
      <TextInput
        value={item.name}
        onValueChange={(v) => onUpdate({ name: v })}
        placeholder="Golden Nugget"
      />
    </FieldRow>

    {/* Description */}
    <FieldRow label="Description">
      <TextInput
        value={item.description}
        onValueChange={(v) => onUpdate({ description: v })}
        placeholder="A shiny collectible..."
      />
    </FieldRow>

    {/* Image: preview thumbnail + upload button */}
    <div className="space-y-1">
      <span className="text-xs text-white ml-1">Image</span>
      <div className="flex items-center gap-2">
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <InnerPanel className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={item.image || SUNNYSIDE.icons.expression_confused}
              alt={item.name || item.key || "item"}
              className="w-full h-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </InnerPanel>
        </div>

        <div className="flex-1 space-y-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/webp,image/gif,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              if (file) onUpload(file);
            }}
          />
          <Button
            variant="secondary"
            onClick={() => (fileRef.current as HTMLInputElement | null)?.click()}
          >
            <span className="text-xs">Upload Image</span>
          </Button>
        </div>
      </div>
      {item.uploadError && <Label type="danger">{item.uploadError}</Label>}
    </div>

    {/* Is Tradeable? toggle */}
    <Switch
      checked={item.tradeable}
      onChange={() => onUpdate({ tradeable: !item.tradeable })}
      label="Is Tradeable?"
    />
  </InnerPanel>
);
