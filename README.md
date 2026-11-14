# Elegant Theme

A Frappe app that restyles the **Frappe v16.55** desk (and the matching **ERPNext v16**) without editing framework or ERPNext files. The default look is a light page with white cards, a deep teal-slate sidebar, and one teal accent.

It is installed with hooks (`app_include_css`, `app_include_js`, `web_include_css`, `web_include_js`). Styles live in `elegant_theme/public/scss/elegant_theme.bundle.scss` and are built by Frappe’s esbuild pipeline. A single DocType, **Elegant Theme Settings**, can change the accent and the font at runtime.

## Requirements

| | Version |
| --- | --- |
| Frappe | `>=16.55.0,<17` |
| ERPNext | v16 (same minor as Frappe; not a hard dependency) |
| Python | `>=3.14` (Frappe v16.55’s requirement) |
| Node.js | `>=24` (Frappe v16.55’s requirement) |

The desk this theme targets is the v16 Espresso shell: `.body-sidebar`, `.es-button`, and the `--btn-primary` / `--desk-sidebar-bg` tokens. It is not a v15 theme.

## Install

```bash
bench get-app https://github.com/savadibrahim/elegant_theme
bench --site <site> install-app elegant_theme
bench build --app elegant_theme
```

`bench build` compiles `elegant_theme.bundle.scss` and `elegant_theme.bundle.js` into `sites/assets`. Reload the desk after building. Install this app after ERPNext so its stylesheet is included after ERPNext’s.

Open **Elegant Theme Settings** (System Manager) to set:

- **Accent Color** — buttons, links, focus rings, active tabs, number-card stripe, sidebar highlight
- **Font** — `Inter` (already self-hosted by Frappe) or `System`

Save, then reload. The current form previews the change immediately. Other users pick it up on the next boot.

## Design tokens

Defaults live at the top of `elegant_theme/public/scss/elegant_theme.bundle.scss`.

| Token | Role | Default |
| --- | --- | --- |
| `--et-accent` | Single accent | `#0F766E` |
| `--et-on-accent` | Label on accent buttons | `#FFFFFF` |
| `--et-sidebar-bg` | Sidebar / dock | `#0C1C20` |
| `--et-sidebar-text` | Sidebar title and active row ink | `#F3FBFA` |
| `--et-sidebar-muted` | Sidebar icons and idle rows | `#B7D4D0` |
| `--et-page-bg` | Desk canvas behind white cards | `#F4F6F5` |
| `--et-card-bg` | Cards, forms, login card | `#FFFFFF` |

`#0F766E` with white text is about 5.5:1. Sidebar text on `#0C1C20` is higher. If a custom accent is too light for white type, the desk script switches the button label to dark ink.

Frappe variables that should follow the accent are aliased once:

```css
--primary: var(--et-accent);
--btn-primary: var(--et-accent);
--focus-default: var(--et-focus-ring);
--desk-sidebar-bg: var(--et-sidebar-bg);
```

`--bg-color` is left alone so list sticky columns, child tables, kanban, and report surfaces keep Frappe’s own colors. The light canvas is painted on `body`, `.main-section`, and `.page-container` only while the desk sidebar is present. Dark mode (`[data-theme="dark"]`) keeps Frappe’s dark page and still uses the teal accent; the sidebar stays dark in both themes.

To change the default without the DocType, edit the `:root` block and run `bench build --app elegant_theme`.

## What is styled

- Sidebar and dock: dark surface, light type, teal hover and active row
- Primary actions: `.btn-primary` and `.es-button[data-variant="solid"]`
- Focus rings, active form tabs, section-head marker
- Number cards (left accent) and shortcut hover
- List-row hover, modals, dropdowns
- Login, signup, and password pages (`web_include_css`)

Print formats reset the accent back to neutral ink. Grid column widths, kanban, and POS layout are not repositioned.

## Uninstall

```bash
bench --site <site> uninstall-app elegant_theme
bench remove-app elegant_theme
```

`uninstall-app` drops **Elegant Theme Settings** and unhooks the assets. Rebuild or clear the site cache if a browser still has the old CSS:

```bash
bench --site <site> clear-cache
```

## Development checks

From this repository, without a bench:

```bash
python -m unittest tests/test_colors.py
node tests/test_theme_colors.mjs
npx --yes sass elegant_theme/public/scss/elegant_theme.bundle.scss /tmp/elegant_theme.css
```

On a bench, after `install-app`:

```bash
bench build --app elegant_theme
bench --site <site> migrate
```
