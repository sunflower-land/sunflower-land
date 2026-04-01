import React from "react";

export const FieldRow: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="space-y-1">
    <span className="text-xs text-white ml-1">{label}</span>
    {children}
    {hint && (
      <span className="text-[10px] opacity-60 ml-1 block">{hint}</span>
    )}
  </div>
);
