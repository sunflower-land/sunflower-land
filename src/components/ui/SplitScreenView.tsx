import React from "react";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";

interface Props {
  divRef?: React.RefObject<HTMLDivElement>;
  tallMobileContent?: boolean;
  wideModal?: boolean;
  showHeader?: boolean;
  contentScrollable?: boolean;
  header: JSX.Element;
  content: JSX.Element;
}

export const SplitScreenView: React.FC<Props> = ({
  divRef,
  tallMobileContent = false,
  wideModal = false,
  showHeader = true,
  contentScrollable = true,
  header,
  content,
}: Props) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className={classNames(
          "w-full sm:w-3/5 lg:w-3/4 h-fit sm:max-h-96 p-1 mt-1 sm:mt-0 sm:mr-1 flex",
          {
            "max-h-80": tallMobileContent,
            "max-h-48": !tallMobileContent,
            "lg:w-3/4": wideModal,
            "flex-wrap overflow-y-auto scrollable overflow-x-hidden":
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
