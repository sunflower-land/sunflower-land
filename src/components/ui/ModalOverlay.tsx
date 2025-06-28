/**
 * ModalOverlay component is used to display a panel over the top of a modal.
 * It has its own backdrop and transition animation.
 * @param {boolean} show - show modal
 * @param {() => void} onBackdropClick - callback function when backdrop is clicked
 */

import { Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";

interface Props {
  show: boolean;
  className?: string;
  onBackdropClick: () => void;
}

export const ModalOverlay: React.FC<Props> = ({
  show,
  className,
  children,
  onBackdropClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && !isVisible) {
      setIsVisible(true);
    }
  }, [show, isVisible]);

  return (
    <Transition show={show}>
      {/* Overlay */}
      <Transition.Child
        enter="transition-opacity ease-linear duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          id="overlay-mine"
          className={`bg-brown-300 opacity-70 absolute inset-1 top-1 z-20 ${className}`}
          style={{
            boxShadow: "rgb(194 134 105) 0px 0px 5px 6px",
          }}
          onClick={onBackdropClick}
        />
      </Transition.Child>
      <Transition.Child
        enter="transition-transform ease-linear duration-100"
        enterFrom="scale-0"
        enterTo="scale-100"
        leave="transition-transform ease-linear duration-100"
        leaveFrom="scale-100"
        leaveTo="scale-0"
        afterLeave={() => setIsVisible(false)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform w-full sm:w-5/6 z-20"
      >
        {isVisible && <>{children}</>}
      </Transition.Child>
    </Transition>
  );
};
