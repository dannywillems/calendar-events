import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, List } from 'lucide-react';
import type { CalEvent, FacetKey } from './lib/types';
import { loadEvents } from './lib/events';
import { today } from './lib/date';
import { buildColorMap } from './lib/colors';
import {
  deriveOptions,
  emptyFilter,
  matchesFilter,
  type FilterState,
} from './lib/filters';
import FilterBar from './components/FilterBar';
import CalendarGrid from './components/CalendarGrid';
import ListView from './components/ListView';
import EventDetail from './components/EventDetail';
import Legend from './components/Legend';

type View = 'calendar' | 'list';

interface MonthCursor {
  year: number;
  month: number;
}

// Pick the month to show first: the next upcoming event, else the earliest, else
// the current month.
function initialCursor(events: CalEvent[]): MonthCursor {
  const now = today();
  const base = events.find((e) => e.end >= now) ?? events[0];
  const date = base ? base.start : now;
  return { year: date.getFullYear(), month: date.getMonth() };
}

export default function App() {
  const { events, errors } = useMemo(() => loadEvents(), []);
  const options = useMemo(() => deriveOptions(events), [events]);

  const [filter, setFilter] = useState<FilterState>(emptyFilter);
  const [colorFacet, setColorFacet] = useState<FacetKey>('kind');
  const [view, setView] = useState<View>('calendar');
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [cursor, setCursor] = useState<MonthCursor>(() =>
    initialCursor(events),
  );

  const filtered = useMemo(
    () => events.filter((e) => matchesFilter(e, filter)),
    [events, filter],
  );
  const colorMap = useMemo(
    () => buildColorMap(options[colorFacet]),
    [options, colorFacet],
  );

  const toggleFacet = (facet: FacetKey, value: string) => {
    setFilter((prev) => {
      const next = new Set(prev[facet]);
      next.has(value) ? next.delete(value) : next.add(value);
      return { ...prev, [facet]: next };
    });
  };

  const toggleYear = (year: number) => {
    setFilter((prev) => {
      const next = new Set(prev.years);
      next.has(year) ? next.delete(year) : next.add(year);
      return { ...prev, years: next };
    });
  };

  const stepMonth = (delta: number) => {
    setCursor((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const goToday = () => {
    const now = today();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  };

  const viewButton = (target: View, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setView(target)}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        view === target
          ? 'bg-sky-600 text-white'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold sm:text-2xl">Conference Calendar</h1>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
            {viewButton(
              'calendar',
              'Calendar',
              <CalendarDays className="h-4 w-4" />,
            )}
            {viewButton('list', 'List', <List className="h-4 w-4" />)}
          </div>
        </header>

        {errors.length > 0 && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <p className="mb-1 flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              {errors.length} event{errors.length === 1 ? '' : 's'} could not be
              loaded
            </p>
            <ul className="list-inside list-disc">
              {errors.map((err, i) => (
                <li key={i}>
                  {err.name ? `"${err.name}": ` : `Entry ${err.index + 1}: `}
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <FilterBar
          options={options}
          filter={filter}
          colorFacet={colorFacet}
          matchCount={filtered.length}
          totalCount={events.length}
          onToggleFacet={toggleFacet}
          onToggleYear={toggleYear}
          onClear={() => setFilter(emptyFilter())}
          onColorFacetChange={setColorFacet}
        />

        <Legend
          facet={colorFacet}
          values={options[colorFacet]}
          colorMap={colorMap}
        />

        {view === 'calendar' ? (
          <CalendarGrid
            events={filtered}
            year={cursor.year}
            month={cursor.month}
            colorFacet={colorFacet}
            colorMap={colorMap}
            onSelect={setSelected}
            onPrev={() => stepMonth(-1)}
            onNext={() => stepMonth(1)}
            onToday={goToday}
          />
        ) : (
          <ListView
            events={filtered}
            colorFacet={colorFacet}
            colorMap={colorMap}
            onSelect={setSelected}
          />
        )}
      </div>

      {selected && (
        <EventDetail event={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
