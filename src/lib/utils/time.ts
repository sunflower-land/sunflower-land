export const ONE_SEC = 1;
export const ONE_MIN = ONE_SEC * 60;
export const ONE_HR = ONE_MIN * 60;
export const ONE_DAY = ONE_HR * 24;

type TimeUnit = "sec" | "min" | "hr" | "day";
export type TimeFormatLength = "short" | "medium" | "full";
type TimeDuration = {
  value: number;
  unit: TimeUnit;
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

  if (options.isShortFormat) {
    return `${value}${unit.substring(0, 1)}`;
  }

  const pluralizedUnit = value === 1 ? unit : `${unit}s`;
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
    unit: "sec",
  };
  const minutesValue = {
    value: roundingFunction((seconds / ONE_MIN) % ONE_MIN),
    unit: "min",
  };
  const hoursValue = {
    value: roundingFunction((seconds / ONE_HR) % 24),
    unit: "hr",
  };
  const daysValue = { value: roundingFunction(seconds / ONE_DAY), unit: "day" };

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
