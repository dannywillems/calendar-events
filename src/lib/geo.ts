// Map a country to its continent so the continent facet is derived
// automatically from the `country` field. New events only need a country; the
// continent follows. A country can also set `continent` explicitly in the YAML
// to override or fill a gap. Unknown countries simply have no continent and do
// not appear in the continent filter until added here.

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
  'united kingdom': 'Europe',
  uk: 'Europe',
  england: 'Europe',
  scotland: 'Europe',

  // Asia
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
  israel: 'Asia',
  'saudi arabia': 'Asia',
  'united arab emirates': 'Asia',
  uae: 'Asia',
  qatar: 'Asia',
  turkey: 'Asia',

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

export function continentOf(country: string | undefined): string | undefined {
  if (!country) {
    return undefined;
  }
  return COUNTRY_TO_CONTINENT[country.trim().toLowerCase()];
}
