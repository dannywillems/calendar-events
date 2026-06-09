import { MapPin } from 'lucide-react';
import type { CalEvent, FacetKey } from '../lib/types';
import { formatRange, monthName, today } from '../lib/date';
import { colorFor, type ColorMap } from '../lib/colors';
import { colorValue } from '../lib/filters';
import { describe } from '../lib/glossary';

interface ListViewProps {
  events: CalEvent[];
  colorFacet: FacetKey;
  colorMap: ColorMap;
  onSelect: (event: CalEvent) => void;
}

interface MonthGroup {
  year: number;
  month: number;
  events: CalEvent[];
}

// Group chronologically by year then month. Input is assumed sorted by start.
function groupByMonth(events: CalEvent[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const event of events) {
    const year = event.start.getFullYear();
    const month = event.start.getMonth();
    const last = groups[groups.length - 1];
    if (last && last.year === year && last.month === month) {
      last.events.push(event);
    } else {
      groups.push({ year, month, events: [event] });
    }
  }
  return groups;
}

export default function ListView({
  events,
  colorFacet,
  colorMap,
  onSelect,
}: ListViewProps) {
  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No events match the current filters.
      </p>
    );
  }

  const now = today();
  const groups = groupByMonth(events);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={`${group.year}-${group.month}`}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {monthName(group.month)} {group.year}
          </h3>
          <ul className="flex flex-col gap-2">
            {group.events.map((event) => {
              const isPast = event.end < now;
              const color = colorFor(colorMap, colorValue(event, colorFacet));
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(event)}
                    className={`flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50 ${
                      isPast ? 'opacity-60' : ''
                    }`}
                  >
                    <span
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${color.dot}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {event.name}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatRange(event.start, event.end)}
                        </span>
                      </span>
                      {event.location && (
                        <span className="mt-0.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                      )}
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {event.kind && (
                          <span
                            title={describe(event.kind)}
                            className={`rounded px-1.5 py-0.5 text-xs ${color.chip}`}
                          >
                            {event.kind}
                          </span>
                        )}
                        {event.field.map((f) => (
                          <span
                            key={f}
                            title={describe(f)}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {f}
                          </span>
                        ))}
                        {event.status && (
                          <span
                            title={describe(event.status)}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {event.status}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
