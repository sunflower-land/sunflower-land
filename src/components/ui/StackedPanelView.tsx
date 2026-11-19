import React, { type ReactNode } from "react";
import type Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

/** One pickable tile in a `StackedPanelView` or `StackedOptionGrid`. */
export type StackedOption = {
  id: string;
  image?: string;
  count?: Decimal;
  hideCount?: boolean;
  selected?: boolean;
  onClick?: () => void;
  /** The corner badge: ✓ the player can afford it, ✗ they can't. None when unset. */
  status?: "ready" | "missing";
  /** Under the tile, e.g. its cost. */
  caption?: string;
  /** Greyed out and not clickable. */
  disabled?: boolean;
};

/** A danger message above the action, optionally with an icon. */
export type StackedError = string | { text: string; icon: string };

/** A panel under the first one, with an optional title label. */
export type StackedPanel = {
  id: string;
  title?: string;
  content: ReactNode;
};

const STATUS_BADGE = {
  ready: SUNNYSIDE.icons.confirm,
  missing: SUNNYSIDE.icons.cancel,
};

/**
 * A scrolling grid of option tiles. `StackedPanelView` uses it for its main
 * options; use it directly for a second pick inside a panel (a recipe
 * variant, an ingredient).
 */
export const StackedOptionGrid: React.FC<{ options: StackedOption[] }> = ({
  options,
}) => (
  <div className="flex flex-wrap gap-1 px-1 pb-1 overflow-auto max-h-48 scrollable items-start">
    {options.map((option) => (
      <div
        key={option.id}
        className="flex flex-col items-center shrink-0 max-w-[72px]"
      >
        <Box
          image={option.image}
          count={option.count}
          hideCount={option.hideCount}
          isSelected={option.selected}
          onClick={option.onClick}
          disabled={option.disabled}
          secondaryImage={option.status && STATUS_BADGE[option.status]}
        />
        {option.caption && (
          <span className="text-xxs leading-tight">{option.caption}</span>
        )}
      </div>
    ))}
  </div>
);

/**
 * The props for the component.
 * @param notice Shown at the top of the first panel, above the title.
 * @param title The first panel's label: the selected item, or a "pick one" prompt.
 * @param titleIcon The label's icon.
 * @param selected Shows the title as an `info` label (something is picked) instead of `default`.
 * @param details Under the title: buff labels, a description, notes.
 * @param options The tiles to pick from.
 * @param belowOptions In the first panel, under the options.
 * @param panels More panels, in order (a second pick, requirements, outputs). Falsy entries are skipped.
 * @param errors Danger messages above the action. Falsy entries are skipped.
 * @param action The button(s).
 * @param footer After the action, e.g. a confirmation modal.
 */
interface Props {
  notice?: ReactNode;
  title: string;
  titleIcon?: string;
  selected?: boolean;
  details?: ReactNode;
  options: StackedOption[];
  belowOptions?: ReactNode;
  panels?: (StackedPanel | false | null | undefined)[];
  errors?: (StackedError | false | null | undefined)[];
  action?: ReactNode;
  footer?: ReactNode;
}

/**
 * Pick one option, see what it needs, then act, as stacked panels: the
 * layout of the Aging Shed racks. Use it where `SplitScreenView`'s side
 * detail pane doesn't fit, e.g. when picking needs a second choice or the
 * requirements are long.
 *
 * ```tsx
 * <StackedPanelView
 *   title={selected ? getTranslatedItemName(selected) : t("pick.one")}
 *   titleIcon={selected && ITEM_DETAILS[selected].image}
 *   selected={!!selected}
 *   details={<p className="text-xs ml-1">{description}</p>}
 *   options={items.map((item) => ({
 *     id: item,
 *     image: ITEM_DETAILS[item].image,
 *     count: inventory[item],
 *     selected: selected === item,
 *     onClick: () => setSelected(item),
 *     status: canAfford(item) ? "ready" : "missing",
 *   }))}
 *   panels={[
 *     selected && {
 *       id: "requirements",
 *       title: t("requirements"),
 *       content: <div className="flex flex-wrap p-2 gap-2">{labels}</div>,
 *     },
 *   ]}
 *   errors={[validationMessage]}
 *   action={<Button disabled={!canStart} onClick={start}>{t("start")}</Button>}
 * />
 * ```
 */
export const StackedPanelView: React.FC<Props> = ({
  notice,
  title,
  titleIcon,
  selected = false,
  details,
  options,
  belowOptions,
  panels = [],
  errors = [],
  action,
  footer,
}) => {
  return (
    <>
      <InnerPanel className="mb-1">
        {notice}
        <div className="flex flex-col gap-1 mb-1">
          <Label
            type={selected ? "info" : "default"}
            className="text-xs ml-1"
            icon={titleIcon}
          >
            {title}
          </Label>
          {details}
        </div>
        <StackedOptionGrid options={options} />
        {belowOptions}
      </InnerPanel>

      {panels.map(
        (panel) =>
          panel && (
            <InnerPanel key={panel.id} className="mb-1">
              {panel.title && (
                <Label type="default" className="text-xs mb-2 ml-1">
                  {panel.title}
                </Label>
              )}
              {panel.content}
            </InnerPanel>
          ),
      )}

      {errors.map((error, index) => {
        if (!error) return null;
        const { text, icon } =
          typeof error === "string" ? { text: error, icon: undefined } : error;

        return (
          <Label
            key={index}
            type="danger"
            icon={icon}
            className="text-xs px-1 mb-1"
          >
            {text}
          </Label>
        );
      })}

      {action}
      {footer}
    </>
  );
};
