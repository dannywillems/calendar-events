// Color handling. Tailwind only keeps class names it can see as literal tokens
// in the source, so every color class below is written out in full. Values are
// mapped to a palette entry by their position in the sorted list of values for
// a facet, which keeps colors stable as long as the set of values is stable.

export interface ColorClasses {
  // Solid bar used in the calendar grid.
  bar: string;
  // Small dot used in the legend.
  dot: string;
  // Chip background + text used for tags in the list view and details.
  chip: string;
}

const PALETTE: ColorClasses[] = [
  {
    bar: 'bg-rose-500 text-white',
    dot: 'bg-rose-500',
    chip: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200',
  },
  {
    bar: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  },
  {
    bar: 'bg-emerald-500 text-white',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  {
    bar: 'bg-sky-500 text-white',
    dot: 'bg-sky-500',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200',
  },
  {
    bar: 'bg-violet-500 text-white',
    dot: 'bg-violet-500',
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
  },
  {
    bar: 'bg-pink-500 text-white',
    dot: 'bg-pink-500',
    chip: 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-200',
  },
  {
    bar: 'bg-teal-500 text-white',
    dot: 'bg-teal-500',
    chip: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200',
  },
  {
    bar: 'bg-indigo-500 text-white',
    dot: 'bg-indigo-500',
    chip: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200',
  },
  {
    bar: 'bg-lime-500 text-white',
    dot: 'bg-lime-500',
    chip: 'bg-lime-100 text-lime-800 dark:bg-lime-500/20 dark:text-lime-200',
  },
  {
    bar: 'bg-orange-500 text-white',
    dot: 'bg-orange-500',
    chip: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200',
  },
];

// Fallback for events with no value for the active color facet.
export const UNKNOWN_COLOR: ColorClasses = {
  bar: 'bg-slate-400 text-white',
  dot: 'bg-slate-400',
  chip: 'bg-slate-200 text-slate-700 dark:bg-slate-600/40 dark:text-slate-200',
};

export type ColorMap = Map<string, ColorClasses>;

// Assign a palette entry to each value, ordered so colors are deterministic.
export function buildColorMap(values: string[]): ColorMap {
  const map: ColorMap = new Map();
  const sorted = [...values].sort((a, b) => a.localeCompare(b));
  sorted.forEach((value, index) => {
    map.set(value, PALETTE[index % PALETTE.length]);
  });
  return map;
}

export function colorFor(
  map: ColorMap,
  value: string | undefined,
): ColorClasses {
  if (!value) {
    return UNKNOWN_COLOR;
  }
  return map.get(value) ?? UNKNOWN_COLOR;
}
