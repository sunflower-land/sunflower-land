import React from "react";
import { AppearanceSettings } from "./AppearanceSettings";
import { BehaviourSettings } from "./BehaviourSettings";
import { SettingMenuId } from "../GameOptions";
import { Notifications } from "./Notifications";

export const Preferences: React.FC<{
  onSubMenuClick: (id: SettingMenuId) => void;
}> = ({ onSubMenuClick }) => {
  return (
    <div className="flex flex-col gap-2 m-3">
      <AppearanceSettings />
      <BehaviourSettings />
      <Notifications onSubMenuClick={onSubMenuClick} />
    </div>
  );
};
