export const ONE_SEC = 1;
export const ONE_MIN = ONE_SEC * 60;
export const ONE_HR = ONE_MIN * 60;
export const ONE_DAY = ONE_HR * 24;

type TimeUnit = "sec" | "min" | "hr" | "day";

type TimeStringOptions = {
  separator?: string;
  isShortFormat?: boolean;
};

function timeToStr(
  amount: number,
  unit: TimeUnit,
  options: TimeStringOptions = {
    separator: "",
    isShortFormat: false,
  }
) {
  if (options.isShortFormat) {
    return `${amount}${options.separator ?? ""}${unit.substring(0, 1)}`;
  }

  const pluralizedUnit = amount === 1 ? unit : `${unit}s`;
  return `${amount}${options.separator ?? ""}${pluralizedUnit}`;
}

function getTimeUnits(seconds: number, isShortFormat: boolean) {
  const secondsPart = Math.ceil(seconds % ONE_MIN);
  const minutesPart = Math.floor((seconds / ONE_MIN) % ONE_MIN);
  const hoursPart = Math.floor((seconds / ONE_HR) % 24);
  const daysPart = Math.floor(seconds / ONE_DAY);

  return [
    daysPart && timeToStr(daysPart, "day", { isShortFormat: isShortFormat }),
    (daysPart || hoursPart) &&
      timeToStr(hoursPart, "hr", { isShortFormat: isShortFormat }),
    (daysPart || hoursPart || minutesPart) &&
      timeToStr(minutesPart, "min", { isShortFormat: isShortFormat }),
    timeToStr(secondsPart, "sec", { isShortFormat: isShortFormat }),
  ].filter(Boolean);
}

// first unit
export function secondsToString(seconds: number, isShortFormat = false) {
  return getTimeUnits(seconds, isShortFormat).slice(0, 1).join(" ");
}

// first 2 units
export function secondsToMidString(seconds: number, isShortFormat = false) {
  return getTimeUnits(seconds, isShortFormat).slice(0, 2).join(" ");
}

export function secondsToLongString(seconds: number, isShortFormat = false) {
  return getTimeUnits(seconds, isShortFormat).join(" ");
}

export function getTimeLeft(createdAt: number, totalTimeInSeconds: number) {
  const millisecondsElapsed = Date.now() - createdAt;

  if (millisecondsElapsed > totalTimeInSeconds * 1000) return 0;

  return totalTimeInSeconds - millisecondsElapsed / 1000;
}

/**
 * Returns localized `MM dd, hh:mm a` from ISO string
 */
export function formatDateTime(isoString: string) {
  const localDateTime = new Date(isoString);

  return localDateTime.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
