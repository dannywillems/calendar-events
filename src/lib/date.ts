// Date helpers. Everything works on local-midnight Date objects so that day
// comparisons are stable and free of timezone drift.

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Parse a YYYY-MM-DD string into a local-midnight Date. Returns null if the
// string is not a valid calendar date.
export function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // Reject overflow like 2026-02-30 (which JS would roll forward).
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function today(): Date {
  return startOfDay(new Date());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function monthName(monthIndex: number): string {
  return MONTH_NAMES[monthIndex];
}

export function monthLabel(year: number, monthIndex: number): string {
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

// Day index with Monday = 0 ... Sunday = 6.
export function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Inclusive overlap test between two day ranges.
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart <= bEnd && aEnd >= bStart;
}

// Format a single-day or multi-day range for display, built explicitly so the
// output does not depend on locale handling of partial date skeletons.
export function formatRange(start: Date, end: Date): string {
  const m1 = MONTH_SHORT[start.getMonth()];
  const m2 = MONTH_SHORT[end.getMonth()];
  const d1 = start.getDate();
  const d2 = end.getDate();
  const y1 = start.getFullYear();
  const y2 = end.getFullYear();

  if (sameDay(start, end)) {
    return `${m1} ${d1}, ${y1}`;
  }
  if (y1 === y2 && start.getMonth() === end.getMonth()) {
    return `${m1} ${d1}-${d2}, ${y1}`;
  }
  if (y1 === y2) {
    return `${m1} ${d1} - ${m2} ${d2}, ${y1}`;
  }
  return `${m1} ${d1}, ${y1} - ${m2} ${d2}, ${y2}`;
}
