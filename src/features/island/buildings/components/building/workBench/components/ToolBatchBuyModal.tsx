import React, { useContext, useEffect, useMemo, useState } from "react";
import Decimal from "decimal.js-light";

import { Modal } from "components/ui/Modal";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NumberInput } from "components/ui/NumberInput";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Checkbox } from "components/ui/Checkbox";
import { InnerPanel } from "components/ui/Panel";

import { Context } from "features/game/GameProvider";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import type { Inventory, InventoryItemName } from "features/game/types/game";
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
  stock: Inventory;
};

type ToolRowProps = {
  toolName: WorkbenchToolName;
  checked: boolean;
  amount: number;
  maxAmount: number;
  stockAmount: number;
  onToggle: () => void;
  onAmountChange: (value: number) => void;
};

/**
 * One tool entry as a two-line card: icon + name with the include checkbox
 * on the first line, amount input and 50%/Max controls on the second. Shows
 * a hint underneath when the affordable amount falls short of the full
 * stock, mirroring the single-tool "Craft All" hint in Tools.tsx.
 */
const ToolRow: React.FC<ToolRowProps> = ({
  toolName,
  checked,
  amount,
  maxAmount,
  stockAmount,
  onToggle,
  onAmountChange,
}) => {
  const { t } = useAppTranslation();
  const disabled = !checked || maxAmount <= 0;

  return (
    <InnerPanel className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <div
          className={`flex flex-1 min-w-0 items-center ${
            checked ? "" : "grayscale brightness-75"
          }`}
        >
          <img src={ITEM_DETAILS[toolName].image} className="h-6 shrink-0" />
          <span className="text-xs ml-1 truncate">
            {getTranslatedItemName(toolName)}
          </span>
        </div>
        <div className="shrink-0">
          <Checkbox
            checked={checked}
            onChange={onToggle}
            aria-label={t("tools.includeInBatchBuy", {
              toolName: getTranslatedItemName(toolName),
            })}
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex-1 min-w-0">
          <NumberInput
            value={new Decimal(amount)}
            maxDecimalPlaces={0}
            onValueChange={(value) => onAmountChange(value.toNumber())}
            readOnly={disabled}
          />
        </div>
        <Button
          className="w-12 shrink-0 text-xxs !py-0 !px-0"
          disabled={disabled}
          onClick={() => onAmountChange(Math.floor(maxAmount / 2))}
        >
          {t("tools.batchBuyHalf")}
        </Button>
        <Button
          className="w-12 shrink-0 text-xxs !py-0 !px-0"
          disabled={disabled}
          onClick={() => onAmountChange(maxAmount)}
        >
          {t("tools.batchBuyMax")}
        </Button>
      </div>
      {maxAmount < stockAmount && (
        <p className="text-xxs text-center">
          {t("tools.insufficientFundsForStock", { stockAmount })}
        </p>
      )}
    </InnerPanel>
  );
};

/**
 * Titled group of tool rows. Rows scroll within the section on desktop
 * (two columns side by side); on mobile the sections stack and the shared
 * container in the modal body scrolls instead.
 */
const ToolSection: React.FC<React.PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <div className="flex flex-col sm:w-1/2 sm:min-w-0">
    <Label type="default" className="mb-1.5 shrink-0">
      {title}
    </Label>
    <div className="flex flex-col gap-1 scrollable sm:flex-1 sm:min-h-0 sm:overflow-y-auto sm:pr-1">
      {children}
    </div>
  </div>
);

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
  stock,
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
  const [confirmBatchBuyModal, showConfirmBatchBuyModal] = useState(false);

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
    showConfirmBatchBuyModal(false);
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

  const costBreakdown = (
    <>
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
    </>
  );

  const buyAllTools = () => {
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
    showConfirmBatchBuyModal(false);
    onClose();
  };

  const renderRows = (columnTools: [WorkbenchToolName, Tool][]) =>
    columnTools.map(([toolName]) => (
      <ToolRow
        key={toolName}
        toolName={toolName}
        checked={!excluded.has(toolName)}
        amount={amountDraft[toolName] ?? 0}
        maxAmount={maxAmounts[toolName] ?? 0}
        stockAmount={(stock[toolName] ?? new Decimal(0))
          .toDecimalPlaces(0, Decimal.ROUND_DOWN)
          .toNumber()}
        onToggle={() => toggleExcluded(toolName)}
        onAmountChange={(value) => setAmount(toolName, value)}
      />
    ));

  return (
    <Modal show={show} onHide={onClose} dialogClassName="!max-w-[720px]">
      {/* !max-h-none disables CloseButtonPanel's own 90vh scroll - the body
          below is the single height authority, so no outer scrollbar can
          appear. On mobile the body is a fixed height with the sections area
          flexing/scrolling and the footer pinned; on desktop the columns get
          an explicit height instead. */}
      <CloseButtonPanel
        title={t("tools.batchBuy")}
        onClose={onClose}
        className="!max-h-none"
      >
        <div className="flex flex-col p-1 h-[calc(100dvh_-_120px)] sm:h-auto">
          <div className="flex flex-col gap-2 scrollable flex-1 min-h-0 overflow-y-auto pr-1 sm:flex-row sm:flex-none sm:overflow-visible sm:h-[min(420px,60vh)] sm:pr-0">
            <ToolSection title={t("landTools")}>
              {renderRows(landTools)}
            </ToolSection>
            <ToolSection title={t("waterTools")}>
              {renderRows(waterTools)}
            </ToolSection>
          </div>

          <InnerPanel className="flex flex-col mt-2 shrink-0">
            {failures.length > 0 && (
              <Label type="danger" className="mb-1.5">
                {t("tools.buyAllPartialFailure", {
                  tools: failures
                    .map((toolName) => getTranslatedItemName(toolName))
                    .join(", "),
                })}
              </Label>
            )}
            <Label type="default" className="mb-1.5">
              {t("tools.batchBuyTotalCost")}
            </Label>
            <div className="flex flex-wrap items-center gap-2 px-1 mb-2">
              {costBreakdown}
            </div>
            <Button
              onClick={() => showConfirmBatchBuyModal(true)}
              disabled={purchasesToMake.length === 0 || totalCost > coins}
            >
              {t("tools.batchBuy")}
            </Button>
          </InnerPanel>
        </div>
        <ConfirmationModal
          show={confirmBatchBuyModal}
          onHide={() => showConfirmBatchBuyModal(false)}
          messages={[
            t("confirmation.buyAllTools", {
              toolTypes: purchasesToMake.length,
            }),
          ]}
          bodyContent={
            <div className="flex flex-wrap items-center gap-2 w-full mb-1">
              {costBreakdown}
            </div>
          }
          onCancel={() => showConfirmBatchBuyModal(false)}
          onConfirm={buyAllTools}
          confirmButtonLabel={t("tools.batchBuy")}
          bumpkinParts={NPC_WEARABLES.blacksmith}
          disabled={purchasesToMake.length === 0 || totalCost > coins}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
