import { CONFIG } from "lib/config";

export type CalendarEvent = {
  title: string;
  startAt: number;
  endAt: number;
  details?: string;
};

// 20260924T013000Z
const toCalendarDate = (ms: number) =>
  new Date(ms)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/**
 * Opens Google Calendar's "new event" screen prefilled with the event.
 */
export const getGoogleCalendarUrl = ({
  title,
  startAt,
  endAt,
  details,
}: CalendarEvent) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toCalendarDate(startAt)}/${toCalendarDate(endAt)}`,
    ...(details ? { details } : {}),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Asks Android to open a calendar app on a prefilled new event
 * (CalendarContract ACTION_INSERT). Whether that works depends on the browser
 * dispatching the intent and a calendar app accepting it from the web; when it
 * doesn't, Chrome opens the Google Calendar web page instead.
 */
export const getAndroidCalendarIntentUrl = (event: CalendarEvent) => {
  const extras = [
    `S.title=${encodeURIComponent(event.title)}`,
    `l.beginTime=${event.startAt}`,
    `l.endTime=${event.endAt}`,
    ...(event.details
      ? [`S.description=${encodeURIComponent(event.details)}`]
      : []),
    `S.browser_fallback_url=${encodeURIComponent(getGoogleCalendarUrl(event))}`,
  ];

  return [
    "intent:#Intent",
    "action=android.intent.action.INSERT",
    "type=vnd.android.cursor.dir/event",
    ...extras,
    "end",
  ].join(";");
};

/**
 * Served by the API as text/calendar - iOS opens it straight into Apple
 * Calendar's "Add Event" sheet.
 */
export const getAuctionAppleCalendarUrl = (auctionId: string) =>
  `${CONFIG.API_URL}/auction/${encodeURIComponent(auctionId)}/calendar`;
