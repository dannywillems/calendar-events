import type { CalEvent, FacetKey } from './types';

// Filter selections. Within a facet, selected values are combined with OR. The
// facets and the year group are combined with AND. An empty group imposes no
// constraint.
export interface FilterState {
  field: Set<string>;
  country: Set<string>;
  kind: Set<string>;
  status: Set<string>;
  years: Set<number>;
}

export const FACET_KEYS: FacetKey[] = ['field', 'country', 'kind', 'status'];

export const FACET_LABELS: Record<FacetKey, string> = {
  field: 'Field',
  country: 'Country',
  kind: 'Kind',
  status: 'Status',
};

export function emptyFilter(): FilterState {
  return {
    field: new Set(),
    country: new Set(),
    kind: new Set(),
    status: new Set(),
    years: new Set(),
  };
}

// The values an event carries for a given facet. `field` is a list; the others
// are single-valued (or empty when unset).
export function facetValues(event: CalEvent, facet: FacetKey): string[] {
  switch (facet) {
    case 'field':
      return event.field;
    case 'country':
      return event.country ? [event.country] : [];
    case 'kind':
      return event.kind ? [event.kind] : [];
    case 'status':
      return event.status ? [event.status] : [];
  }
}

// The single value used to color an event by a facet (first field for `field`).
export function colorValue(
  event: CalEvent,
  facet: FacetKey,
): string | undefined {
  return facetValues(event, facet)[0];
}

// Every calendar year an event touches.
export function eventYears(event: CalEvent): number[] {
  const years: number[] = [];
  for (let y = event.start.getFullYear(); y <= event.end.getFullYear(); y++) {
    years.push(y);
  }
  return years;
}

export interface FacetOptions {
  field: string[];
  country: string[];
  kind: string[];
  status: string[];
  years: number[];
}

// Derive the available filter options from the loaded events, so new tags in
// the YAML appear automatically without code changes.
export function deriveOptions(events: CalEvent[]): FacetOptions {
  const collect = (facet: FacetKey): string[] => {
    const set = new Set<string>();
    for (const event of events) {
      for (const value of facetValues(event, facet)) {
        set.add(value);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  };

  const years = new Set<number>();
  for (const event of events) {
    for (const year of eventYears(event)) {
      years.add(year);
    }
  }

  return {
    field: collect('field'),
    country: collect('country'),
    kind: collect('kind'),
    status: collect('status'),
    years: [...years].sort((a, b) => a - b),
  };
}

function intersects(values: string[], selected: Set<string>): boolean {
  return values.some((v) => selected.has(v));
}

export function matchesFilter(event: CalEvent, filter: FilterState): boolean {
  for (const facet of FACET_KEYS) {
    const selected = filter[facet];
    if (selected.size > 0 && !intersects(facetValues(event, facet), selected)) {
      return false;
    }
  }
  if (filter.years.size > 0) {
    if (!eventYears(event).some((y) => filter.years.has(y))) {
      return false;
    }
  }
  return true;
}

export function activeFilterCount(filter: FilterState): number {
  return (
    filter.field.size +
    filter.country.size +
    filter.kind.size +
    filter.status.size +
    filter.years.size
  );
}
