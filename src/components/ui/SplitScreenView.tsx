import React, { type JSX, useEffect, useRef, useState } from "react";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

/**
 * The props for the component.
 * @param divRef The parent div reference. It is used to link up the parentDivRef prop of the <Box/> component.
 * @param tallMobileContent true if the content is taller for small screen views, else false. Usually set to true if the parent panel has no bumpkin parts. Defaults to false.
 * @param wideModal true if the panel modal is using a wider variant, else false. Defaults to false.
 * @param showPanel Whether to show the top or right panel view or not.
 * @param contentScrollable Whether the content view is scrollable or not.
 * @param panel The top or right panel view.
 * @param content The bottom or left content view.
 * @param mobileReversePanelOrder Whether to show the panel below the content on mobile.
 * @param matchPanelHeight On desktop, caps the content column's height to the panel column's actual rendered height (measured live), instead of a fixed max-height, so the two columns' borders line up regardless of how much either side renders.
 */
interface Props {
  divRef?: React.RefObject<HTMLDivElement | null>;
  tallMobileContent?: boolean;
  tallDesktopContent?: boolean;
  wideModal?: boolean;
  showPanel?: boolean;
  contentScrollable?: boolean;
  panel: JSX.Element;
  content: JSX.Element;
  mobileReversePanelOrder?: boolean;
  matchPanelHeight?: boolean;
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
  tallDesktopContent = false,
  matchPanelHeight = false,
}) => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!matchPanelHeight || !showHeader || !headerRef.current) return;

    const node = headerRef.current;

    const measure = () => {
      // Only constrain on desktop (sm+); mobile stacks the panels, where the
      // fixed tallMobileContent/max-h caps below already apply.
      if (window.innerWidth >= 640) {
        setPanelHeight(node.offsetHeight);
      } else {
        setPanelHeight(undefined);
      }
    };

    // ResizeObserver fires its callback once on observe() with the node's
    // initial size, so it handles the first measurement too — no direct
    // setState in the effect body is needed.
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [matchPanelHeight, showHeader]);

  return (
    <div
      className={classNames("flex sm:flex-row", {
        "flex-col": mobileReversePanelOrder,
        "flex-col-reverse": !mobileReversePanelOrder,
      })}
    >
      <InnerPanel
        className={classNames("w-full sm:w-3/5 h-fit p-1 flex", {
          "sm:max-h-96": !tallDesktopContent,
          "sm:max-h-[30rem]": tallDesktopContent,
          "max-h-80": tallMobileContent,
          "max-h-56": !tallMobileContent,
          "lg:w-3/4": wideModal,
          "flex-wrap overflow-y-auto scrollable overflow-x-hidden sm:mr-1":
            contentScrollable,
          "flex-col": !contentScrollable,
          "mt-1 sm:mt-0": !mobileReversePanelOrder,
        })}
        style={
          matchPanelHeight && showHeader && panelHeight
            ? { maxHeight: `${panelHeight}px` }
            : undefined
        }
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
          divRef={headerRef}
        >
          {header}
        </InnerPanel>
      )}
    </div>
  );
};
