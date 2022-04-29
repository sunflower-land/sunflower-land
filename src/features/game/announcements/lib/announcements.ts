import { Announcement, SetAnnouncements } from "../AnnouncementQueueProvider";
import { CONFIG } from "lib/config";

const ANNOUNCEMENTS_KEY = "announcements.lastRead";
const CURRENT_VERSION_KEY = "currentVersion";

function getReadAnnouncementsTime() {
  const item = localStorage.getItem(ANNOUNCEMENTS_KEY);

  if (!item) {
    setReadAnnouncementsTime();
    return null;
  }

  return new Date(item);
}

function setReadAnnouncementsTime() {
  localStorage.setItem(ANNOUNCEMENTS_KEY, new Date().toISOString());
}

function getLastVersionSeen() {
  return localStorage.getItem(CURRENT_VERSION_KEY);
}

function setLastSeenVersion(version: string) {
  localStorage.setItem(CURRENT_VERSION_KEY, version);
}

export async function fetchAnnouncements(
  setAnnouncements: SetAnnouncements,
  explicitlyRequest = false
) {
  const announcementsToShow: Announcement[] = [];
  const lastVersionSeen = getLastVersionSeen();

  // Only query github if the current loaded gameVersion doesn't match the version last seen
  if (explicitlyRequest || CONFIG.RELEASE_VERSION !== lastVersionSeen) {
    // Pull latest release notes via github
    const res = await window.fetch(
      `https://api.github.com/repos/sunflower-land/sunflower-land/releases/latest`
    );

    const { name, body, published_at } = await res.json();

    announcementsToShow.push({
      type: "whats-new",
      title: name,
      content: body,
      datetimePosted: published_at,
    });

    setLastSeenVersion(CONFIG.RELEASE_VERSION);
  }

  // TODO - SFL team can uncomment this code and add additional logic here to pull announcements from their source

  /*
  // 1. Query when the announcements were last read
  const lastReadDate = getReadAnnouncementsTime();

  // 2. Fetch list of current announcements
  const res = await window.fetch("https://URL-TO-ANNOUCENMENTS.com");
  const jsonRes = await res.json();
  const announcements = jsonRes.announcements.sort((a, b) => {
    // Sort by announcement publish date here, descending
    return 0;
  });

  // 3. If the latest announcement has not yet been read, then auto-show announcements
  if (announcements.length > 0) {
    const [latestAnnouncement] = announcements;

    if (
      explicitlyRequest ||
      lastReadDate === null ||
      new Date(latestAnnouncement.published_at).getTime() >
        lastReadDate.getTime()
    ) {
      announcementsToShow.push(...announcements); // Map to "Announcement" obj with type of "general" if needed.
      setReadAnnouncementsTime();
    }
  }
  */

  // TODO - Remove before push
  announcementsToShow.push(
    {
      type: "general",
      title: "TEST TITLE",
      content: "fdsaf dasf adsf dsa ",
      datetimePosted: new Date(),
    },
    {
      type: "general",
      title: "TEST TITLE",
      content:
        "## This is a good title\r\n\r\n* You should NEVER do anything bad\r\n* If you do something bad, it's on you",
      datetimePosted: new Date(),
    },
    {
      type: "whats-new",
      title: "WHATS NEW TITLE",
      content: "fdsaf dasf adsf dsa ",
      datetimePosted: new Date(),
    }
  );

  setAnnouncements(announcementsToShow);

  return announcementsToShow;
}
