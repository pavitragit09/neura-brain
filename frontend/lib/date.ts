export function parseUTCDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  // If the date string has no timezone offset, append 'Z' to treat it as UTC
  if (!dateStr.endsWith("Z") && !dateStr.includes("+") && !/[-+]\d{2}:\d{2}$/.test(dateStr)) {
    return new Date(dateStr + "Z");
  }
  return new Date(dateStr);
}

// In production, set to undefined to use the browser's automatic user-local timezone
const TARGET_LOCALE = "en-IN";
const TARGET_TIMEZONE = "Asia/Kolkata";

/**
 * Formats a Date object or UTC ISO string into the target local timezone representation.
 * Example output: "5 Jul, 01:38 PM"
 */
export function formatDateTime(
  dateInput: string | Date | undefined | null,
  options: { dateOnly?: boolean; monthLong?: boolean } = {}
): string {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? parseUTCDate(dateInput) : dateInput;

  try {
    const formatter = new Intl.DateTimeFormat(TARGET_LOCALE, {
      day: "numeric",
      month: options.monthLong ? "long" : "short",
      year: "numeric", // Always format year for simple dates
      hour: options.dateOnly ? undefined : "2-digit",
      minute: options.dateOnly ? undefined : "2-digit",
      hour12: options.dateOnly ? undefined : true,
      timeZone: TARGET_TIMEZONE,
    });

    if (options.dateOnly) {
      return formatter.format(date);
    }

    const parts = formatter.formatToParts(date);

    let day = "";
    let month = "";
    let hour = "";
    let minute = "";
    let dayPeriod = "";

    for (const part of parts) {
      if (part.type === "day") day = part.value;
      else if (part.type === "month") month = part.value;
      else if (part.type === "hour") hour = part.value;
      else if (part.type === "minute") minute = part.value;
      else if (part.type === "dayPeriod") dayPeriod = part.value;
    }

    const period = dayPeriod.toUpperCase();
    return `${day} ${month}, ${hour}:${minute} ${period}`;
  } catch (err) {
    console.error("Error formatting date:", err);
    return new Date(date).toLocaleString();
  }
}
