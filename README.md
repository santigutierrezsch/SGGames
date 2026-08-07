# SG Games

SG Games is a static browser game site. It includes a homepage, game library, schedule tools, legal pages, backup domain status, settings, and a collection of packaged web games.

The site is designed to run from plain static hosting. There is no build step required for normal use.

## Project Structure

```text
.
+-- index.html              # Homepage
+-- games.json              # Game library data used by /games/
+-- games/
|   +-- index.html          # Main game library page
|   +-- ...                 # Individual packaged games
+-- css/
|   +-- master.css          # Shared site styling
+-- js/
|   +-- main.js             # Shared site behavior
|   +-- mimicry.js          # Tab cloaking/settings behavior
+-- settings/               # Settings page
+-- schedule/               # Schedule page
+-- backup-domains/         # Backup domain status page
+-- sponsors/               # Sponsors page
+-- legal/                  # Legal/contact/about pages
+-- archive/                # Archived tools/pages
+-- apps/                   # Apps placeholder page
+-- 404/                    # Custom 404 page
```

## Running Locally

Use any static server from the repository root.

With Node:

```bash
npx serve .
```

With Python, if installed:

```bash
python -m http.server 8000
```

Then open the printed local URL in your browser.

Some pages fetch local files such as `games.json`, so opening `index.html` directly from the filesystem may not behave exactly like the hosted site.

## Editing the Game Library

The main games page reads from `games.json`.

Each entry should look like this:

```json
{
  "name": "Basket Random",
  "href": "basket-random",
  "categories": ["Sports"]
}
```

Fields:

- `name`: Display name shown on the games page.
- `href`: Folder/path under `/games/`, without the leading `/games/`.
- `categories`: List of category names used by the category filter.

Use `"Miscellaneous"` for games that do not fit a clear category.

## Important Editing Rules

- Do not rename public routes unless you also update every link that points to them.
- Avoid editing individual folders under `games/**` unless you are intentionally changing that packaged game.
- Shared site changes usually belong in `index.html`, `games/index.html`, `css/master.css`, `js/main.js`, or `js/mimicry.js`.
- Keep localStorage keys stable because settings and quickplay depend on them.
- Keep `games.json` valid JSON. A trailing comma will break the games page.

## Current Site Features

- Searchable game library
- Category filtering from `games.json`
- Favorites saved in localStorage
- Quick Play controls
- Tab cloaking/settings support
- Schedule widget and full schedule page
- Backup domain status page
- Custom 404 page with game search
- Shared footer and legal/contact pages
- Instagram promo for `@sggames.unblocked`

## Deployment

Because this is a static site, it can be deployed to GitHub Pages, Netlify, Vercel, Cloudflare Pages, or similar static hosts.

Deploy the repository root as the site root. Make sure these files are included:

- `index.html`
- `games.json`
- `games/index.html`
- `css/**`
- `js/**`
- all SG-owned page folders
- all required game folders under `games/**`

## Maintenance Checklist

Before publishing a larger update:

- Verify `/` loads.
- Verify `/games/` loads and search/category filters work.
- Verify several game links open correctly.
- Verify `/games.json` returns valid JSON.
- Verify `/settings/`, `/schedule/`, `/backup-domains/`, `/legal/contact/`, and `/404/`.
- Check the browser console for new errors.
- Test at desktop and mobile widths.

## Credits

SG Games is owned and operated by Santiago Gutierrez.

See [LICENSE](LICENSE) for license details.
