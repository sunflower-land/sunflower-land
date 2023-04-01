import React from "react";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";

/**
 * The props for the component.
 * @param divRef The parent div reference. It is used to link up the parentDivRef prop of the the <Box/> component.
 * @param tallMobileContent true if the content is taller for small screen views, else false. Usually set to true if the parent panel has no bumpkin parts. Defaults to false.
 * @param wideModal true if the panel modal is using a wider variant, else false. Defaults to false.
 * @param showPanel Whether to show the top or right panel view or not.
 * @param contentScrollable Whether the content view is scrollable or not.
 * @param panel The top or right panel view.
 * @param content The bottom or left content view.
 */
interface Props {
  divRef?: React.RefObject<HTMLDivElement>;
  tallMobileContent?: boolean;
  wideModal?: boolean;
  showPanel?: boolean;
  contentScrollable?: boolean;
  panel: JSX.Element;
  content: JSX.Element;
}

/**
 * The view for displaying item name, details, crafting requirements and action.
 * @props The component props.
 */
export const SplitScreenView: React.FC<Props> = ({
  divRef,
  tallMobileContent = false,
  wideModal = false,
  showPanel: showHeader = true,
  contentScrollable = true,
  panel: header,
  content,
}: Props) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className={classNames(
          "w-full sm:w-3/5 h-fit sm:max-h-96 p-1 mt-1 sm:mt-0 flex",
          {
            "max-h-80": tallMobileContent,
            "max-h-56": !tallMobileContent,
            "lg:w-3/4": wideModal,
            "flex-wrap overflow-y-auto scrollable overflow-x-hidden sm:mr-1":
              contentScrollable,
            "flex-col": !contentScrollable,
          }
        )}
        ref={divRef}
      >
        {content}
      </div>
      {showHeader && (
        <OuterPanel
          className={classNames("w-full sm:w-2/5", {
            "lg:w-1/4": wideModal,
          })}
        >
          {header}
        </OuterPanel>
      )}
    </div>
  );
};
