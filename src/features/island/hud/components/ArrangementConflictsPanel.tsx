import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import type { InventoryItemName } from "features/game/types/game";
import type { ArrangementConflict } from "features/game/events/landExpansion/applyArrangement";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * The server refused the landscaping draft. Lists every offending item (the
 * same items MovableComponent tints red) so the player can fix and save again.
 */
export const ArrangementConflictsPanel: React.FC<{
  conflicts: ArrangementConflict[];
  onDismiss: () => void;
}> = ({ conflicts, onDismiss }) => {
  const { t } = useAppTranslation();

  const describe = (conflict: ArrangementConflict): string => {
    switch (conflict.code) {
      case "COLLISION":
        return t("landscaping.conflict.COLLISION", {
          with: conflict.with?.name ?? "",
        });
      case "OFF_LAND":
        return t("landscaping.conflict.OFF_LAND");
      case "REMOVAL_BLOCKED":
        return t("landscaping.conflict.REMOVAL_BLOCKED");
      case "NOT_REMOVABLE":
        return t("landscaping.conflict.NOT_REMOVABLE");
      case "NOT_OWNED":
        return t("landscaping.conflict.NOT_OWNED");
      case "PLACED_ELSEWHERE":
        return t("landscaping.conflict.PLACED_ELSEWHERE");
      case "UNKNOWN_ITEM":
      default:
        return t("landscaping.conflict.UNKNOWN_ITEM");
    }
  };

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
      style={{ top: `${PIXEL_SCALE * 3}px`, width: "min(90vw, 320px)" }}
    >
      <Label type="danger" className="mb-1">
        {t("landscaping.conflictsTitle", { count: conflicts.length })}
      </Label>
      <InnerPanel className="w-full">
        <div className="flex flex-col gap-1 p-1 max-h-40 overflow-y-auto scrollable">
          {conflicts.map((conflict, i) => {
            const image =
              ITEM_DETAILS[conflict.name as InventoryItemName]?.image;
            return (
              <div
                key={`${conflict.code}-${conflict.id}-${i}`}
                className="flex items-center gap-2 text-xs"
              >
                {image && (
                  <img src={image} className="w-5 h-5 object-contain" />
                )}
                <span className="flex-1">
                  {conflict.name}
                  {conflict.coordinates
                    ? ` (${conflict.coordinates.x}, ${conflict.coordinates.y})`
                    : ""}
                  {": "}
                  {describe(conflict)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-xxs">{t("landscaping.conflictsHint")}</span>
          <img
            src={SUNNYSIDE.icons.close}
            className="cursor-pointer"
            style={{ width: `${PIXEL_SCALE * 11}px` }}
            onClick={onDismiss}
          />
        </div>
      </InnerPanel>
    </div>
  );
};
