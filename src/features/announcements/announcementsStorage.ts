import { ANNOUNCEMENTS } from "features/announcements";

export function getAnnouncements() {
  const storedDate = getAnnouncementLastRead();
  const filtered = storedDate
    ? ANNOUNCEMENTS.filter(
        (announcement) => announcement.date > new Date(storedDate)
      )
    : ANNOUNCEMENTS;

  // Sort latest first
  filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  return filtered;
}

export function getAnnouncementLastRead() {
  return localStorage.getItem("announcementLastRead");
}

export function acknowledgeRead() {
  return localStorage.setItem(
    "announcementLastRead",
    ANNOUNCEMENTS[ANNOUNCEMENTS.length - 1].date.toISOString()
  );
}
