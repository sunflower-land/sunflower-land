import React from "react";
import { Label } from "components/ui/Label";

export const SectionHeader: React.FC<{
  children: React.ReactNode;
  type?: "default" | "info" | "warning" | "success" | "vibrant";
  icon?: string;
}> = ({ children, type = "default", icon }) => (
  <Label type={type} icon={icon} className="mb-2">
    {children}
  </Label>
);
