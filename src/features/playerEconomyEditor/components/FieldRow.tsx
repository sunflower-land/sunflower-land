import React from "react";
import classNames from "classnames";

export const FieldRow: React.FC<{
  label: string;
  hint?: string;
  /** Override label color (default: light text for dark panels). */
  labelClassName?: string;
  children: React.ReactNode;
}> = ({ label, hint, labelClassName, children }) => (
  <div className="space-y-1">
    <span
      className={classNames("text-xs ml-1", labelClassName ?? "text-white")}
    >
      {label}
    </span>
    {children}
    {hint && <span className="text-[10px] opacity-60 ml-1 block">{hint}</span>}
  </div>
);
