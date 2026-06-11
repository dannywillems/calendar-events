# Conference Calendar

A simple, visual-only calendar for tracking conferences and planning trips
across multiple years. Events are described in a single YAML file. There is no
backend, no database, and no server: the site is fully static and is built and
deployed to Cloudflare Pages by a GitHub Actions workflow.

Live site: https://calendar-events.pages.dev/

## Features

- Three views: month calendar grid (multi-day events as continuous spans), a
  list grouped by year and month, and a world map of event locations.
- Multi-dimensional tag filtering: filter by field, continent, country, kind,
  status, and year, using compact dropdowns. Selections are combined with OR
  within a facet and AND across facets. Filters apply to all three views.
- Color the events by any facet (default: kind), with a matching legend; map
  pins use the same colors.
- Export the filtered events to an iCalendar (.ics) file.
- Past events are dimmed, today is marked, filter options are derived from the
  YAML automatically.

The map uses Leaflet with OpenStreetMap tiles. Map tiles are fetched from
OpenStreetMap servers at runtime when the map view is open.

## Adding events

Edit `data/events.yaml`. Each entry is one event.

```yaml
- name: Real World Crypto 2026 # required
  start: 2026-03-25 # required, YYYY-MM-DD
  end: 2026-03-27 # optional, defaults to start
  location: Taipei, Taiwan # optional, free text
  country: Taiwan # optional, geography facet
  field: [infosec, crypto] # optional, one tag or a list
  kind: academic # optional: academic | industry | business | community
  status: confirmed # optional: confirmed | tentative | interested
  lat: 25.0330 # optional, map latitude
  lng: 121.5654 # optional, map longitude
  url: https://rwc.iacr.org/2026/ # optional
  notes: Single track. # optional
```

Only `name` and `start` are required. New `field` and `country` values appear as
filter options automatically; no code change is needed. The continent is derived
from the country (see `src/lib/geo.ts`), or set `continent` explicitly to
override. For the map, set `lat`/`lng` to the city coordinates; if omitted, the
map falls back to an approximate country center, so events in the same country
would stack on one pin. Malformed entries (bad date, missing required field,
unknown `kind` or `status`) are listed in a banner in the app instead of
breaking the calendar.

## Running locally

Requires Node 24.

```bash
make install   # install dependencies
make dev       # start the dev server (http://localhost:5173)
```

Other targets:

```bash
make build       # type-check and build for production into dist/
make preview     # serve the production build locally
make typecheck   # run the TypeScript type checker
make format      # format the code with Prettier
make check       # typecheck + format check
```

## Deploying

The site deploys to Cloudflare Pages on every push to `main` via
`.github/workflows/deploy.yml`. The repository can stay private: the workflow
builds in GitHub Actions and uploads only the built `dist/` to Cloudflare with
Wrangler, so Cloudflare never gets access to the source.

One-time setup:

1. Create the Pages project (Direct Upload) once, either in the Cloudflare
   dashboard (Workers & Pages, Create, Pages, Direct Upload, name it
   `calendar-events`) or with the CLI:

   ```bash
   npx wrangler pages project create calendar-events --production-branch main
   ```

2. Create a Cloudflare API token with the `Cloudflare Pages: Edit` permission
   (dash.cloudflare.com, My Profile, API Tokens). Note your Account ID from the
   Workers & Pages overview.

3. Add two GitHub repository secrets (Settings, Secrets and variables, Actions):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

After that, every push to `main` builds and deploys. The CI workflow
(`.github/workflows/ci.yml`) type-checks, format-checks, and builds on pull
requests without deploying. A manual deploy can be triggered from the Actions
tab (workflow_dispatch).

### Base path

Cloudflare Pages serves the site at the domain root, so Vite uses `base = '/'`
(in `vite.config.ts`). For sub-path hosting (e.g. a GitHub project page), build
with `BASE_PATH=/calendar-events/ npm run build`.

## Tech stack

- Vite + React + TypeScript (strict)
- Tailwind CSS v4
- Leaflet + react-leaflet (OpenStreetMap tiles) for the map
- js-yaml for parsing
- lucide-react for icons
