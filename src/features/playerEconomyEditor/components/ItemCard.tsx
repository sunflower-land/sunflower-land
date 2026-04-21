import React, { useRef } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { TextInput } from "components/ui/TextInput";
import { NumberInput } from "components/ui/NumberInput";
import Switch from "components/ui/Switch";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { resolveMinigameCdnImageUrl } from "features/minigame/lib/resolveMinigameCdnImageUrl";
import type { ItemForm } from "../lib/types";
import { FieldRow } from "./FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const DARK_LABEL = "text-[#3e2731]";

export const ItemCard: React.FC<{
  item: ItemForm;
  index: number;
  onUpdate: (next: Partial<ItemForm>) => void;
  onDelete: () => void;
  onUpload: (file: File) => void;
}> = ({ item, index, onUpdate, onDelete, onUpload }) => {
  const { t } = useAppTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewSrc = item.image.trim()
    ? resolveMinigameCdnImageUrl(item.image.trim())
    : SUNNYSIDE.icons.expression_confused;
  const uploading = item.imageUploading === true;

  return (
    <InnerPanel className="p-3 space-y-2">
      {/* Card header: index badge + delete X */}
      <div className="flex items-center justify-between">
        <Label type="default">
          {item.id !== undefined
            ? `${item.name.trim() || "Unnamed"} - #${item.id}`
            : `New item (${String(index + 1).padStart(2, "0")})`}
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
        <span className="text-xs text-white ml-1">
          {t("playerEconomyEditor.itemCard.image")}
        </span>
        <div className="flex items-center gap-2">
          <div
            className="relative flex-shrink-0 flex items-center justify-center"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              height: `${PIXEL_SCALE * 22}px`,
            }}
          >
            <InnerPanel
              className={classNames(
                "w-full h-full flex items-center justify-center overflow-hidden relative",
                uploading && "animate-pulse opacity-70",
              )}
            >
              <img
                src={previewSrc}
                alt={item.name || item.key || "item"}
                className="w-full h-full object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              {uploading && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/40"
                  aria-hidden
                >
                  <span className="text-[7px] leading-tight text-white font-secondary text-center px-0.5">
                    {`Uploading`}
                  </span>
                </div>
              )}
            </InnerPanel>
          </div>

          <div className="flex-1 space-y-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/webp,image/gif,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  onUpload(file);
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              variant="secondary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-xs">
                {uploading ? "Uploading…" : "Upload Image"}
              </span>
            </Button>
          </div>
        </div>
        {item.uploadError && <Label type="danger">{item.uploadError}</Label>}
      </div>

      <FieldRow label="Initial balance">
        <NumberInput
          value={new Decimal(item.initialBalance ?? 0)}
          maxDecimalPlaces={0}
          onValueChange={(v) =>
            onUpdate({
              initialBalance: Math.max(0, Math.floor(v.toNumber())),
            })
          }
        />
      </FieldRow>
      <p className="text-[10px] opacity-60 -mt-1 ml-1">
        {t("playerEconomyEditor.itemCard.initialBalanceHelp")}
      </p>

      {/* Max owned toggle + input */}
      <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-2">
        <div className="flex items-center gap-x-2 shrink-0">
          <button
            type="button"
            className="shrink-0 flex items-center"
            onClick={() => {
              if ((item.max ?? 0) > 0) {
                onUpdate({ max: 0 });
              } else {
                onUpdate({ max: 1 });
              }
            }}
            aria-pressed={(item.max ?? 0) > 0}
          >
            <img
              src={
                (item.max ?? 0) > 0
                  ? SUNNYSIDE.ui.turn_off
                  : SUNNYSIDE.ui.turn_on
              }
              alt=""
              className="w-16"
              style={{ imageRendering: "pixelated" }}
            />
          </button>
          <span className={`text-xs shrink-0 min-w-[5.5rem] ${DARK_LABEL}`}>
            {"Max owned"}
          </span>
        </div>
        <div className="min-w-0 flex-1 flex justify-end">
          <div className="w-full min-w-[120px] max-w-[220px]">
            <NumberInput
              value={new Decimal(item.max ?? 0)}
              maxDecimalPlaces={0}
              readOnly={(item.max ?? 0) <= 0}
              onValueChange={(v) =>
                onUpdate({
                  max: Math.max(0, Math.floor(v.toNumber())),
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Global supply cap (economy-wide) */}
      <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-2">
        <div className="flex items-center gap-x-2 shrink-0">
          <button
            type="button"
            className="shrink-0 flex items-center"
            onClick={() => {
              if ((item.globalSupplyCap ?? 0) > 0) {
                onUpdate({ globalSupplyCap: 0 });
              } else {
                onUpdate({ globalSupplyCap: 1 });
              }
            }}
            aria-pressed={(item.globalSupplyCap ?? 0) > 0}
          >
            <img
              src={
                (item.globalSupplyCap ?? 0) > 0
                  ? SUNNYSIDE.ui.turn_off
                  : SUNNYSIDE.ui.turn_on
              }
              alt=""
              className="w-16"
              style={{ imageRendering: "pixelated" }}
            />
          </button>
          <span className={`text-xs shrink-0 min-w-[5.5rem] ${DARK_LABEL}`}>
            {t("playerEconomyEditor.itemCard.globalSupplyCap")}
          </span>
        </div>
        <div className="min-w-0 flex-1 flex justify-end">
          <div className="w-full min-w-[120px] max-w-[220px]">
            <NumberInput
              value={new Decimal(item.globalSupplyCap ?? 0)}
              maxDecimalPlaces={0}
              readOnly={(item.globalSupplyCap ?? 0) <= 0}
              onValueChange={(v) =>
                onUpdate({
                  globalSupplyCap: Math.max(0, Math.floor(v.toNumber())),
                })
              }
            />
          </div>
        </div>
      </div>
      <p className="text-[10px] opacity-60 -mt-1 ml-1">
        {t("playerEconomyEditor.itemCard.globalSupplyCapHelp")}
      </p>

      {/* Is Tradeable? toggle */}
      <Switch
        checked={item.tradeable}
        onChange={() => onUpdate({ tradeable: !item.tradeable })}
        label="Is Tradeable?"
      />
      <Switch
        checked={item.trophy}
        onChange={() => onUpdate({ trophy: !item.trophy })}
        label={t("playerEconomyEditor.itemCard.trophy")}
      />
      <Switch
        checked={item.isVisible}
        onChange={() => onUpdate({ isVisible: !item.isVisible })}
        label={t("playerEconomyEditor.itemCard.visibleInInventory")}
      />
    </InnerPanel>
  );
};
