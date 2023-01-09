import React from "react";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";

interface Props {
  divRef?: React.RefObject<HTMLDivElement>;
  tallMobileContent?: boolean;
  showHeader?: boolean;
  header: JSX.Element;
  content: JSX.Element;
}

export const SplitScreenView: React.FC<Props> = ({
  divRef,
  tallMobileContent = false,
  showHeader = true,
  header,
  content,
}: Props) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className={classNames(
          "w-full sm:w-3/5 h-fit sm:max-h-96 overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap",
          { "max-h-80": tallMobileContent },
          { "max-h-48": !tallMobileContent }
        )}
        ref={divRef}
      >
        {content}
      </div>
      {showHeader && (
        <OuterPanel className="w-full sm:w-2/5">{header}</OuterPanel>
      )}
    </div>
  );
};
