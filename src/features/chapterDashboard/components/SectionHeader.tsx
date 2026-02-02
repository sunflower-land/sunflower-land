import React from "react";

import { Label, LabelType } from "components/ui/Label";
import { Button } from "components/ui/Button";

export const SectionHeader: React.FC<{
  title: string;
  labelType?: LabelType;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
  disabled?: boolean;
}> = ({ title, labelType = "default", icon, actionText, onAction, disabled }) => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <Label type={labelType} icon={icon} className="-ml-1">
        {title}
      </Label>
      {actionText && onAction && (
        <Button className="w-auto px-2" onClick={onAction} disabled={disabled}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

