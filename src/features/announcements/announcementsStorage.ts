import { ANNOUNCEMENTS as ANN } from "features/announcements";

// Sort announcements latest first
const ANNOUNCEMENTS = ANN.sort((a, b) => b.date.getTime() - a.date.getTime());

export function hasAnnouncements() {
  const lastRead = getAnnouncementLastRead();

  if (lastRead) {
    return new Date(lastRead) < ANNOUNCEMENTS[0].date;
  } else return true;
}

export function getAnnouncements() {
  const storedDate = getAnnouncementLastRead();

  return storedDate
    ? ANNOUNCEMENTS.filter(
        (announcement) => announcement.date > new Date(storedDate)
      )
    : ANNOUNCEMENTS;
}

export function getAnnouncementLastRead() {
  return localStorage.getItem("announcementLastRead");
}

export function acknowledgeRead() {
  return localStorage.setItem(
    "announcementLastRead",
    ANNOUNCEMENTS[0].date.toISOString()
  );
}
