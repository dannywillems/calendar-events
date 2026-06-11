import type { CalEvent } from './types';
import { addDays } from './date';

// Export events to the iCalendar (.ics) format, RFC 5545. Conferences are
// modeled as multi-day all-day events, which use a date-only DTSTART and an
// exclusive DTEND (the day after the last day).

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// Date-only value: YYYYMMDD, from the local date components.
function dateValue(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

// UTC timestamp value: YYYYMMDDTHHMMSSZ.
function timestamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

// Escape a text value per RFC 5545 section 3.3.11.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Fold content lines longer than 75 octets. Content here is ASCII, so a
// character count is a safe proxy for the octet count.
function fold(line: string): string {
  if (line.length <= 75) {
    return line;
  }
  const parts: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  parts.push(` ${rest}`);
  return parts.join('\r\n');
}

function buildDescription(event: CalEvent): string {
  const lines: string[] = [];
  if (event.notes) {
    lines.push(event.notes);
  }
  const tags = [
    event.kind ? `kind: ${event.kind}` : '',
    event.field.length ? `field: ${event.field.join(', ')}` : '',
    event.country ? `country: ${event.country}` : '',
  ].filter(Boolean);
  if (tags.length) {
    lines.push(tags.join('\n'));
  }
  if (event.url) {
    lines.push(event.url);
  }
  return lines.join('\n');
}

function eventToVevent(event: CalEvent, stamp: string): string {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${event.id.replace(/\s+/g, '-')}@calendar-events`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dateValue(event.start)}`,
    // DTEND is exclusive for all-day events, so use the day after the end date.
    `DTEND;VALUE=DATE:${dateValue(addDays(event.end, 1))}`,
    `SUMMARY:${escapeText(event.name)}`,
  ];
  if (event.location) {
    lines.push(`LOCATION:${escapeText(event.location)}`);
  }
  const description = buildDescription(event);
  if (description) {
    lines.push(`DESCRIPTION:${escapeText(description)}`);
  }
  if (event.url) {
    lines.push(`URL:${escapeText(event.url)}`);
  }
  lines.push('END:VEVENT');
  return lines.map(fold).join('\r\n');
}

export function generateIcs(events: CalEvent[]): string {
  const stamp = timestamp(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dannywillems//calendar-events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events.map((e) => eventToVevent(e, stamp)),
    'END:VCALENDAR',
  ];
  return `${lines.join('\r\n')}\r\n`;
}

// Trigger a download of the given events as a .ics file in the browser.
export function downloadIcs(events: CalEvent[], filename = 'conferences.ics') {
  const ics = generateIcs(events);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
