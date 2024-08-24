import React from "react";
import { InnerPanel } from "components/ui/Panel";
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
 * @param mobileReversePanelOrder Whether to show the panel below the content on mobile.
 */
interface Props {
  divRef?: React.RefObject<HTMLDivElement>;
  tallMobileContent?: boolean;
  wideModal?: boolean;
  showPanel?: boolean;
  contentScrollable?: boolean;
  panel: JSX.Element;
  content: JSX.Element;
  mobileReversePanelOrder?: boolean;
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
  mobileReversePanelOrder = false,
  panel: header,
  content,
}: Props) => {
  return (
    <div
      className={classNames("flex sm:flex-row", {
        "flex-col": mobileReversePanelOrder,
        "flex-col-reverse": !mobileReversePanelOrder,
      })}
    >
      <InnerPanel
        className={classNames("w-full sm:w-3/5 h-fit sm:max-h-96 p-1 flex", {
          "max-h-80": tallMobileContent,
          "max-h-56": !tallMobileContent,
          "lg:w-3/4": wideModal,
          "flex-wrap overflow-y-auto scrollable overflow-x-hidden sm:mr-1":
            contentScrollable,
          "flex-col": !contentScrollable,
          "mt-1 sm:mt-0": !mobileReversePanelOrder,
        })}
        divRef={divRef}
      >
        {content}
      </InnerPanel>
      {showHeader && (
        <InnerPanel
          className={classNames("w-full sm:w-2/5 h-fit", {
            "lg:w-1/4": wideModal,
            "mt-1 sm:mt-0": mobileReversePanelOrder,
          })}
        >
          {header}
        </InnerPanel>
      )}
    </div>
  );
};
