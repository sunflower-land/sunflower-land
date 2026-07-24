import React, { useContext, useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js-light";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NumberInput } from "components/ui/NumberInput";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import type { InventoryItemName } from "features/game/types/game";
import type { WorkbenchToolName, Tool } from "features/game/types/tools";
import type { ToolShopBuyAllSetting } from "features/game/events/updateToolShopSettings";
import type { ToolPurchasePlan } from "../lib/planToolPurchases";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import { getObjectEntries } from "lib/object";
import { gameAnalytics } from "lib/gameAnalytics";
import { NPC_WEARABLES } from "lib/npcs";

type Props = {
  show: boolean;
  onClose: () => void;
  tools: [WorkbenchToolName, Tool][];
  settings: Partial<Record<WorkbenchToolName, ToolShopBuyAllSetting>>;
  plan: ToolPurchasePlan;
  coins: number;
};

/**
 * A single form that replaces the old two-step "open settings, close, click
 * Buy All, confirm" flow: editing the per-tool amount and confirming the
 * purchase now happen in the same place.
 */
export const ToolBatchBuyModal: React.FC<Props> = ({
  show,
  onClose,
  tools,
  settings,
  plan,
  coins,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  // Maximum affordable amount per tool, as computed by the shared planner -
  // the ceiling a player can raise their draft amount to.
  const maxAmounts = useMemo(() => {
    const amounts: Partial<Record<WorkbenchToolName, number>> = {};
    plan.purchases.forEach((purchase) => {
      amounts[purchase.toolName] = purchase.amount;
    });
    return amounts;
  }, [plan]);

  const [excluded, setExcluded] = useState<Set<WorkbenchToolName>>(new Set());
  const [amountDraft, setAmountDraft] = useState<
    Partial<Record<WorkbenchToolName, number>>
  >({});
  const [failures, setFailures] = useState<WorkbenchToolName[]>([]);

  // The modal stays mounted between opens (only `show` toggles visibility),
  // so the draft needs to be re-synced from the latest plan/settings each
  // time it's reopened - otherwise it keeps showing whatever was in the
  // draft the last time this instance was mounted.
  useEffect(() => {
    if (!show) return;

    const blockedTools = getObjectEntries(settings)
      .filter(([, setting]) => setting?.blocked)
      .map(([toolName]) => toolName);

    setExcluded(new Set(blockedTools));
    setAmountDraft({ ...maxAmounts });
    setFailures([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const toggleExcluded = (toolName: WorkbenchToolName) => {
    const isNowExcluded = !excluded.has(toolName);

    setExcluded((previous) => {
      const next = new Set(previous);
      if (isNowExcluded) {
        next.add(toolName);
      } else {
        next.delete(toolName);
      }
      return next;
    });

    // Persist immediately - exclusions shouldn't be lost if the player
    // closes the modal instead of confirming a purchase.
    gameService.send("toolShop.settingsUpdated", {
      settings: { [toolName]: { blocked: isNowExcluded } },
    });
  };

  const setAmount = (toolName: WorkbenchToolName, value: number) => {
    const max = maxAmounts[toolName] ?? 0;
    const clamped = Math.max(0, Math.min(value, max));
    setAmountDraft((previous) => ({ ...previous, [toolName]: clamped }));
  };

  const purchasesToMake = plan.purchases.filter(
    ({ toolName }) =>
      !excluded.has(toolName) && (amountDraft[toolName] ?? 0) > 0,
  );

  const totalCost = purchasesToMake.reduce((sum, { toolName, price }) => {
    const amount = amountDraft[toolName] ?? 0;
    return sum + price * amount;
  }, 0);

  const totalIngredients = purchasesToMake.reduce(
    (totals, { toolName, ingredients }) => {
      const amount = amountDraft[toolName] ?? 0;
      const purchaseMax = maxAmounts[toolName] ?? 1;
      const ratio = purchaseMax > 0 ? amount / purchaseMax : 0;

      getObjectEntries(ingredients).forEach(
        ([ingredientName, ingredientAmount]) => {
          if (!ingredientAmount) return;

          totals[ingredientName] = (
            totals[ingredientName] ?? new Decimal(0)
          ).add(ingredientAmount.mul(ratio));
        },
      );

      return totals;
    },
    {} as Partial<Record<InventoryItemName, Decimal>>,
  );

  const landTools = tools.filter(([, tool]) => tool.type === "land");
  const waterTools = tools.filter(([, tool]) => tool.type === "water");

  const confirm = () => {
    const purchaseFailures: WorkbenchToolName[] = [];

    purchasesToMake.forEach(({ toolName }) => {
      const amount = amountDraft[toolName] ?? 0;
      if (amount <= 0) return;

      try {
        const result = gameService.send("tool.crafted", {
          tool: toolName,
          amount,
        });

        if (
          toolName === "Axe" &&
          result.context.state.farmActivity?.["Axe Crafted"] === amount
        ) {
          gameAnalytics.trackMilestone({
            event: "Tutorial:AxeCrafted:Completed",
          });
        }
      } catch (error) {
        purchaseFailures.push(toolName);
        // eslint-disable-next-line no-console
        console.error(`[BatchBuyTools] Failed to buy ${toolName}:`, error);
      }
    });

    setFailures(purchaseFailures);
    onClose();
  };

  const renderColumn = (
    title: string,
    columnTools: [WorkbenchToolName, Tool][],
  ) => (
    <OuterPanel className="w-80">
      <Label type="default" className="mb-1.5">
        {title}
      </Label>
      <div className="flex flex-col max-h-[420px] overflow-y-auto scrollable">
        {columnTools.map(([toolName]) => {
          const isExcluded = excluded.has(toolName);
          const maxAmount = maxAmounts[toolName] ?? 0;

          return (
            <InnerPanel
              key={toolName}
              className="flex items-center mb-1 w-full"
            >
              <div className="relative flex-1 min-w-0">
                <ButtonPanel
                  onClick={() => toggleExcluded(toolName)}
                  aria-label={t("tools.excludeFromBatchBuy", { toolName })}
                  className={`flex items-center w-full ${
                    isExcluded ? "grayscale brightness-75" : ""
                  }`}
                >
                  <img
                    src={ITEM_DETAILS[toolName].image}
                    className="h-6 shrink-0"
                  />
                  <span className="text-xs ml-1 whitespace-nowrap truncate">
                    {toolName}
                  </span>
                </ButtonPanel>
                {isExcluded && (
                  <img
                    src={SUNNYSIDE.icons.cancel}
                    className="absolute top-1/2 left-6 -translate-x-1/2 -translate-y-1/2 h-5 w-5"
                  />
                )}
              </div>
              <div className="w-28 ml-1 shrink-0">
                <NumberInput
                  value={new Decimal(amountDraft[toolName] ?? 0)}
                  maxDecimalPlaces={0}
                  onValueChange={(value) =>
                    setAmount(toolName, value.toNumber())
                  }
                  readOnly={isExcluded || maxAmount <= 0}
                />
                <div className="flex gap-1 mt-1">
                  <Button
                    className="w-1/2 text-xxs !py-0 !px-0"
                    disabled={isExcluded || maxAmount <= 0}
                    onClick={() =>
                      setAmount(toolName, Math.floor(maxAmount / 2))
                    }
                  >
                    {t("tools.batchBuyHalf")}
                  </Button>
                  <Button
                    className="w-1/2 text-xxs !py-0 !px-0"
                    disabled={isExcluded || maxAmount <= 0}
                    onClick={() => setAmount(toolName, maxAmount)}
                  >
                    {t("tools.batchBuyMax")}
                  </Button>
                </div>
              </div>
            </InnerPanel>
          );
        })}
      </div>
    </OuterPanel>
  );

  return (
    <Modal show={show} onHide={onClose} dialogClassName="!max-w-[720px]">
      <CloseButtonPanel
        title={t("tools.batchBuy")}
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.blacksmith}
      >
        <div className="flex flex-col p-1">
          <div className="flex items-start justify-center space-x-4">
            {renderColumn(t("landTools"), landTools)}
            {renderColumn(t("waterTools"), waterTools)}
          </div>
          {failures.length > 0 && (
            <Label type="danger" className="mt-2">
              {t("tools.buyAllPartialFailure", {
                tools: failures.join(", "),
              })}
            </Label>
          )}
          <Label type="default" className="mt-2 mb-1.5">
            {t("tools.batchBuyTotalCost")}
          </Label>
          <div className="flex flex-wrap items-center gap-2 px-1">
            <div className="flex items-center">
              <img src={SUNNYSIDE.ui.coins} className="h-6 mr-1" />
              <span className="text-xs">{formatNumber(totalCost)}</span>
            </div>
            {getObjectEntries(totalIngredients).map(
              ([ingredientName, ingredientAmount]) => (
                <div key={ingredientName} className="flex items-center">
                  <img
                    src={ITEM_DETAILS[ingredientName].image}
                    className="h-6 mr-1"
                  />
                  <span className="text-xs">
                    {formatNumber(ingredientAmount ?? new Decimal(0))}
                  </span>
                </div>
              ),
            )}
          </div>
          <Button
            onClick={confirm}
            className="mt-2"
            disabled={purchasesToMake.length === 0 || totalCost > coins}
          >
            {t("tools.batchBuy")}
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
