import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Button } from "./Button";
import { Panel } from "./Panel";
import { Equipped } from "features/game/types/bumpkin";
import { Modal } from "./Modal";

interface ConfirmProps {
  show: boolean;
  onHide: () => void;
  messages: string[];
  icon?: string;
  imageStyle?: React.CSSProperties;
  onCancel: () => void;
  onConfirm: () => void;
  confirmButtonLabel: string;
  bumpkinParts?: Partial<Equipped>;
  disabled?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmProps> = ({
  show,
  onHide,
  messages,
  onCancel,
  onConfirm,
  confirmButtonLabel,
  bumpkinParts,
  icon,
  imageStyle,
  disabled,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={show} onHide={onHide}>
      <Panel className="sm:w-4/5 m-auto" bumpkinParts={bumpkinParts}>
        <div className="flex flex-col p-2 items-center">
          {icon && <img src={icon} style={imageStyle} />}
          {messages.map((msg, index) => (
            <span key={index} className="text-sm text-start w-full mb-1">
              {msg}
            </span>
          ))}
        </div>
        <div className="flex justify-content-around mt-2 space-x-1">
          <Button onClick={onCancel}>{t("cancel")}</Button>
          <Button disabled={disabled} onClick={onConfirm}>
            {confirmButtonLabel}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
