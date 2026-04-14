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
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import random from "assets/icons/random.webp";
import randomActive from "assets/icons/random_active.webp";
const CUSTOM_REQUIRE_PLACEHOLDER: ActionForm["require"][number] = {
  token: "",
  amount: 1,
};

const DARK_LABEL = "text-[#3e2731]";

function normalizeRequires(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

export const CustomCard: React.FC<{
  action: ActionForm;
  index: number;
  peerIds: string[];
  itemKeys: string[];
  getItemOptionLabel?: (itemId: string) => string;
  onUpdate: (next: Partial<ActionForm>) => void;
  onDelete: () => void;
}> = ({
  action,
  index,
  peerIds,
  itemKeys,
  getItemOptionLabel,
  onUpdate,
  onDelete,
}) => {
  const { t } = useAppTranslation();
  useLayoutEffect(() => {
    if (action.require.length === 0) {
      onUpdate({ require: [{ ...CUSTOM_REQUIRE_PLACEHOLDER }] });
    }
  }, [action.require.length, onUpdate]);

  const requireToken = action.require[0]?.token ?? "";
  const requireAmount = Math.max(1, Math.floor(action.require[0]?.amount ?? 1));

  const requiresOptions = useMemo(() => {
    const r = requireToken.trim();
    const base = itemKeys;
    if (r && !base.includes(r)) return [...base, r];
    return base;
  }, [itemKeys, requireToken]);

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
  const requiresPanelOn = action.customRequiresUiEnabled === true;
  const waitEnabled = (produceRule.msToComplete ?? 0) > 0;
  const cooldownEnabled = (action.customCooldownSeconds ?? 0) > 0;

  useLayoutEffect(() => {
    const p0 = action.produce[0];
    if (!p0 || !requiresPanelOn || !waitEnabled) return;
    const req = requireToken.trim();
    if (!req) return;
    if (produce0Requires === req) return;
    onUpdate({ produce: [{ ...p0, requires: req }] });
  }, [
    requireToken,
    produce0Requires,
    action.produce,
    onUpdate,
    requiresPanelOn,
    waitEnabled,
  ]);

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

  const setDropChances = (enabled: boolean) => {
    if (enabled) {
      onUpdate({
        customMintDropChances: true,
        customMint: action.customMint.map((r) => {
          const amt = Math.max(0, Math.floor(r.min ?? 0));
          return {
            ...r,
            min: amt,
            max: amt,
            chance: r.chance ?? 100,
          };
        }),
      });
    } else {
      onUpdate({
        customMintDropChances: false,
        customMint: action.customMint.map((r) => ({
          ...r,
          max: Math.max(r.min, r.max),
          chance: 100,
        })),
      });
    }
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
          alt=""
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <Label type="default">{t("playerEconomyEditor.custom.mint")}</Label>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs underline text-[#3e2731] hover:opacity-80"
            onClick={() => setDropChances(!action.customMintDropChances)}
          >
            <img
              src={action.customMintDropChances ? randomActive : random}
              alt=""
              className="shrink-0 pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
                height: `${PIXEL_SCALE * 12}px`,
                imageRendering: "pixelated",
                objectFit: "contain",
              }}
            />
            {action.customMintDropChances
              ? t("playerEconomyEditor.custom.normalMode")
              : t("playerEconomyEditor.custom.dropChances")}
          </button>
        </div>
        <CustomMintRowList
          rows={action.customMint}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          dropChances={action.customMintDropChances === true}
          onChange={(customMint) => onUpdate({ customMint })}
        />
      </div>

      <div className="space-y-2">
        <Label type="default">{t("playerEconomyEditor.custom.burn")}</Label>
        <CustomBurnRowList
          rows={action.customBurn}
          itemKeys={itemKeys}
          getItemOptionLabel={getItemOptionLabel}
          onChange={(customBurn) => onUpdate({ customBurn })}
        />
      </div>

      <div className="space-y-3 border-t border-white/10 pt-3">
        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-2">
          <div className="flex items-center gap-x-2 shrink-0">
            <button
              type="button"
              className="shrink-0 flex items-center"
              onClick={() => {
                if (cooldownEnabled) {
                  onUpdate({ customCooldownSeconds: 0 });
                } else {
                  onUpdate({ customCooldownSeconds: 1 });
                }
              }}
              aria-pressed={cooldownEnabled}
            >
              <img
                src={
                  cooldownEnabled ? SUNNYSIDE.ui.turn_off : SUNNYSIDE.ui.turn_on
                }
                alt=""
                className="w-16"
                style={{ imageRendering: "pixelated" }}
              />
            </button>
            <span className={`text-xs shrink-0 min-w-[10rem] ${DARK_LABEL}`}>
              {t("playerEconomyEditor.custom.cooldownRow")}
            </span>
          </div>
          <div className="min-w-0 flex-1 flex justify-end">
            <div className="w-full min-w-[120px] max-w-[220px]">
              <NumberInput
                value={new Decimal(action.customCooldownSeconds ?? 0)}
                maxDecimalPlaces={0}
                readOnly={!cooldownEnabled}
                onValueChange={(v) =>
                  onUpdate({
                    customCooldownSeconds: Math.max(
                      0,
                      Math.floor(v.toNumber()),
                    ),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-2">
          <div className="flex items-center gap-x-2 shrink-0">
            <button
              type="button"
              className="shrink-0 flex items-center"
              onClick={() => {
                if (requiresPanelOn) {
                  onUpdate({
                    customRequiresUiEnabled: false,
                    require: [{ token: "", amount: 1 }],
                    produce: action.produce[0]
                      ? [{ ...action.produce[0], requires: "" }]
                      : [],
                  });
                } else {
                  onUpdate({ customRequiresUiEnabled: true });
                }
              }}
              aria-pressed={requiresPanelOn}
            >
              <img
                src={
                  requiresPanelOn ? SUNNYSIDE.ui.turn_off : SUNNYSIDE.ui.turn_on
                }
                alt=""
                className="w-16"
                style={{ imageRendering: "pixelated" }}
              />
            </button>
            <span className={`text-xs shrink-0 min-w-[5.5rem] ${DARK_LABEL}`}>
              {t("playerEconomyEditor.custom.requireLabel")}
            </span>
          </div>
          <div className="min-w-0 flex-1 flex flex-wrap items-center justify-end gap-x-2 gap-y-2">
            <div className="min-w-[140px] w-full max-w-[240px] sm:max-w-[200px]">
              <Dropdown
                options={requiresOptions}
                value={requireToken.trim() || undefined}
                disabled={!requiresPanelOn}
                onChange={(v) =>
                  onUpdate({
                    require: [{ token: v, amount: requireAmount }],
                  })
                }
                placeholder={t(
                  "playerEconomyEditor.custom.requiresPlaceholder",
                )}
                showSearch
                getOptionLabel={getItemOptionLabel}
              />
            </div>
            <div className="w-1/2 sm:w-[60px] shrink-0">
              <NumberInput
                value={new Decimal(requireAmount)}
                maxDecimalPlaces={0}
                readOnly={!requiresPanelOn}
                onValueChange={(v) =>
                  onUpdate({
                    require: [
                      {
                        token: requireToken,
                        amount: Math.max(1, Math.floor(v.toNumber())),
                      },
                    ],
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-2">
            <div className="flex items-center gap-x-2 shrink-0">
              <button
                type="button"
                className="shrink-0 flex items-center"
                onClick={() => {
                  if (waitEnabled) {
                    updateProduce({ msToComplete: 0 });
                  } else {
                    updateProduce({ msToComplete: 60_000 });
                  }
                }}
                aria-pressed={waitEnabled}
              >
                <img
                  src={
                    waitEnabled ? SUNNYSIDE.ui.turn_off : SUNNYSIDE.ui.turn_on
                  }
                  alt=""
                  className="w-16"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>
              <span className={`text-xs shrink-0 min-w-[10rem] ${DARK_LABEL}`}>
                {t("playerEconomyEditor.custom.waitRow")}
              </span>
            </div>
            <div className="min-w-0 flex-1 flex justify-end">
              <div className="w-full min-w-[120px] max-w-[220px]">
                <NumberInput
                  value={
                    new Decimal(
                      produceRule.msToComplete
                        ? produceRule.msToComplete / 1000
                        : 0,
                    )
                  }
                  maxDecimalPlaces={0}
                  readOnly={!waitEnabled}
                  icon={SUNNYSIDE.icons.timer}
                  onValueChange={(v) =>
                    updateProduce({
                      msToComplete: Math.max(0, v.toNumber()) * 1000,
                    })
                  }
                />
              </div>
            </div>
          </div>
          {waitEnabled ? (
            <p className={`text-xs leading-snug ${DARK_LABEL}`}>
              {t("playerEconomyEditor.custom.waitGeneratorCollectHint")}
            </p>
          ) : null}
        </div>
      </div>
    </InnerPanel>
  );
};
