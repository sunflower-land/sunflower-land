/**
 * ModalOverlay component is used to display a panel over the top of a modal.
 * It has its own backdrop and transition animation.
 * @param {boolean} show - show modal
 * @param {() => void} onBackdropClick - callback function when backdrop is clicked
 */

import { Transition, TransitionChild } from "@headlessui/react";
import React, { useLayoutEffect, useRef, useState } from "react";

interface Props {
  show: boolean;
  className?: string;
  // Width classes for the centered panel. Defaults to "w-full sm:w-5/6".
  panelClassName?: string;
  panelPosition?: "auto" | "center" | "top";
  lockBackgroundScroll?: boolean;
  onBackdropClick: () => void;
}

export const ModalOverlay: React.FC<React.PropsWithChildren<Props>> = ({
  show,
  className,
  panelClassName = "w-full sm:w-5/6",
  panelPosition = "center",
  lockBackgroundScroll = false,
  children,
  onBackdropClick,
}) => {
  const [hideChildren, setHideChildren] = useState(true);
  const [panelFillsContainer, setPanelFillsContainer] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!show || (panelPosition !== "auto" && !lockBackgroundScroll)) return;

    const panel = panelRef.current;
    const container = panel?.offsetParent;

    if (!panel || !(container instanceof HTMLElement)) return;

    const updatePanelPosition = () => {
      if (panelPosition !== "auto") return;

      setPanelFillsContainer(
        panel.scrollHeight > panel.clientHeight ||
          panel.offsetHeight >= container.clientHeight,
      );
    };

    updatePanelPosition();

    const resizeObserver = new ResizeObserver(updatePanelPosition);
    resizeObserver.observe(panel);
    resizeObserver.observe(container);

    const panelContent = panel.firstElementChild;
    if (panelContent instanceof HTMLElement) {
      resizeObserver.observe(panelContent);
    }

    const previousOverflowY = container.style.overflowY;
    if (lockBackgroundScroll) {
      container.style.overflowY = "hidden";
    }

    return () => {
      resizeObserver.disconnect();
      container.style.overflowY = previousOverflowY;
    };
  }, [hideChildren, lockBackgroundScroll, panelPosition, show]);

  const alignPanelToTop =
    panelPosition === "top" ||
    (panelPosition === "auto" && panelFillsContainer);

  return (
    <Transition show={show}>
      {/* Overlay */}
      <TransitionChild
        enter="transition-opacity ease-linear duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          id="overlay-mine"
          className={`bg-brown-300 opacity-70 absolute inset-1 top-1 z-50 ${className}`}
          style={{
            boxShadow: "rgb(194 134 105) 0px 0px 5px 6px",
          }}
          onClick={onBackdropClick}
        />
      </TransitionChild>
      <TransitionChild
        enter="transition-transform ease-linear duration-100"
        enterFrom="scale-0"
        enterTo="scale-100"
        leave="transition-transform ease-linear duration-100"
        leaveFrom="scale-100"
        leaveTo="scale-0"
        beforeEnter={() => setHideChildren(false)}
        afterLeave={() => setHideChildren(true)}
        ref={panelRef}
        className={`absolute left-1/2 -translate-x-1/2 transform z-50 ${
          alignPanelToTop ? "top-1" : "top-1/2 -translate-y-1/2"
        } ${
          lockBackgroundScroll
            ? "max-h-[calc(100%-0.5rem)] overflow-y-auto overscroll-contain scrollable"
            : ""
        } ${panelClassName}`}
        as="div"
      >
        {!hideChildren && <>{children}</>}
      </TransitionChild>
    </Transition>
  );
};
