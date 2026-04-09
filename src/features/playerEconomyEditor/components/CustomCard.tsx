import React, { useLayoutEffect, useMemo } from "react";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RuleActionIdLabel } from "./RuleActionIdLabel";
import { NumberInput } from "components/ui/NumberInput";
import { Dropdown } from "components/ui/Dropdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { ActionForm, ProduceRuleForm } from "../lib/types";
import { CustomMintRowList, CustomBurnRowList } from "./ActionRowList";
import { FieldRow } from "./FieldRow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const CUSTOM_REQUIRE_PLACEHOLDER: ActionForm["require"][number] = {
  token: "",
  amount: 1,
};

function normalizeRequires(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

export const CustomCard: React.FC<{
  action: ActionForm;
  index: number;
  peerIds: string[];
  itemKeys: string[];
  /** Items marked as generators — lane picker for timed production. */
  generatorItemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({
  action,
  index,
  peerIds,
  itemKeys,
  generatorItemKeys,
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

  const requiresOptions = useMemo(() => {
    const r = requireToken.trim();
    const base = generatorItemKeys;
    if (r && !base.includes(r)) return [...base, r];
    return base;
  }, [generatorItemKeys, requireToken]);

  const produceRule: ProduceRuleForm = action.produce[0]
    ? {
        ...action.produce[0],
        requires: normalizeRequires(action.produce[0].requires),
      }
    : {
        token: "",
        msToComplete: 0,
        limit: undefined,
        requires: requireToken.trim(),
      };

  const produce0Requires = normalizeRequires(action.produce[0]?.requires);
  useLayoutEffect(() => {
    const p0 = action.produce[0];
    const req = requireToken.trim();
    if (!p0) return;
    if (produce0Requires === req) return;
    onUpdate({ produce: [{ ...p0, requires: req }] });
  }, [requireToken, produce0Requires, action.produce, onUpdate]);

  /** Timed jobs use the first mint row’s item as the generator output key (no separate output picker). */
  useLayoutEffect(() => {
    const p0 = action.produce[0];
    if (!p0 || (p0.msToComplete ?? 0) <= 0) return;
    const first =
      action.customMint.find((m) => m.token.trim())?.token.trim() ?? "";
    if (!first || p0.token === first) return;
    onUpdate({ produce: [{ ...p0, token: first }] });
  }, [action.customMint, action.produce, onUpdate]);

  const updateProduce = (next: Partial<ProduceRuleForm>) => {
    const updated = { ...produceRule, ...next };
    onUpdate({ produce: [updated] });
  };

  return (
    <InnerPanel key={`action-${index}`} className="p-3 space-y-3">
      <div className="flex items-center justify-between gap-1">
        <RuleActionIdLabel
          actionId={action.id}
          peerIds={peerIds}
          onCommit={(id) => onUpdate({ id })}
        />
        <img
          src={SUNNYSIDE.icons.close}
          className="cursor-pointer hover:brightness-75 shrink-0"
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
        <p className="text-[10px] opacity-60">
          {t("playerEconomyEditor.custom.mintChanceHint")}
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
            options={requiresOptions}
            value={requireToken.trim() || undefined}
            onChange={(v) =>
              onUpdate({
                require: [{ token: v, amount: 1 }],
              })
            }
            placeholder={t("playerEconomyEditor.custom.requiresPlaceholder")}
            showSearch
            getOptionLabel={getItemOptionLabel}
          />
        </FieldRow>
        <p className="text-[10px] opacity-60">
          {t("playerEconomyEditor.custom.generatorLaneHint")}
        </p>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-3">
        <Label type="default">
          {t("playerEconomyEditor.custom.timedOutputTitle")}
        </Label>
        <p className="text-[10px] opacity-60 -mt-1">
          {t("playerEconomyEditor.custom.timedOutputHint")}
        </p>
        <FieldRow label={t("playerEconomyEditor.custom.secondsToProduceLabel")}>
          <NumberInput
            value={
              new Decimal(
                produceRule.msToComplete ? produceRule.msToComplete / 1000 : 0,
              )
            }
            maxDecimalPlaces={0}
            icon={SUNNYSIDE.icons.timer}
            onValueChange={(v) =>
              updateProduce({
                msToComplete: Math.max(0, v.toNumber()) * 1000,
              })
            }
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
