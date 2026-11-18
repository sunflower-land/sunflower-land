import React, { type ReactNode } from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

/** A panel under the first one, with an optional title label. */
export type StackedPanel = {
  id: string;
  title?: ReactNode;
  content: ReactNode;
};

/**
 * The props for the component.
 * @param notice Shown at the top of the first panel, above the title.
 * @param title The first panel's label: the selected item, or a "pick one" prompt.
 * @param titleIcon The label's icon.
 * @param selected Shows the title as an `info` label (something is picked) instead of `default`.
 * @param details Under the title: buff labels, a description, notes.
 * @param options The option `Box`es, laid out in a scrolling grid.
 * @param belowOptions In the first panel, under the grid.
 * @param panels More panels, in order (a picker, requirements, outputs). Falsy entries are skipped.
 * @param errors Danger messages above the action. Strings become `danger` labels; falsy entries are skipped.
 * @param action The button(s).
 * @param footer After the action, e.g. a confirmation modal.
 */
interface Props {
  notice?: ReactNode;
  title: ReactNode;
  titleIcon?: string;
  selected?: boolean;
  details?: ReactNode;
  options: ReactNode;
  belowOptions?: ReactNode;
  panels?: (StackedPanel | false | null | undefined)[];
  errors?: ReactNode[];
  action?: ReactNode;
  footer?: ReactNode;
}

/**
 * Pick one option, see what it needs, then act, as stacked panels. The
 * layout of the Aging Shed racks; use it where `SplitScreenView`'s side
 * detail pane doesn't fit, e.g. when picking needs a second choice or the
 * requirements are long.
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
        <div className="flex flex-wrap gap-1 px-1 pb-1 overflow-auto max-h-48 scrollable items-start">
          {options}
        </div>
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

      {errors.map(
        (error, index) =>
          error &&
          (typeof error === "string" ? (
            <Label key={index} type="danger" className="text-xs px-1 mb-1">
              {error}
            </Label>
          ) : (
            <React.Fragment key={index}>{error}</React.Fragment>
          )),
      )}

      {action}
      {footer}
    </>
  );
};
