/**
 * Cache show timers setting in local storage so we can remember next time we open the HUD.
 */
const LOCAL_STORAGE_KEY = "settings.notifications";

export function cacheNotificationPermissions(
  permission: NotificationPermission
) {
  localStorage.setItem(LOCAL_STORAGE_KEY, permission);
}

export function getNotificationPermissions(): NotificationPermission {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);

  return (cached ?? "default") as NotificationPermission;
}
