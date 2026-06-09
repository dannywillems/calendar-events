# Conference Calendar

A simple, visual-only calendar for tracking conferences and planning trips
across multiple years. Events are described in a single YAML file. There is no
backend, no database, and no server: the site is fully static and is built and
deployed to GitHub Pages by a GitHub Actions workflow.

Live site: https://dannywillems.github.io/calendar-events/

## Features

- Month calendar grid with multi-day events drawn as continuous colored spans.
- List view grouped by year and month.
- Multi-dimensional tag filtering: filter by field, country, kind, status, and
  year. Selections are combined with OR within a facet and AND across facets.
- Color the events by any facet (default: kind), with a matching legend.
- Past events are dimmed, today is marked, filter options are derived from the
  YAML automatically.

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
  url: https://rwc.iacr.org/2026/ # optional
  notes: Single track. # optional
```

Only `name` and `start` are required. New `field` and `country` values appear as
filter options automatically; no code change is needed. Malformed entries (bad
date, missing required field, unknown `kind` or `status`) are listed in a banner
in the app instead of breaking the calendar.

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

The site deploys automatically to GitHub Pages on every push to `main` via
`.github/workflows/deploy.yml`.

One-time setup in the GitHub repository:

1. Go to Settings, then Pages.
2. Under "Build and deployment", set Source to "GitHub Actions".

After that, every push to `main` rebuilds and redeploys the site. You can also
trigger a deploy manually from the Actions tab (workflow_dispatch).

### Repo name and base path

This is a project Pages site served from a subpath, so Vite is configured with
`base = '/calendar-events/'`. The repo name lives in one place,
`vite.config.ts`. If you rename the repo, update `REPO` there. For a user or
organization page (`<user>.github.io`) or a custom domain, build with
`BASE_PATH=/ npm run build`.

## Tech stack

- Vite + React + TypeScript (strict)
- Tailwind CSS v4
- js-yaml for parsing
- lucide-react for icons
