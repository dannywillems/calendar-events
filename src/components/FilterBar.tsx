import { X } from 'lucide-react';
import type { FacetKey } from '../lib/types';
import {
  FACET_KEYS,
  FACET_LABELS,
  activeFilterCount,
  type FacetOptions,
  type FilterState,
} from '../lib/filters';

interface FilterBarProps {
  options: FacetOptions;
  filter: FilterState;
  colorFacet: FacetKey;
  matchCount: number;
  totalCount: number;
  onToggleFacet: (facet: FacetKey, value: string) => void;
  onToggleYear: (year: number) => void;
  onClear: () => void;
  onColorFacetChange: (facet: FacetKey) => void;
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const base =
    'rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400';
  const on = 'border-sky-500 bg-sky-500 text-white hover:bg-sky-600';
  const off =
    'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700';
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`${base} ${active ? on : off}`}
    >
      {label}
    </button>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// All filter controls: one group per facet, a year group, the color-by
// selector, and a summary line with a live match count and clear-all.
export default function FilterBar({
  options,
  filter,
  colorFacet,
  matchCount,
  totalCount,
  onToggleFacet,
  onToggleYear,
  onClear,
  onColorFacetChange,
}: FilterBarProps) {
  const active = activeFilterCount(filter);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      {options.years.length > 0 && (
        <Group label="Year">
          {options.years.map((year) => (
            <Chip
              key={year}
              label={String(year)}
              active={filter.years.has(year)}
              onClick={() => onToggleYear(year)}
            />
          ))}
        </Group>
      )}

      {FACET_KEYS.map((facet) =>
        options[facet].length > 0 ? (
          <Group key={facet} label={FACET_LABELS[facet]}>
            {options[facet].map((value) => (
              <Chip
                key={value}
                label={value}
                active={filter[facet].has(value)}
                onClick={() => onToggleFacet(facet, value)}
              />
            ))}
          </Group>
        ) : null,
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <label htmlFor="color-by" className="font-medium">
            Color by
          </label>
          <select
            id="color-by"
            value={colorFacet}
            onChange={(e) => onColorFacetChange(e.target.value as FacetKey)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {FACET_KEYS.map((facet) => (
              <option key={facet} value={facet}>
                {FACET_LABELS[facet]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600 dark:text-slate-300">
            {matchCount} of {totalCount} events
          </span>
          {active > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <X className="h-3.5 w-3.5" />
              Clear {active} filter{active === 1 ? '' : 's'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
