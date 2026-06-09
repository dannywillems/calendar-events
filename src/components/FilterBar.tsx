import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
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

// A compact dropdown that holds a checkbox list. Keeps the filter bar short as
// the number of options grows, instead of wrapping into long rows of chips.
function MultiSelect({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const count = selected.size;
  const disabled = options.length === 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          count > 0
            ? 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-300'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {label}
        {count > 0 && (
          <span className="rounded-full bg-sky-600 px-1.5 text-xs font-medium text-white">
            {count}
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-1 max-h-64 w-56 overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-800">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <input
                type="checkbox"
                checked={selected.has(option)}
                onChange={() => onToggle(option)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// All filter controls: a dropdown per facet plus a year dropdown, the color-by
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
  const yearOptions = options.years.map(String);
  const yearSelected = new Set([...filter.years].map(String));

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-center gap-2">
        <MultiSelect
          label="Year"
          options={yearOptions}
          selected={yearSelected}
          onToggle={(value) => onToggleYear(Number(value))}
        />
        {FACET_KEYS.map((facet) => (
          <MultiSelect
            key={facet}
            label={FACET_LABELS[facet]}
            options={options[facet]}
            selected={filter[facet]}
            onToggle={(value) => onToggleFacet(facet, value)}
          />
        ))}
      </div>

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
