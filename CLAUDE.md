# NetaVeYoav — Project-level Claude Instructions

## Project

Static shirt catalog web app for the NetaVeYoav design brand.
- ~5 designs, each with style + color variants
- Browse only (no cart/checkout)
- Hosted on Railway

## Stack

- **Backend**: FastAPI (Python) — serves static files only
- **Frontend**: Plain HTML + Tailwind CSS (CDN) + vanilla JS
- **Data**: `catalog.json` — source of truth for designs, styles, colors

## Image Convention

Images go in: `static/images/<design_id>/<style_id>_<color_id>.jpg`

Example: `static/images/design1/hoodie_black.jpg`

Style IDs: `unisex_tshirt`, `long_sleeve`, `womens_tshirt`, `hoodie`
Color IDs: `black`, `offwhite`, `navy`, `white`, `gray`

When an image is missing, the UI shows a placeholder with the expected filename.

## Model Strategy

Inherited from global `~/.claude/CLAUDE.md`. Default: opusplan.

## Agent Roster

Inherited from global settings. Use `quick-task` (haiku) for trivial edits.

## RPER Enforcement

Defined in global `~/.claude/CLAUDE.md` — applies here.
