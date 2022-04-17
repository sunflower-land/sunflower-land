const ONE_SEC = 1;
const ONE_MIN = ONE_SEC * 60;
const ONE_HR = ONE_MIN * 60;
const ONE_DAY = ONE_HR * 24;

type TimeUnit = "sec" | "min" | "hr" | "day";

function timeToStr(amount: number, unit: TimeUnit) {
  const pluralizedUnit = amount === 1 ? unit : `${unit}s`;
  return `${amount}${pluralizedUnit}`;
}

function getTimeUnits(seconds: number) {
  const secondsPart = Math.ceil(seconds % ONE_MIN);
  const minutesPart = Math.floor((seconds / ONE_MIN) % ONE_MIN);
  const hoursPart = Math.floor((seconds / ONE_HR) % 24);
  const daysPart = Math.floor(seconds / ONE_DAY);

  return [
    daysPart && timeToStr(daysPart, "day"),
    hoursPart && timeToStr(hoursPart, "hr"),
    minutesPart && timeToStr(minutesPart, "min"),
    secondsPart && timeToStr(secondsPart, "sec"),
  ].filter(Boolean);
}

export function secondsToString(seconds: number) {
  const secondsCeil = Math.ceil(seconds);

  if (secondsCeil < 60) {
    return `${secondsCeil}secs`;
  }

  if (secondsCeil === 60) {
    return `1min`;
  }

  // Less than 1 hour
  if (seconds < 60 * 60) {
    return `${Math.ceil(seconds / 60)}mins`;
  }

  if (seconds === 60 * 60) {
    return "1hr";
  }

  if (seconds < 60 * 60 * 24) {
    return `${Math.ceil(seconds / 60 / 60)}hrs`;
  }

  if (seconds === 60 * 60 * 24) {
    return "1day";
  }

  return `${Math.ceil(seconds / 60 / 60 / 24)}days`;
}

// first 2 units
export function secondsToMidString(time: number) {
  return getTimeUnits(time).slice(0, 2).join(" ");
}

export function secondsToLongString(time: number) {
  return getTimeUnits(time).join(" ");
}

export function getTimeLeft(createdAt: number, totalTime: number) {
  const millisecondsElapsed = Date.now() - createdAt;
  if (millisecondsElapsed > totalTime * 1000) {
    return 0;
  }

  return totalTime - millisecondsElapsed / 1000;
}
