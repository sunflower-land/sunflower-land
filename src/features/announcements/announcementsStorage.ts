import { ANNOUNCEMENTS as ANN } from "features/announcements";

// Sort announcements latest first
export const SORTED_ANNOUNCEMENTS = ANN.sort(
  (a, b) => b.date.getTime() - a.date.getTime()
);

export function hasAnnouncements() {
  const lastRead = getAnnouncementLastRead();

  if (lastRead) {
    return new Date(lastRead) < SORTED_ANNOUNCEMENTS[0].date;
  } else return true;
}

export function getAnnouncements() {
  const storedDate = getAnnouncementLastRead();

  // Filter out future announcements
  const announcements = SORTED_ANNOUNCEMENTS.filter(
    (announcement) => announcement.date < new Date()
  );

  // Filter out announcements already read
  return storedDate
    ? announcements.filter(
        (announcement) => announcement.date > new Date(storedDate)
      )
    : announcements;
}

export function getAnnouncementLastRead() {
  return localStorage.getItem("announcementLastRead");
}

export function acknowledgeRead() {
  return localStorage.setItem(
    "announcementLastRead",
    SORTED_ANNOUNCEMENTS[0].date.toISOString()
  );
}
