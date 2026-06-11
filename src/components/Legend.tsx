import type { FacetKey } from '../lib/types';
import { FACET_LABELS } from '../lib/filters';
import { colorFor, type ColorMap } from '../lib/colors';
import { describe } from '../lib/glossary';

interface LegendProps {
  facet: FacetKey;
  values: string[];
  colorMap: ColorMap;
}

// Explains which color maps to which value for the active color facet.
export default function Legend({ facet, values, colorMap }: LegendProps) {
  if (values.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="font-medium text-slate-500 dark:text-slate-400">
        {FACET_LABELS[facet]}:
      </span>
      {values.map((value) => (
        <span
          key={value}
          title={describe(value)}
          className="flex items-center gap-1.5"
        >
          <span
            className={`inline-block h-3 w-3 rounded-full ${colorFor(colorMap, value).dot}`}
          />
          <span className="text-slate-700 dark:text-slate-200">{value}</span>
        </span>
      ))}
    </div>
  );
}
