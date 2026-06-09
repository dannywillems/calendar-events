import { JSON_SCHEMA, load } from 'js-yaml';
import eventsYaml from '../../data/events.yaml?raw';
import { parseDate } from './date';
import { continentOf, countryCoords } from './geo';
import {
  KINDS,
  STATUSES,
  type CalEvent,
  type Kind,
  type LoadError,
  type LoadResult,
  type Status,
} from './types';

// Coerce a `field` value (string, list, or missing) into a clean string list.
function normalizeField(value: unknown): string[] {
  if (value == null) {
    return [];
  }
  if (typeof value === 'string') {
    return value.trim() ? [value.trim()] : [];
  }
  if (Array.isArray(value)) {
    return value
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

// Parse and validate every entry. Bad entries are collected as errors instead
// of throwing, so one malformed event does not blank the whole calendar.
function validate(raw: unknown): LoadResult {
  const events: CalEvent[] = [];
  const errors: LoadError[] = [];

  if (!Array.isArray(raw)) {
    errors.push({
      index: -1,
      message: 'Top level of events.yaml must be a list of events.',
    });
    return { events, errors };
  }

  raw.forEach((item, index) => {
    if (item == null || typeof item !== 'object') {
      errors.push({ index, message: 'Event must be a mapping.' });
      return;
    }
    const obj = item as Record<string, unknown>;
    const name = asString(obj.name);
    if (!name) {
      errors.push({ index, message: 'Missing required field: name.' });
      return;
    }

    const startRaw = obj.start;
    if (typeof startRaw !== 'string') {
      errors.push({ index, name, message: 'Missing required field: start.' });
      return;
    }
    const start = parseDate(startRaw);
    if (!start) {
      errors.push({
        index,
        name,
        message: `Invalid start date: ${startRaw} (expected YYYY-MM-DD).`,
      });
      return;
    }

    let end = start;
    if (obj.end != null) {
      if (typeof obj.end !== 'string') {
        errors.push({ index, name, message: 'Field end must be a string.' });
        return;
      }
      const parsedEnd = parseDate(obj.end);
      if (!parsedEnd) {
        errors.push({
          index,
          name,
          message: `Invalid end date: ${obj.end} (expected YYYY-MM-DD).`,
        });
        return;
      }
      if (parsedEnd < start) {
        errors.push({
          index,
          name,
          message: 'Field end is before start.',
        });
        return;
      }
      end = parsedEnd;
    }

    let kind: Kind | undefined;
    if (obj.kind != null) {
      if (!KINDS.includes(obj.kind as Kind)) {
        errors.push({
          index,
          name,
          message: `Unknown kind: ${String(obj.kind)} (expected one of ${KINDS.join(', ')}).`,
        });
        return;
      }
      kind = obj.kind as Kind;
    }

    let status: Status | undefined;
    if (obj.status != null) {
      if (!STATUSES.includes(obj.status as Status)) {
        errors.push({
          index,
          name,
          message: `Unknown status: ${String(obj.status)} (expected one of ${STATUSES.join(', ')}).`,
        });
        return;
      }
      status = obj.status as Status;
    }

    const country = asString(obj.country);
    // Use explicit coordinates when both are given; otherwise fall back to an
    // approximate country center so the event still appears on the map.
    const explicitLat = asNumber(obj.lat);
    const explicitLng = asNumber(obj.lng);
    const fallback = countryCoords(country);
    const lat = explicitLat ?? fallback?.[0];
    const lng = explicitLng ?? fallback?.[1];
    events.push({
      id: `${index}-${name}`,
      name,
      start,
      end,
      location: asString(obj.location),
      country,
      // Use an explicit continent if given, otherwise derive it from country.
      continent: asString(obj.continent) ?? continentOf(country),
      lat,
      lng,
      field: normalizeField(obj.field),
      kind,
      status,
      url: asString(obj.url),
      notes: asString(obj.notes),
    });
  });

  events.sort((a, b) => a.start.getTime() - b.start.getTime());
  return { events, errors };
}

// Load all events from the bundled YAML file. Parse errors are surfaced as a
// single load error rather than crashing the app.
export function loadEvents(): LoadResult {
  let parsed: unknown;
  try {
    // Parse with the JSON schema so unquoted dates like 2026-03-25 stay as
    // strings instead of being converted to JavaScript Date objects (which the
    // YAML timestamp type in the default schema would do).
    parsed = load(eventsYaml, { schema: JSON_SCHEMA });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      events: [],
      errors: [
        { index: -1, message: `Could not parse events.yaml: ${message}` },
      ],
    };
  }
  return validate(parsed);
}
