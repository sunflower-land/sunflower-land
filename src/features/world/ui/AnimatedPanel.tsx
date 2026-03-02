import React, { PropsWithChildren } from "react";
import { Transition } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";

interface Props {
  show: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onBackdropClick?: () => void;
}

export const AnimatedPanel: React.FC<PropsWithChildren<Props>> = ({
  show,
  onClick,
  onBackdropClick,
  children,
  className,
  style,
}) => {
  return (
    <>
      {onBackdropClick && show && (
        <div
          className="fixed inset-0 z-30"
          onClick={onBackdropClick}
          aria-hidden="true"
        />
      )}
      <Transition
        appear={true}
        id="animated-panel"
        show={show}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={`flex absolute z-40 ${className}`}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        as="div"
      >
        <InnerPanel className="drop-shadow-lg cursor-pointer">
          {children}
        </InnerPanel>
      </Transition>
    </>
  );
};
