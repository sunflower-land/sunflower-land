import React from "react";
import { Transition } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";

interface Props {
  show: boolean;
  className?: string;
  onClick?: () => void;
}

export const AnimatedPanel: React.FC<Props> = ({
  show,
  onClick,
  children,
  className,
}) => {
  return (
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
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <InnerPanel className="drop-shadow-lg cursor-pointer">
        {children}
      </InnerPanel>
    </Transition>
  );
};
