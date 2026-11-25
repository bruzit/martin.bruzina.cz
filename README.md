# martin.bruzina.cz

[![License](https://img.shields.io/badge/license-MIT%20%2B%20proprietary-blue)](#license-and-copyright)
[![Last commit](https://img.shields.io/github/last-commit/bruzit/martin.bruzina.cz)](https://github.com/bruzit/martin.bruzina.cz/commits)
[![MegaLinter](https://github.com/bruzit/martin.bruzina.cz/actions/workflows/megalinter.yaml/badge.svg)](https://github.com/bruzit/martin.bruzina.cz/actions/workflows/megalinter.yaml)
[![Test](https://github.com/bruzit/martin.bruzina.cz/actions/workflows/test.yaml/badge.svg)](https://github.com/bruzit/martin.bruzina.cz/actions/workflows/test.yaml)
[![Semantic Release](https://github.com/bruzit/martin.bruzina.cz/actions/workflows/semantic-release.yaml/badge.svg)](https://github.com/bruzit/martin.bruzina.cz/actions/workflows/semantic-release.yaml)

Personal web of Martin Bružina: e-business card, CV and blog. Today it is the e-business card, a static [Nuxt](https://nuxt.com/) site; the CV and the blog come later.

## Features

- E-business card: photo, bio, consulting offer, contact, legal footer with the address on a map of your choice.
- Light and dark theme, following the system; prints on one A4 page, always light.
- 404 signpost that answers with a real 404 status.
- Findable: title, description, canonical URL, OpenGraph, JSON-LD `Person`, `robots.txt`, `sitemap.xml`.
- Security headers for Cloudflare Pages in `_headers`: a CSP that allows only this site's scripts plus hashes of the inline ones, HSTS, and friends.
- Content in YAML under [`content/`](content/), checked against a schema on every build.

## Requirements

- [Node.js](https://nodejs.org/) LTS with npm.
- Local tests: Playwright Chromium with its system libraries; HTML validation also needs Java.

## Installation and Setup

```shell
npm ci
npm run dev
```

The dev server runs at <http://localhost:3000>.

## Usage

- Change the texts in [`content/`](content/): `card.yaml` (the card), `footer.yaml` (legal footer), `person.yaml` (head tags and JSON-LD), `error.yaml` (404 and error page). A build fails on invalid data and says which field is wrong.
- Build the static site into `.output/public`:

  ```shell
  npm run build
  ```

- Serve the build the way Cloudflare Pages does, with `_headers` applied and missing pages answered by `404.html`:

  ```shell
  node tests/serve.ts
  ```

## Development

- [`app/`](app/): pages, components, the error page, styles and theme.
- [`schemas/`](schemas/): zod schemas for the content files.
- [`headers.ts`](headers.ts): writes `_headers`, with a hash for every inline script, after the build.
- [`tests/`](tests/): Playwright tests and the static test server.

## Testing

Build first, then:

```shell
npx playwright install --with-deps chromium
npm test
npm run validate
npx lhci autorun
```

- `npm test`: Playwright with axe; content, links, layout, keyboard focus, print, head tags, CSP, 404.
- `npm run validate`: Nu Html Checker on every generated page.
- `npx lhci autorun`: Lighthouse; every category at 1.0 except performance at 0.9 or more, LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms.

CI also checks links with lychee and licensing with `reuse lint`.

## Integration and Deployment

| Workflow                                                            | Trigger                          | Purpose                                                                                                                     |
|---------------------------------------------------------------------|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [MegaLinter](.github/workflows/megalinter.yaml)                     | Pull request                     | Lint changed files; required check `Required (MegaLinter)`                                                                  |
| [MegaLinter Scheduled](.github/workflows/megalinter-scheduled.yaml) | Weekly, Monday 06:00 UTC; manual | Lint the whole codebase                                                                                                     |
| [Test](.github/workflows/test.yaml)                                 | Pull request                     | Build, validate HTML, check internal links, run Playwright and Lighthouse, lint licensing; required check `Required (Test)` |
| [Links Scheduled](.github/workflows/links-scheduled.yaml)           | Weekly, Monday 06:00 UTC; manual | Check external links                                                                                                        |
| [Semantic Release](.github/workflows/semantic-release.yaml)         | Push to `main`                   | Version, changelog and GitHub release via the shared semantic-release action                                                |
| [Deploy](.github/workflows/deploy.yaml)                             | Pull request; push to `main`     | Build, test and deploy to Cloudflare Pages: a smoke-checked preview per pull request, production from `main`                |

Deployment to [Cloudflare Pages](https://pages.cloudflare.com/) by Direct Upload with wrangler.

## Support

Best effort; [open a GitHub issue](../../issues).

## Contributing

Open a pull request to `main`. Commits follow the [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/), from which semantic-release sets versions and the changelog automatically.

## License and Copyright

Copyright © 2026 Martin Bružina. [REUSE 3.3](https://reuse.software/spec-3.3/) compliant; [`REUSE.toml`](REUSE.toml) maps paths to licenses:

- Code (components, configuration, tests, workflows): MIT, [`LICENSES/MIT.txt`](LICENSES/MIT.txt).
- Content, photo, icons derived from it, and visual style (`content/`, `public/photo.jpg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `app/assets/css/`, `app/app.config.ts`): all rights reserved, [`LICENSES/LicenseRef-Proprietary.txt`](LICENSES/LicenseRef-Proprietary.txt).
- Third party, fetched at build: Bootstrap Icons (MIT), Simple Icons (CC0 1.0), Libre Franklin (SIL OFL 1.1). The Mapy.com mark and other brand marks belong to their owners.

## References

- [Nuxt](https://nuxt.com/docs) and [Nuxt UI](https://ui.nuxt.com/)
- [BruzIT GitHub Actions and Workflows](https://github.com/bruzit/github-actions-and-workflows)
- [BruzIT Repository Template](https://github.com/bruzit/template)

## Stats

| Metric           | Badges                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Commits          | [![Commits total](https://img.shields.io/github/commit-activity/t/bruzit/martin.bruzina.cz?label=commits%20total)](https://github.com/bruzit/martin.bruzina.cz/commits/main)                                                                                                                                                                                                                                                                                               |
| Issues           | [![Issues open](https://img.shields.io/github/issues/bruzit/martin.bruzina.cz?label=issues)](https://github.com/bruzit/martin.bruzina.cz/issues) [![Issues total](https://img.shields.io/github/issues-search?query=repo%3Abruzit%2Fmartin.bruzina.cz%20is%3Aissue&label=issues%20total)](https://github.com/bruzit/martin.bruzina.cz/issues?q=is%3Aissue)                                                                                                                 |
| Pull requests    | [![Pull requests open, not draft](https://img.shields.io/github/issues-search?query=repo%3Abruzit%2Fmartin.bruzina.cz%20is%3Apr%20is%3Aopen%20draft%3Afalse&label=PRs%20open)](https://github.com/bruzit/martin.bruzina.cz/pulls?q=is%3Apr+is%3Aopen+draft%3Afalse) [![Pull requests total](https://img.shields.io/github/issues-search?query=repo%3Abruzit%2Fmartin.bruzina.cz%20is%3Apr&label=PRs%20total)](https://github.com/bruzit/martin.bruzina.cz/pulls?q=is%3Apr) |
| Checks on `main` | [![Checks on main](https://img.shields.io/github/check-runs/bruzit/martin.bruzina.cz/main?label=checks%20%28main%29)](https://github.com/bruzit/martin.bruzina.cz/actions?query=branch%3Amain)                                                                                                                                                                                                                                                                             |
| Releases         | [![Latest release](https://img.shields.io/github/v/release/bruzit/martin.bruzina.cz)](https://github.com/bruzit/martin.bruzina.cz/releases/latest) [![Commits since latest release](https://img.shields.io/github/commits-since/bruzit/martin.bruzina.cz/latest)](https://github.com/bruzit/martin.bruzina.cz/releases)                                                                                                                                                    |
| Community        | [![Stargazers](https://img.shields.io/github/stars/bruzit/martin.bruzina.cz)](https://github.com/bruzit/martin.bruzina.cz/stargazers) [![Forks](https://img.shields.io/github/forks/bruzit/martin.bruzina.cz)](https://github.com/bruzit/martin.bruzina.cz/forks) [![Contributors](https://img.shields.io/github/contributors/bruzit/martin.bruzina.cz)](https://github.com/bruzit/martin.bruzina.cz/graphs/contributors)                                                  |
