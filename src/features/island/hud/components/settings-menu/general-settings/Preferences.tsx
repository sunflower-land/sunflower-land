import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { isSupported } from "firebase/messaging";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";

export const Preferences: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();

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

  const buttons: { id: string; label: string; onClick: () => void }[] = [
    {
      id: "appearance",
      label: t("gameOptions.generalSettings.appearance"),
      onClick: () => onSubMenuClick("appearance"),
    },
    {
      id: "behaviour",
      label: t("gameOptions.generalSettings.behaviour"),
      onClick: () => onSubMenuClick("behaviour"),
    },
    {
      id: "audio",
      label: t("gameOptions.generalSettings.audio"),
      onClick: () => onSubMenuClick("audio"),
    },
    {
      id: "changeLanguage",
      label: t("gameOptions.generalSettings.changeLanguage"),
      onClick: () => onSubMenuClick("changeLanguage"),
    },
    ...(showNotifications
      ? [
          {
            id: "notifications",
            label: t("gameOptions.generalSettings.notifications"),
            onClick: () => onSubMenuClick("notifications"),
          },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
      {buttons.map((button, index) => {
        const isLast = index === buttons.length - 1;
        const spanFull = isLast && buttons.length % 2 === 1;
        return (
          <Button
            key={button.id}
            onClick={button.onClick}
            className={`p-1 ${spanFull ? "col-span-1 sm:col-span-2" : ""}`}
          >
            <span>{button.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
