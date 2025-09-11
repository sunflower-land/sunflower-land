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
};

export const ConfirmButton: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onConfirm,
  disabled,
  className,
  confirmLabel,
  cancelLabel,
  variant = "primary",
}) => {
  const [confirming, setConfirming] = React.useState(false);
  const { t } = useAppTranslation();

  if (confirming) {
    return (
      <div className="flex sm:flex-col gap-1">
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
