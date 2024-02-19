import classNames from "classnames";
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  className?: string;
}

interface ModalProps {
  size?: "lg" | "sm";
  backdropClassName?: string;
  dialogClassName?: string;
  className?: string;

  show?: boolean;
  fullscreen?: boolean;
  backdrop?: boolean | "static";
  scrollable?: boolean;

  onHide?: () => void;
  onExited?: () => void;
  onShow?: () => void;
}

export const Modal: React.FC<ModalProps> & {
  Body: React.FC<Props>;
  Footer: React.FC<Props>;
  Header: React.FC<Props>;
} = ({
  children,
  show,
  onHide,
  onExited,
  onShow,
  size,
  fullscreen,
  backdrop = true,
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex min-h-full items-center justify-center z-50"
        onClose={() => (backdrop === "static" ? undefined : onHide?.())}
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

        <div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            beforeEnter={() => onShow?.()}
            afterLeave={() => onExited?.()}
          >
            <Dialog.Panel
              className={classNames("relative w-full", {
                "max-w-[300px]": !fullscreen && size === "sm",
                "max-w-[500px]": !fullscreen && size === undefined,
                "max-w-[800px]": !fullscreen && size === "lg",
                "w-screen h-full": !!fullscreen,
              })}
            >
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.Body = ({ children }) => <div>{children}</div>;
Modal.Footer = ({ children }) => <div>{children}</div>;
Modal.Header = ({ children }) => <div>{children}</div>;
