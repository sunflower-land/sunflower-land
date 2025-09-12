import React from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  variant?: "primary" | "secondary";
  divClassName?: string;
};
/**
 * The props for the ConfirmButton component.
 * @param children - The content of the button.
 * @param onConfirm - The function to call when the button is confirmed.
 * @param disabled - Whether the button is disabled.
 * @param className - The class name for the buttons.
 * @param confirmLabel - The label for the confirm button.
 * @param cancelLabel - The label for the cancel button.
 * @param variant - The variant of the button.
 * @param divClassName - The class name for the div that contains the buttons.
 * @param param0 - The props for the ConfirmButton div component.
 * @returns A ConfirmButton component.
 */
export const ConfirmButton: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onConfirm,
  disabled,
  className,
  confirmLabel,
  cancelLabel,
  variant = "primary",
  divClassName,
}) => {
  const [confirming, setConfirming] = React.useState(false);
  const { t } = useAppTranslation();

  if (confirming) {
    return (
      <div className={`flex gap-1 w-full ${divClassName}`}>
        <Button
          variant={variant}
          className={className}
          onClick={() => setConfirming(false)}
        >
          {cancelLabel ?? t("cancel")}
        </Button>
        <Button
          variant={variant}
          className={className}
          disabled={disabled}
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
        >
          {confirmLabel ?? t("confirm")}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={() => setConfirming(true)}
    >
      {children}
    </Button>
  );
};
