import { translate } from "lib/i18n/translate";

export const ONE_SEC = 1;
export const ONE_MIN = ONE_SEC * 60;
export const ONE_HR = ONE_MIN * 60;
export const ONE_DAY = ONE_HR * 24;

type TimeUnit = "sec" | "min" | "hr" | "day";
export type TimeFormatLength = "short" | "medium" | "full";
type TimeDuration = {
  value: number;
  unit: TimeUnit;
  pluralisedUnit: TimeUnit;
};

/**
 * The options for formatting the time string.
 * @param length The length of the format.  Short length shows 1 unit, mid shows 2, full shows all 4.
 * @param isShortFormat true, if short format (s, m, h, d) is used.
 * @param removeTrailingZeros true, if trailing zeros are removed (eg. '23h 0m 0s' becomes '23h').
 */
export type TimeFormatOptions = {
  length: TimeFormatLength;
  isShortFormat?: boolean;
  removeTrailingZeros?: boolean;
};

/**
 * Formats a time unit to string.
 * @param value The time value for the unit.
 * @param unit The time unit.
 * @param options The time format options for formatting the time to string.
 * @returns The formatted string for the time unit.
 */
const timeUnitToString = (
  duration: TimeDuration,
  options: TimeFormatOptions = {
    length: "medium", // unused but still have to be set because the field is not optional
    isShortFormat: false,
  }
) => {
  const value = duration.value;
  const unit = duration.unit;
  const pluralisedUnit = duration.pluralisedUnit;

  if (options.isShortFormat) {
    return `${value}${unit.substring(0, 1)}`;
  }

  const pluralizedUnit = value === 1 ? unit : pluralisedUnit;
  return `${value}${pluralizedUnit}`;
};

export const secondsToString = (
  seconds: number,
  options: TimeFormatOptions
) => {
  // rounding method for time units
  const roundingFunction =
    seconds >= 0 ? (x: number) => Math.floor(x) : (x: number) => Math.ceil(x);

  // time durations
  const secondsValue = {
    value: roundingFunction(seconds % ONE_MIN),
    unit: translate("sec"),
    pluralisedUnit: translate("secs"),
  };
  const minutesValue = {
    value: roundingFunction((seconds / ONE_MIN) % ONE_MIN),
    unit: translate("min"),
    pluralisedUnit: translate("mins"),
  };
  const hoursValue = {
    value: roundingFunction((seconds / ONE_HR) % 24),
    unit: translate("hr"),
    pluralisedUnit: translate("hrs"),
  };
  const daysValue = {
    value: roundingFunction(seconds / ONE_DAY),
    unit: translate("day"),
    pluralisedUnit: translate("days"),
  };

  // all time units that constitutes the full string
  const timeUnits = [
    daysValue.value && daysValue,
    (daysValue.value || hoursValue.value) && hoursValue,
    (daysValue.value || hoursValue.value || minutesValue.value) && minutesValue,
    secondsValue,
  ].filter(Boolean);

  // reduced time units based on the options
  let reducedTimeUnits;
  switch (options.length) {
    case "short":
      reducedTimeUnits = timeUnits.slice(0, 1);
      break;
    case "medium":
      reducedTimeUnits = timeUnits.slice(0, 2);
      break;
    case "full":
      reducedTimeUnits = timeUnits;
      break;
  }

  // remove trailing zero time units
  if (options.removeTrailingZeros) {
    while (
      options.removeTrailingZeros &&
      reducedTimeUnits.length > 1 &&
      !(reducedTimeUnits.slice(-1)[0] as TimeDuration)?.value
    ) {
      reducedTimeUnits = reducedTimeUnits.slice(0, -1);
    }
  }

  // format string
  return reducedTimeUnits
    .map((x) => timeUnitToString(x as TimeDuration, options))
    .join("\u00A0");
};

/**
 * Gets the time left before an operation is ready.
 * @param createdAt The time where the operation is started.
 * @param totalTimeInSeconds The total time in seconds needed for the operation to complete.
 * @returns The time left in seconds.
 */
export const getTimeLeft = (createdAt: number, totalTimeInSeconds: number) => {
  const millisecondsElapsed = Date.now() - createdAt;

  if (millisecondsElapsed > totalTimeInSeconds * 1000) return 0;

  return totalTimeInSeconds - millisecondsElapsed / 1000;
};

/**
 * Gets the formatted localized date time `MM dd, hh:mm a` from ISO string.
 * @param isoString The ISO string.
 * @returns The formatted localized date time.
 */
export const formatDateTime = (isoString: string) => {
  const localDateTime = new Date(isoString);

  return localDateTime.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Gets the seconds until tomorrow
 * @returns Integer seconds
 */
export function getSecondsToTomorrow() {
  const now = new Date();

  // tomorrow date
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const diff = tomorrow.getTime() - now.getTime(); // difference in ms
  return Math.round(diff / 1000); // convert to seconds
}

export function getRelativeTime(timestamp: number): string {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - timestamp) / 1000);

  if (secondsAgo === 0) {
    return "now";
  } else if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
  }
}

export function formatDateRange(fromDate: Date, toDate: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fromMonth = months[fromDate.getMonth()];
  const toMonth = months[toDate.getMonth()];

  const fromDay = fromDate.getDate();
  const toDay = toDate.getDate();

  return `${fromMonth} ${fromDay}${getOrdinalSuffix(
    fromDay
  )} - ${toMonth} ${toDay}${getOrdinalSuffix(toDay)}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * A function that gives your the day of the year.
 * @param date JS Date object
 * @returns Day of the calendar year eg: 182
 */
export function getDayOfYear(date: Date): number {
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * A function that gives you the time until a given date.
 * @param timestamp Date object
 * @returns Time until the given date eg: 2 days
 */
export function getTimeUntil(timestamp: Date) {
  const now = new Date();
  const diff = timestamp.getTime() - now.getTime();

  if (diff < 0) return "now";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
}
