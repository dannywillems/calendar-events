// Allowed values for the constrained facets. `field` and `country` are open
// lists and are not constrained here.
export const KINDS = ['academic', 'industry', 'business', 'community'] as const;
export const STATUSES = ['confirmed', 'tentative', 'interested'] as const;

export type Kind = (typeof KINDS)[number];
export type Status = (typeof STATUSES)[number];

// The facets a user can filter and color by.
export type FacetKey = 'field' | 'continent' | 'country' | 'kind' | 'status';

// A normalized, validated event used by the UI. Dates are real Date objects at
// local midnight; `end` is always set (equal to `start` for single-day events).
export interface CalEvent {
  id: string;
  name: string;
  start: Date;
  end: Date;
  location?: string;
  country?: string;
  continent?: string;
  lat?: number;
  lng?: number;
  field: string[];
  kind?: Kind;
  status?: Status;
  url?: string;
  notes?: string;
}

// A problem found while parsing one entry in the YAML file.
export interface LoadError {
  index: number;
  name?: string;
  message: string;
}

export interface LoadResult {
  events: CalEvent[];
  errors: LoadError[];
}
