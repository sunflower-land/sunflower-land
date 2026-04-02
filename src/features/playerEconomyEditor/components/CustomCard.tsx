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
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const { t } = useAppTranslation();
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
        {t("playerEconomyEditor.custom.hint")}
      </p>

      <div className="space-y-2">
        <Label type="default">{t("playerEconomyEditor.custom.mint")}</Label>
        <CustomMintRowList
          rows={action.customMint}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(customMint) => onUpdate({ customMint })}
        />
        <p className="text-[10px] opacity-60">
          {t("playerEconomyEditor.custom.mintHint")}
        </p>
      </div>

      <div className="space-y-2">
        <Label type="default">{t("playerEconomyEditor.custom.burn")}</Label>
        <CustomBurnRowList
          rows={action.customBurn}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(customBurn) => onUpdate({ customBurn })}
        />
        <p className="text-[10px] opacity-60">
          {t("playerEconomyEditor.custom.burnHint")}
        </p>
      </div>

      <div className="space-y-2">
        <Label type="default">{t("playerEconomyEditor.custom.requires")}</Label>
        <p className="text-[10px] opacity-60 -mt-1">
          {t("playerEconomyEditor.custom.requiresHint")}
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
        {t("playerEconomyEditor.custom.dailyCapHint")}
      </p>
    </InnerPanel>
  );
};
