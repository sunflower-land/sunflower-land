import React, { useEffect, useState } from "react";
import { AppearanceSettings } from "./AppearanceSettings";
import { BehaviourSettings } from "./BehaviourSettings";
import { SettingMenuId } from "../GameOptions";
import { Notifications } from "./Notifications";
import { isSupported } from "firebase/messaging";

export const Preferences: React.FC<{
  onSubMenuClick: (id: SettingMenuId) => void;
}> = ({ onSubMenuClick }) => {
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  useEffect(() => {
    const checkNotificationsSupported = async () => {
      setNotificationsSupported(await isSupported());
    };
    checkNotificationsSupported();
  }, []);

  const showNotifications =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    notificationsSupported;

  return (
    <>
      <div className="flex flex-col gap-2 m-3">
        <AppearanceSettings />
        <BehaviourSettings />
      </div>
      {showNotifications && <Notifications onSubMenuClick={onSubMenuClick} />}
    </>
  );
};
