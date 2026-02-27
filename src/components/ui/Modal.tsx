import classNames from "classnames";
import React, { Fragment, useRef } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogBackdrop,
} from "@headlessui/react";
import { useSound } from "lib/utils/hooks/useSound";

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

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
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

  const openSound = useSound("open");
  const closeSound = useSound("close");

  return (
    <Transition appear show={!!show} as={Fragment}>
      <Dialog
        initialFocus={ref}
        as="div"
        className="fixed inset-0 flex min-h-full items-center justify-center z-50 pointer-events-auto"
        onClose={() => (backdrop === "static" ? undefined : onHide?.())}
        // Prevent click through to Phaser
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {backdrop && (
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/50" />
          </TransitionChild>
        )}

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-out duration-75"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              beforeEnter={() => {
                if (backdrop) openSound.play();
                onShow?.();
              }}
              beforeLeave={() => {
                closeSound.play();
              }}
              afterLeave={() => onExited?.()}
            >
              <DialogPanel
                className={classNames(`relative w-full`, {
                  "max-w-[300px]": !fullscreen && size === "sm",
                  "max-w-[500px]": !fullscreen && size === undefined,
                  "max-w-[800px]": !fullscreen && size === "lg",
                  "w-screen h-full": !!fullscreen,
                  [`${dialogClassName}`]: !!dialogClassName,
                })}
                // Prevent click through to Phaser
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <div ref={ref}>{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
