import React from "react";
import { Modal } from "react-bootstrap";
import arrowLeft from "assets/icons/arrow_left.png";
import close from "assets/icons/close.png";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";

interface Props {
  onClose: () => void;
  onBack?: () => void;
  title: string;
}

export const HowToModalHeader = ({ onClose, onBack, title }: Props) => {
  const canClose = !useIsNewFarm();

  return (
    <Modal.Header className="justify-start">
      <div className="flex w-full">
        {onBack && (
          <img
            className="h-6 mr-3 cursor-pointer"
            src={arrowLeft}
            alt="back"
            onClick={onBack}
          />
        )}
        <span className="text-base ml-2 grow">{title}</span>
        {canClose && (
          <img src={close} className="h-6 cursor-pointer" onClick={onClose} />
        )}
      </div>
    </Modal.Header>
  );
};
