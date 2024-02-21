import classNames from "classnames";
import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
  size?: "lg" | "sm";
  dialogClassName?: string;

  show?: boolean;
  fullscreen?: boolean;
  backdrop?: boolean | "static";

  onHide?: () => void;
  onExited?: () => void;
  onShow?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  show,
  onHide,
  onExited,
  onShow,
  size,
  fullscreen,
  dialogClassName,
  backdrop = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        initialFocus={ref}
        as="div"
        className="fixed inset-0 flex min-h-full items-center justify-center z-50 pointer-events-auto"
        onClose={() => undefined}
        // For some reason touchend events on mobile are triggering onClose immediately in canvas
        // onClose={() => backdrop === "static" ? undefined : onHide?.()}

        // Prevent click through to Phaser
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {backdrop && (
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>
        )}

        <div
          className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center"
          onClick={() => onHide?.()}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            beforeEnter={() => onShow?.()}
            afterLeave={() => onExited?.()}
          >
            <Dialog.Panel
              className={classNames(
                `relative m-2 w-full ${dialogClassName ?? ""}`,
                {
                  "max-w-[300px]": !fullscreen && size === "sm",
                  "max-w-[500px]": !fullscreen && size === undefined,
                  "max-w-[800px]": !fullscreen && size === "lg",
                  "w-screen h-full": !!fullscreen,
                }
              )}
            >
              <div ref={ref}>{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
