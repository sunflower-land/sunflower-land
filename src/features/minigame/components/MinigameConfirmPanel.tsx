import React from "react";
import { createPortal } from "react-dom";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";

type Props = {
  show: boolean;
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmDisabled?: boolean;
};

export const MinigameConfirmPanel: React.FC<Props> = ({
  show,
  title,
  children,
  confirmLabel,
  onConfirm,
  onClose,
  confirmDisabled = false,
}) => {
  if (!show) return null;

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[70] flex items-center justify-center"
      style={{ background: "rgb(0 0 0 / 56%)" }}
    >
      <CloseButtonPanel className="w-[min(92vw,420px)]" onClose={onClose}>
        <div className="p-1">
          <h2 className="text-sm mb-2">{title}</h2>
          {children}
        </div>
        <Button disabled={confirmDisabled} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </CloseButtonPanel>
    </div>,
    document.body,
  );
};
