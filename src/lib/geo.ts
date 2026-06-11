// Map a country to its continent so the continent facet is derived
// automatically from the `country` field. New events only need a country; the
// continent follows. A country can also set `continent` explicitly in the YAML
// to override or fill a gap. Unknown countries simply have no continent and do
// not appear in the continent filter until added here.
//
// The Middle East is treated as its own region, separate from Asia.

const COUNTRY_TO_CONTINENT: Record<string, string> = {
  // Europe
  belgium: 'Europe',
  croatia: 'Europe',
  france: 'Europe',
  germany: 'Europe',
  netherlands: 'Europe',
  spain: 'Europe',
  italy: 'Europe',
  portugal: 'Europe',
  switzerland: 'Europe',
  austria: 'Europe',
  poland: 'Europe',
  sweden: 'Europe',
  norway: 'Europe',
  denmark: 'Europe',
  finland: 'Europe',
  ireland: 'Europe',
  greece: 'Europe',
  'czech republic': 'Europe',
  czechia: 'Europe',
  hungary: 'Europe',
  romania: 'Europe',
  malta: 'Europe',
  cyprus: 'Europe',
  luxembourg: 'Europe',
  'united kingdom': 'Europe',
  uk: 'Europe',
  england: 'Europe',
  scotland: 'Europe',

  // Asia (East, South, and Southeast Asia)
  taiwan: 'Asia',
  singapore: 'Asia',
  india: 'Asia',
  japan: 'Asia',
  china: 'Asia',
  'south korea': 'Asia',
  'hong kong': 'Asia',
  thailand: 'Asia',
  malaysia: 'Asia',
  indonesia: 'Asia',
  vietnam: 'Asia',
  philippines: 'Asia',

  // Middle East
  israel: 'Middle East',
  'saudi arabia': 'Middle East',
  'united arab emirates': 'Middle East',
  uae: 'Middle East',
  qatar: 'Middle East',
  bahrain: 'Middle East',
  kuwait: 'Middle East',
  oman: 'Middle East',
  jordan: 'Middle East',
  lebanon: 'Middle East',
  turkey: 'Middle East',

  // North America
  usa: 'North America',
  'united states': 'North America',
  'united states of america': 'North America',
  canada: 'North America',
  mexico: 'North America',

  // South America
  brazil: 'South America',
  argentina: 'South America',
  chile: 'South America',
  colombia: 'South America',
  peru: 'South America',
  uruguay: 'South America',

  // Africa
  'south africa': 'Africa',
  egypt: 'Africa',
  kenya: 'Africa',
  nigeria: 'Africa',
  morocco: 'Africa',

  // Oceania
  australia: 'Oceania',
  'new zealand': 'Oceania',
};

// Approximate country-center coordinates [lat, lng], used as a fallback for the
// map when an event does not set its own lat/lng. Per-event coordinates are
// preferred so that several events in the same country do not stack on one pin.
const COUNTRY_COORDS: Record<string, [number, number]> = {
  belgium: [50.85, 4.35],
  croatia: [45.1, 15.2],
  france: [46.6, 2.2],
  germany: [51.0, 9.0],
  netherlands: [52.1, 5.3],
  'united kingdom': [54.0, -2.0],
  uk: [54.0, -2.0],
  taiwan: [23.7, 121.0],
  singapore: [1.35, 103.82],
  india: [22.0, 79.0],
  japan: [36.2, 138.3],
  'south korea': [36.5, 127.8],
  'saudi arabia': [24.0, 45.0],
  'united arab emirates': [24.0, 54.0],
  uae: [24.0, 54.0],
  israel: [31.5, 34.9],
  usa: [39.5, -98.35],
  'united states': [39.5, -98.35],
  canada: [56.1, -106.3],
  brazil: [-14.2, -51.9],
  argentina: [-38.4, -63.6],
  'south africa': [-30.6, 22.9],
  australia: [-25.3, 133.8],
};

export function continentOf(country: string | undefined): string | undefined {
  if (!country) {
    return undefined;
  }
  return COUNTRY_TO_CONTINENT[country.trim().toLowerCase()];
}

export function countryCoords(
  country: string | undefined,
): [number, number] | undefined {
  if (!country) {
    return undefined;
  }
  return COUNTRY_COORDS[country.trim().toLowerCase()];
}
