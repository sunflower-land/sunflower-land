import { Announcement } from "../AnnouncementQueueProvider";
import { CONFIG } from "lib/config";

const ANNOUNCEMENTS_KEY = "announcements.lastRead";
const CURRENT_VERSION_KEY = "currentVersion";

// TODO - this function will be used when announcement source is programmed-in (see below)
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

export async function fetchAnnouncements(explicitlyRequest = false) {
  const announcementsToShow: Announcement[] = [];
  const lastVersionSeen = getLastVersionSeen();

  // Only query github if the current loaded gameVersion doesn't match the version last seen in localStorage
  // Always query github when player explicitly requests it (i.e. "News" button)
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

  // TODO - SFL team should uncomment this code and add additional logic here to pull announcements from their source.

  /*
  // 1. Query when the announcements were last read from localStorage
  const lastReadDate = getReadAnnouncementsTime();

  // 2. Fetch list of current announcements (Discord?) (Limit to last ~10 announcements?)
  const res = await window.fetch("https://SOME-URL-TO-ANNOUCENMENTS.com");
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
      announcementsToShow.push(...announcements); // Map as "Announcement" with a 'type' prop of "general".
      setReadAnnouncementsTime();
    }
  }
  */

  return announcementsToShow;
}
