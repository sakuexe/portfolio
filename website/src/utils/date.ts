// Content dates are calendar dates (UTC midnight), so format them in UTC.
// Otherwise a build machine west of UTC would render them a day early.
const dayFormat = new Intl.DateTimeFormat("fi-FI", { timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("fi-FI", { timeZone: "UTC", month: "numeric", year: "numeric" });

/** 1.5.2024 */
export const formatDay = (date?: Date) => (date ? dayFormat.format(date) : "");

/** 5.2024 */
export const formatMonth = (date?: Date) => (date ? monthFormat.format(date) : "");

/** Ongoing (no end) first, newest start first; then finished ones, latest end first. */
export function byRecency(a: { start?: Date; end?: Date }, b: { start?: Date; end?: Date }) {
  if (!a.end !== !b.end) return a.end ? 1 : -1;
  if (a.end && b.end) return b.end.getTime() - a.end.getTime();
  return (b.start?.getTime() ?? 0) - (a.start?.getTime() ?? 0);
}
